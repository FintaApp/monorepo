import { useCallback, useEffect } from "react";
import {
  PlaidLinkOnEvent,
  PlaidLinkOnExit,
  PlaidLinkOnSuccess,
  PlaidLinkOptions,
  usePlaidLink
} from "react-plaid-link";
import { Serialize } from '@trpc/server/src/shared/internal/serialize'

import { useLogger } from "~/utils/frontend/useLogger";
import * as analytics from "~/utils/frontend/analytics";
import { useUser } from "~/lib/context/useUser";
import { trpc } from "~/lib/trpc";
import { PlaidItem } from "@prisma/client";


interface PlaidLinkProps {
  onConnectCallback?: () => void;
  onSuccessCallback: ({ plaidItem, institutionName }: { plaidItem: Serialize<PlaidItem>; institutionName: string }) => void;
  onExitCallback: () => void;
  linkToken: string;
  receivedRedirectUri?: string
}

export const PlaidLink = ({ onConnectCallback, onSuccessCallback, onExitCallback, linkToken, receivedRedirectUri }: PlaidLinkProps) => {
  const logger = useLogger();
  const { user } = useUser();
  const userId = user!.id;

  const { mutateAsync: exchangePublicToken } = trpc.plaid.exchangePublicToken.useMutation();
  const { mutateAsync: removeLinkToken } = trpc.plaid.removePlaidLink.useMutation();

  const onSuccess = useCallback<PlaidLinkOnSuccess>(async (publicToken, metadata) => {
    const { institution, accounts } = metadata;
    exchangePublicToken({ publicToken, institution: institution!, accounts })
      .then(({ plaidItem, institutionName }) => onSuccessCallback({ plaidItem, institutionName }))
  }, [ onSuccessCallback ])

  const onEvent = useCallback<PlaidLinkOnEvent>(async (eventName, metadata) => {
    logger.info("Plaid Link event", { eventName, metadata });
    if (["HANDOFF", "EXIT"].includes(eventName)) { onExitCallback() }
    if ( eventName === "OPEN" ) { analytics.track({ event: analytics.EventNames.PLAID_PORTAL_OPENED }); }
    if ( eventName === "TRANSITION_VIEW" && metadata.view_name === 'CONNECTED' ) { onConnectCallback && onConnectCallback() }
  }, [ onExitCallback, onConnectCallback ]);

  const onExit = useCallback<PlaidLinkOnExit>(async (error, metadata) => {
    if ( error ) { logger.error(new Error("Plaid Link error"), { error, metadata })};
    await Promise.all([
      removeLinkToken(),
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