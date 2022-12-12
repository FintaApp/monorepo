import moment, { Moment } from "moment-timezone";
import * as _ from "lodash";

import { wrapper } from "~/utils/backend/apiWrapper";
import * as cio from "~/utils/backend/cio";
import { Frequencies_Enum } from "~/graphql/backend/sdk";
import { graphql } from "~/graphql/backend";
import * as easyCron from "~/utils/backend/easyCron";
import { storage } from "~/utils/backend/nhost";

const frequencyToMomentUnit = {
  [Frequencies_Enum.Daily]: 'day' as moment.unitOfTime.DurationConstructor,
  [Frequencies_Enum.Weekly]: 'isoWeek' as moment.unitOfTime.DurationConstructor,
  [Frequencies_Enum.Monthly]: 'month' as moment.unitOfTime.DurationConstructor,
  [Frequencies_Enum.Quarterly]: 'quarter' as moment.unitOfTime.DurationConstructor,
  [Frequencies_Enum.Yearly]: 'year' as moment.unitOfTime.DurationConstructor
}

const integrationLogos = {
  'coda': "https://verxjplbkfvenqdmjbfv.nhost.run/v1/storage/files/a22fb763-424f-43bb-a938-3830c7ed2e38",
  'airtable': "https://verxjplbkfvenqdmjbfv.nhost.run/v1/storage/files/6e33939d-8438-4d76-bc3d-a2a430573f90",
  'google': "https://verxjplbkfvenqdmjbfv.nhost.run/v1/storage/files/928a2575-f5a6-4bb1-945c-af268efc511a",
  'notion': "https://verxjplbkfvenqdmjbfv.nhost.run/v1/storage/files/a85d7e51-edf2-450f-8053-72b2243ee0dc"
}

const parseNumber = (x: any): number => {
  if ( isNaN(parseInt(x)) ) { return 0 };
  return parseInt(x) || 0
}

export default wrapper('public', async function handler({ req, logger }) {
  const userId = req.body.userId;
  if ( !userId ) { return { status: 400, message: "Missing user ID" }}

  // Fetch user profile
  const userProfile = await graphql.GetUserProfile({ userId })
    .then(async response => {
      await logger.info("User profile fetched", { response });
      return response.userProfile
    })
  if ( !userProfile ) { return { status: 400, message: "Missing user profile" }};
  const { timezone, syncUpdatesFrequency: frequency, isSubscribedSyncUpdates, syncUpdatesJobId } = userProfile;
  if ( !isSubscribedSyncUpdates ) {
    syncUpdatesJobId && await easyCron.disableJob({ jobId: syncUpdatesJobId });
    return { status: 200, message: "OK" }
  }
  const { start, end } = getTimePeriod(timezone || 'America/New_York', frequency || Frequencies_Enum.Weekly);

  // Fetch Other Data
  const [
    { user: { email, profile: { stripeData: { trialEndsAt, subscription, hasAppAccess } }}},
    { plaidItems },
    { destinations },
    { sync_logs }
  ] = await Promise.all([
    graphql.GetUser({ userId }).then(response => {
      logger.info("User fetched", { response })
      return ({ user: response.user!})
    }),
    graphql.GetPlaidItems({ where: { user_id: { _eq: userId }, disabled_at: { _is_null: true }}, accounts_where: { is_closed: { _eq: false }}})
      .then(response => {
        logger.info("Plaid items fetched", { response });
        return response
      }),
    graphql.GetDestinations({ where: { user_id: { _eq: userId }, disabled_at: { _is_null: true }}})
      .then(response => {
        logger.info("Destinations fetched", { response });
        return response
      }),
    graphql.GetUserSyncLogs({ userId, start: start.toDate(), end: end.toDate() })
      .then(response => {
        logger.info("Sync logs fetched", { response })
        return response
      })
  ]);

  if ( !hasAppAccess ) { return { status: 200, message: 'OK' }}

  await cio.sendTransactionalEmail({ messageKey: cio.TRANSACTIONAL_EMAILS.SYNC_UPDATE, user: { id: userId, email }, logger, data: {
    start: start.format("LL"),
      end: end.format("LL"),
      time_period: getTimePeriodString(start, frequency!),
      frequency,
      subscription: {
        status: subscription?.status || 'trialing',
        trial_ends_at: trialEndsAt,
        current_period_end: subscription?.currentPeriodEnd,
        cancel_at_period_end: subscription?.cancelAtPeriodEnd,
        interval: subscription?.interval
      },
      total_plaid_items: plaidItems.length,
      plaid_items: plaidItems.map(item => ({
        institution_name: item.institution.name,
        error: item.error,
        accounts_count: item.accounts.length,
        logo: item.institution.logo_file_id ? storage.getPublicUrl({ fileId: item.institution.logo_file_id }) : "https://verxjplbkfvenqdmjbfv.nhost.run/v1/storage/files/5e74a97a-6d40-4c95-8dfb-ffce6b65d33a"
      })),
      total_destinations: destinations.length,
      destinations: destinations.map(destination => {
        const syncLogs = sync_logs.filter(log => !!log.destination_sync_logs.find(dsl => dsl.destination_id === destination.id && !dsl.error ));
        const lastAccountsSync = _.orderBy(syncLogs.filter(sl => sl.metadata?.target_table === 'accounts'), 'created_at', 'desc')[0];
        const lastTransactionsSync = _.orderBy(syncLogs.filter(sl => sl.metadata?.target_table === 'transactions'), 'created_at', 'desc')[0];
        const lastHoldingsSync = _.orderBy(syncLogs.filter(sl => sl.metadata?.target_table === 'holdings'), 'created_at', 'desc')[0];
        const lastInvestmentTransactionsSync = _.orderBy(syncLogs.filter(sl => sl.metadata?.target_table === 'investment_transactions'), 'created_at', 'desc')[0];

        const sortedSyncLogs = destination.integration.id === 'coda'
          ? [lastAccountsSync,lastTransactionsSync, lastHoldingsSync, lastInvestmentTransactionsSync].filter(x => !!x)
          : syncLogs
        
        const reducedSyncLogs = sortedSyncLogs.reduce((total, sl) => {
          let accounts = 0;
          let transactions = 0;
          let holdings = 0;
          let investmentTransactions = 0;

          try {
            if ( ['destination', 'refresh', 'historical_sync'].includes(sl.trigger) ) {
              accounts = sl.plaid_item_sync_logs.reduce((t, pisl) => t + parseNumber(pisl.accounts?.added?.length), 0)
              transactions = sl.plaid_item_sync_logs.reduce((t, pisl) => t + parseNumber(pisl.transactions?.added), 0)
              holdings = sl.plaid_item_sync_logs.reduce((t, pisl) => t + parseNumber(pisl.holdings?.added), 0)
              investmentTransactions = sl.plaid_item_sync_logs.reduce((t, pisl) => t + parseNumber(pisl.investment_transactions?.added), 0)
            } else {
              accounts = parseNumber(sl.destination_sync_logs.find(dsl => dsl.destination_id === destination.id)?.accounts?.added?.length)
              transactions = parseNumber(sl.destination_sync_logs.find(dsl => dsl.destination_id === destination.id)?.transactions?.added)
              holdings = parseNumber(sl.destination_sync_logs.find(dsl => dsl.destination_id === destination.id)?.accounts?.holdings) 
              investmentTransactions = parseNumber(sl.destination_sync_logs.find(dsl => dsl.destination_id === destination.id)?.investment_transactions?.added)
            }
          } catch (error) { console.log(error)}

          return {
            accounts: total.accounts + accounts,
            transactions: total.transactions + transactions,
            holdings: total.holdings + holdings,
            investmentTransactions: total.investmentTransactions + investmentTransactions
          }
        }, { accounts: 0, transactions: 0, holdings: 0, investmentTransactions: 0 })
        
        return {
          id: destination.id,
          logo: integrationLogos[destination.integration.id as keyof typeof integrationLogos],
          destination_name: destination.name,
          integration: destination.integration.name,
          sync_start_date: destination.sync_start_date,
          total_syncs: syncLogs.length,
          ...reducedSyncLogs
        }
      })
  }})

  return { 
    status: 200, 
    message: "OK"
  }
});

const getTimePeriod = ( timezone: string, frequency: Frequencies_Enum ) => {
  const unit = frequencyToMomentUnit[frequency];
  const start = moment.tz(timezone).subtract(1, unit).startOf(unit);
  const end = moment.tz(timezone).subtract(1, unit).endOf(unit);
  return { start, end }
}

const getTimePeriodString = (dateMoment: Moment, frequency: Frequencies_Enum ) => {
  if ( frequency === Frequencies_Enum.Daily ) { return dateMoment.format("LL") }
  if ( frequency === Frequencies_Enum.Weekly ) { return dateMoment.format("[Week] W, YYYY") }
  if ( frequency === Frequencies_Enum.Monthly ) { return dateMoment.format("MMMM YYYY")}
  if ( frequency === Frequencies_Enum.Quarterly ) { return dateMoment.format("[Q]Q YYYY") }
  if ( frequency === Frequencies_Enum.Yearly ) { return dateMoment.format("[Year] YYYY")}
}