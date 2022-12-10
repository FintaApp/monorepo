import { Security, Holding } from "plaid";
import { OauthHolding } from "@finta/types";

export const holding = ({ holding, security }: { holding: Holding; security?: Security }): OauthHolding => ({
  account_id: holding.account_id,
  cost_basis: holding.cost_basis ?? undefined,
  currency: holding.iso_currency_code || undefined,
  quantity: holding.quantity,
  close_price: security?.close_price ?? undefined,
  symbol: security?.ticker_symbol || undefined,
  security_name: security?.name || undefined,
  security_type: security?.type || ""
})