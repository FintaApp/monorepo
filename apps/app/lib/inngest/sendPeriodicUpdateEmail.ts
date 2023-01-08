import { Frequency, Integration, SyncResult, Table } from "@prisma/client";
import { createScheduledFunction } from "inngest";
import moment, { Moment } from "moment-timezone";
import { SyncMetadata } from "~/types";
import { db } from "../db";
import { calculateHasAppAccess, calculateTrialEndsAt, getCustomer, getCustomerSubscription } from "../stripe";
import { sendTransactionalEmail, EMAIL_TEMPLATES } from "../cio";

export const sendPeriodicUpdateEmail = createScheduledFunction(
  "Send Periodic Update Email",
  "0 * * * *",
  async () => {
    // Get all users with periodic update emails enabled
    const shouldIncludeNewUsers = moment().day() === 1 && moment().tz('America/New_York').hour() === 12 ;
    const emailFilter = shouldIncludeNewUsers 
      ? { OR: { sendNextPeriodicUpdateEmailAt: null, AND: { sendNextPeriodicUpdateEmailAt: { lte: new Date() }}} } 
      : { sendNextPeriodicUpdateEmailAt: { lte: new Date() }}

    const users = await db.user.findMany({
      where: {
        isSubscribedPeriodicUpdates: true,
        disabledAt: null,
        ...emailFilter
      }
    });

    return Promise.all(users.map(async user => {
      const { sendNextPeriodicUpdateEmailAt, dateRangeStart, dateRangeEnd  } = getConfig({ timezone: user.timezone, frequency: user.periodicUpdatesFrequency })
      // Check to see if user has active subscription
      const [ customer, subscription ] = await Promise.all([
        getCustomer({ customerId: user.stripeCustomerId }),
        getCustomerSubscription({ customerId: user.stripeCustomerId })
      ]);


      const trialEndsAt = calculateTrialEndsAt({ customer, subscriptionTrialEndsAt: subscription?.trial_end })
      const hasAppAccess = calculateHasAppAccess({ subscription, trialEndsAt });

      if ( !hasAppAccess ) { return db.user.update({ where: { id: user.id }, data: { sendNextPeriodicUpdateEmailAt }})};

      const syncEndedAtFilter = { gte: dateRangeStart.toDate(), lte: dateRangeEnd.toDate() }
      const [ plaidItems, destinations, syncs ] = await Promise.all([
        db.plaidItem.findMany({ where: { userId: user.id, disabledAt: null }, include: { institution: true, accounts: true }}),
        db.destination.findMany({ where: { userId: user.id, disabledAt: null }}),
        db.sync.findMany({ where: { userId: user.id, isSuccess: true, endedAt: syncEndedAtFilter }, orderBy: { endedAt: 'desc' }, include: { results: true }})
      ]);

      const data = {
        start: dateRangeStart.format("LL"),
        end: dateRangeEnd.format("LL"),
        time_period: getTimePeriodString(dateRangeStart, user.periodicUpdatesFrequency),
        frequency: user.periodicUpdatesFrequency,
        subscription: {
          status: subscription?.status || 'trialing',
          trial_ends_at: trialEndsAt,
          current_period_end: subscription ? moment.unix(subscription?.current_period_end).toDate() : undefined,
          cancel_at_period_end: subscription?.cancel_at_period_end,
          interval: subscription?.items.data[0].plan.interval,
          has_subscription: !!subscription
        },
        total_plaid_items: plaidItems.length,
        plaid_items: plaidItems.map(item => ({
          institution_name: item.institution.name,
          logo: item.institution.logoUrl || "https://storage.googleapis.com/integration_logos/bank.svg",
          accounts_count: item.accounts.length,
          error: item.error
        })),
        total_destinations: destinations.length,
        destinations: destinations.map(destination => {
          const destinationtriggeredSyncs = syncs.filter(sync => sync.triggerDestinationId === destination.id);
          const itemTriggeredResults = syncs
            .filter(sync => !sync.triggerDestinationId)
            .reduce((prevValue, sync) => prevValue.concat(sync.results.filter(result => result.destinationId === destination.id)), [] as SyncResult[])
          const allSyncResults = syncs.reduce((prevValue, sync) => prevValue.concat(sync.results.filter(result => result.destinationId === destination.id)), [] as SyncResult[])

          const lastAccountsSync = destinationtriggeredSyncs.find(sync => (sync.metadata as SyncMetadata)?.targetTable === Table.Accounts);
          const lastTransactionsSync = destinationtriggeredSyncs.find(sync => (sync.metadata as SyncMetadata)?.targetTable === Table.Transactions);
          const lastHoldingsSync = destinationtriggeredSyncs.find(sync => (sync.metadata as SyncMetadata)?.targetTable === Table.Holdings);
          const lastInvestmentTransactionsSync = destinationtriggeredSyncs.find(sync => (sync.metadata as SyncMetadata)?.targetTable === Table.InvestmentTransactions);

          const accountsAdded = destination.integration === Integration.Coda
            ? lastAccountsSync?.results.reduce((prev, result) => prev + result.accountsAdded, 0)
            : allSyncResults.reduce((prev, result) => prev + result.accountsAdded, 0)
          const accountsUpdated = destination.integration === Integration.Coda
          ? 0
          : allSyncResults.reduce((prev, result) => prev + result.accountsUpdated, 0)
          const transactionsAdded = destination.integration === Integration.Coda
            ? lastTransactionsSync?.results.reduce((prev, result) => prev + result.transactionsAdded, 0)
            : allSyncResults.reduce((prev, result) => prev + result.transactionsAdded, 0)
          const transactionsUpdated = destination.integration === Integration.Coda
            ? 0
            : allSyncResults.reduce((prev, result) => prev + result.transactionsUpdated, 0)
          const transactionsRemoved = destination.integration === Integration.Coda
            ? 0
            : allSyncResults.reduce((prev, result) => prev + result.transactionsRemoved, 0)
          const holdingsAdded = destination.integration === Integration.Coda
            ? lastHoldingsSync?.results.reduce((prev, result) => prev + result.holdingsAdded, 0)
            : allSyncResults.reduce((prev, result) => prev + result.holdingsAdded, 0)
          const holdingsUpdated = destination.integration === Integration.Coda
          ? 0
          : allSyncResults.reduce((prev, result) => prev + result.holdingsUpdated, 0)
          const investmentTransactionsAdded = destination.integration === Integration.Coda
            ? lastInvestmentTransactionsSync?.results.reduce((prev, result) => prev + result.investmentTransactionsAdded, 0)
            : allSyncResults.reduce((prev, result) => prev + result.investmentTransactionsAdded, 0)


          return {
            id: destination.id,
            is_coda: destination.integration === Integration.Coda,
            destination_name: destination.name,
            logo: integrationLogos[destination.integration],
            sync_start_date: destination.syncStartDate,
            total_syncs: destinationtriggeredSyncs.length + itemTriggeredResults.length,
            accounts_added: accountsAdded || 0,
            accounts_updated: accountsUpdated || 0,
            transactions_added: transactionsAdded || 0,
            transactions_updated: transactionsUpdated || 0,
            transactions_removed: transactionsRemoved || 0,
            holdings_added: holdingsAdded || 0,
            holdings_updated: holdingsUpdated || 0,
            investment_transactions_added: investmentTransactionsAdded || 0
          }
        })
      }

      return sendTransactionalEmail({ templateId: EMAIL_TEMPLATES.PERIODIC_UPDATE, userId: user.id, email: user.email!, data })
        .then(() => db.user.update({ where: { id: user.id }, data: { sendNextPeriodicUpdateEmailAt }}))
    }))
  }
)

// Helpers
const frequencyToMomentUnit = {
  [Frequency.Daily]: { duration: 'day', of: 'day'},
  [Frequency.Weekly]: { duration: 'week', of: 'isoWeek'},
  [Frequency.Monthly]: { duration: 'month', of: 'month'},
  [Frequency.Quarterly]: { duration: 'quarter', of: 'quarter'},
  [Frequency.Yearly]: { duration: 'year', of: 'year'}
} as Record<Frequency, { duration: moment.unitOfTime.DurationConstructor, of: moment.unitOfTime.StartOf }>;

const getTimePeriodString = (dateMoment: Moment, frequency: Frequency ) => {
  if ( frequency === Frequency.Daily ) { return dateMoment.format("LL") }
  if ( frequency === Frequency.Weekly ) { return dateMoment.format("[Week] W, YYYY") }
  if ( frequency === Frequency.Monthly ) { return dateMoment.format("MMMM YYYY")}
  if ( frequency === Frequency.Quarterly ) { return dateMoment.format("[Q]Q YYYY") }
  if ( frequency === Frequency.Yearly ) { return dateMoment.format("[Year] YYYY")}
}

const getConfig = ({ frequency, timezone }: { frequency: Frequency, timezone: string }) => {
  const { duration, of } = frequencyToMomentUnit[frequency];
  return {
    sendNextPeriodicUpdateEmailAt: moment().tz(timezone).add(1, duration).startOf(of).hour(9).minute(0).second(0).millisecond(0).toDate(),
    dateRangeStart: moment.tz(timezone).subtract(1, duration).startOf(of),
    dateRangeEnd: moment.tz(timezone).subtract(1, duration).endOf(of)
  }
}

const integrationLogos = {
  [Integration.Airtable]: "https://storage.googleapis.com/integration_logos/airtable.png",
  [Integration.Coda]: "https://storage.googleapis.com/integration_logos/coda.png",
  [Integration.Google]: "https://storage.googleapis.com/integration_logos/google.png",
  [Integration.Notion]: "https://storage.googleapis.com/integration_logos/notion.png"
}