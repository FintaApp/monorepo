import { useCallback, useEffect } from "react";
import {
  PlaidLinkOnEvent,
  PlaidLinkOnExit,
  PlaidLinkOnSuccess,
  PlaidLinkOptions,
  usePlaidLink
} from "react-plaid-link";

import { useUpsertPlaidItemMutation, useDeletePlaidAccountsMutation, useUpdateUserMutation, Plaid_Institutions_Constraint, Plaid_Institutions_Update_Column, PlaidAccounts_Constraint } from "~/graphql/frontend";
import { PlaidItemModel } from "~/types/frontend/models";
import { useLogger } from "~/utils/frontend/useLogger";
import * as analytics from "~/utils/frontend/analytics";
import { exchangePlaidPublicToken } from "~/utils/frontend/functions";
import { useUser } from "~/lib/context/useUser";


interface PlaidLinkProps {
  onConnectCallback?: () => void;
  onSuccessCallback: (plaidItem: PlaidItemModel) => void;
  onExitCallback: () => void;
  linkToken: string;
  receivedRedirectUri?: string
}

export const PlaidLink = ({ onConnectCallback, onSuccessCallback, onExitCallback, linkToken, receivedRedirectUri }: PlaidLinkProps) => {
  const logger = useLogger();
  const { user } = useUser();
  if ( !user ) { return <></> }
  const userId = user.id;

  const [ upsertPlaidItemMutation ] = useUpsertPlaidItemMutation();
  const [ deletePlaidAccountsMutation ] = useDeletePlaidAccountsMutation();
  const [ updateUserMutation ] = useUpdateUserMutation();

  const onSuccess = useCallback<PlaidLinkOnSuccess>(async (publicToken, metadata) => {
    const { institution, accounts } = metadata;
    logger.info("Plaid link success", { metadata, publicToken });

    const { access_token: accessToken, item_id: itemId } = await exchangePlaidPublicToken({ publicToken })
    .then(response => {
      logger.info("Plaid public token exchanged", { item_id: response.item_id, request_id: response.request_id });
      return response;
    })
    .catch(error => {
      logger.error(error, {}, true);
      return { access_token: null, item_id: null}
    })

    updateUserMutation({ variables: { id: userId, _delete_key: { metadata: "activeLinkToken" }}})

    if ( !accessToken || !itemId ) { return; };

    const deleteNonSharedAccountsPromise = deletePlaidAccountsMutation({
      variables: { where: { _and: [
        { plaid_item_id: { _eq: itemId }},
        { id: { _nin: accounts.map(account => account.id )}}
      ]}}
    }).then(() => logger.info("Non shared accounts deleted"));

    const upsertPlaidItemPromise = upsertPlaidItemMutation({
      variables: { plaidItem: {
        id: itemId,
        accessToken,
        error: null,
        consentExpiresAt: null,
        institution: {
          data: { name: institution?.name, id: institution?.institution_id },
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
      }}
    }).then(response => { logger.info("Plaid Item upserted"); return response });

    Promise.all([ deleteNonSharedAccountsPromise, upsertPlaidItemPromise ])
    .then(([ _, upsertPlaidItemResponse ]) => onSuccessCallback(upsertPlaidItemResponse.data?.plaidItem!))
  }, [ onSuccessCallback, deletePlaidAccountsMutation, upsertPlaidItemMutation ])

  const onEvent = useCallback<PlaidLinkOnEvent>(async (eventName, metadata) => {
    logger.info("Plaid Link event", { eventName, metadata });
    if (["HANDOFF", "EXIT"].includes(eventName)) { onExitCallback() }
    if ( eventName === "OPEN" ) { analytics.track({ event: analytics.EventNames.PLAID_PORTAL_OPENED }); }
    if ( eventName === "TRANSITION_VIEW" && metadata.view_name === 'CONNECTED' ) { onConnectCallback && onConnectCallback() }
  }, [ onExitCallback, onConnectCallback ]);

  const onExit = useCallback<PlaidLinkOnExit>(async (error, metadata) => {
    if ( error ) { logger.error(new Error("Plaid Link error"), { error, metadata })};
    await Promise.all([
      updateUserMutation({ variables: { id: userId, _delete_key: { metadata: "activeLinkToken" }}}),
      analytics.track({ event: analytics.EventNames.PLAID_PORTAL_CLOSED, properties: { has_error: !!error }})
    ])
    onExitCallback();
  }, [ onExitCallback, userId ])

  const plaidConfig = {
    token: linkToken,
    onExit,
    onEvent,
    onSuccess,
    receivedRedirectUri
  } as PlaidLinkOptions

  const { open, ready } = usePlaidLink(plaidConfig);
  useEffect(() => { ready && open() }, [ ready, open ]);
  return <></>
}