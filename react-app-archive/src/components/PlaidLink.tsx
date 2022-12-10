import { useCallback, useEffect } from "react";
import * as Sentry from "@sentry/react";
import {
  PlaidLinkOnEvent,
  PlaidLinkOnExit,
  PlaidLinkOnSuccess,
  usePlaidLink
} from "react-plaid-link";

import * as analytics from "src/lib/analytics";
import { Plaid_Institutions_Constraint, Plaid_Institutions_Update_Column, useDeletePlaidAccountsMutation, useUpsertPlaidItemMutation, PlaidAccounts_Constraint } from "src/graphql";
import { exchangePlaidPublicToken } from "src/lib/functions";
import { handleAppError } from "src/lib/handleAppError";
import { useToast } from "src/lib/useToast";
import { PlaidItemModel } from "src/types";

interface PlaidLinkProps {
  onSuccessCallback: (plaidItem?: PlaidItemModel | null) => void;
  onExitCallback: () => void;
  linkToken: string;
  receivedRedirectUri?: string
}

export const PlaidLink = ({ onSuccessCallback, onExitCallback, linkToken, receivedRedirectUri }: PlaidLinkProps) => {
  const renderToast = useToast();
  const [ deletePlaidAccountsMutation ] = useDeletePlaidAccountsMutation({ refetchQueries: 'all' });
  const [ upsertPlaidItemMutation ] = useUpsertPlaidItemMutation({ refetchQueries: 'all' });

  const onSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token, metadata) => {
    const { institution, accounts, link_session_id } = metadata;
    Sentry.setContext("Link Session Id", { link_session_id });
    Sentry.setContext("Metadata", metadata);

    const { access_token: accessToken, item_id } = await exchangePlaidPublicToken({ publicToken: public_token })
    .catch(error => { handleAppError({ renderToast, error }); return { access_token: null, item_id: null }});
    if ( !(accessToken && item_id )) { return; }

    const deleteNonSharedAccountsPromise = deletePlaidAccountsMutation({
      variables: {
        where: {
          _and: [
            { plaid_item_id: { _eq: item_id }},
            { id: { _nin: accounts.map(account => account.id )}}
          ]
        }
      }
    });

    const upsertPlaidItemPromise = upsertPlaidItemMutation({
      variables: {
        plaidItem: {
          id: item_id,
          accessToken,
          error: null,
          consentExpiresAt: null,
          institution: {
            data: {
              name: institution?.name,
              id: institution?.institution_id
            },
            on_conflict: {
              constraint: Plaid_Institutions_Constraint.PlaidInstitutionsPkey,
              update_columns: [ Plaid_Institutions_Update_Column.Name ]
            }
          },
          accounts: {
            data: accounts.map(account => ({
              id: account.id,
              name: account.name,
              mask: account.mask
            })),
            on_conflict: {
              constraint: PlaidAccounts_Constraint.PlaidAccountsPkey,
              update_columns: []
            }
          }
        }
      }
    })

    Promise.all([deleteNonSharedAccountsPromise, upsertPlaidItemPromise])
    .then(([ _, upsertPlaidItemResponse ]) => onSuccessCallback(upsertPlaidItemResponse.data?.plaidItem))
  }, [ onSuccessCallback, deletePlaidAccountsMutation, renderToast, upsertPlaidItemMutation ]);

  const onEvent = useCallback<PlaidLinkOnEvent>((eventName, metadata) => {
    localStorage.removeItem('link_token')
    if (["HANDOFF", "EXIT"].includes(eventName)) { onExitCallback() }
    if ( eventName === "OPEN" ) { analytics.track({ event: analytics.EventNames.ADD_INSTITUTION_PORTAL_OPENED }); }
  }, [ onExitCallback ])

  const onExit = useCallback<PlaidLinkOnExit>((error, metadata) => {
    localStorage.removeItem('link_token')
    if ( error ) { Sentry.captureException(new Error("Plaid Link error"), scope => scope.setContext("On Exit Context", { error, metadata })); };
    analytics.track({ event: analytics.EventNames.ADD_INSTITUTION_PORTAL_CLOSED, properties: { has_error: !!error }});
    onExitCallback();
  }, [ onExitCallback ])

  const plaidConfig = {
    token: linkToken,
    onSuccess,
    onExit,
    onEvent,
    receivedRedirectUri
  }

  const { open, ready } = usePlaidLink(plaidConfig);

  useEffect(() => { if (ready) { open() }}, [ ready, open ])

  return <></>
}