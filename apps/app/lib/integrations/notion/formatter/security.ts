import { Field } from "@prisma/client";
import { SecurityFormatter } from "../../base/types";

export const security = {
  new({ security }) {
    return {
      [Field.Id]: { rich_text: [{ text: { content: security.security_id }}]},
      [Field.Name]: { rich_text: [{ text: { content: security.name || "" }}]},
      [Field.Symbol]: { title: [{ text: { content: security.ticker_symbol || security.name || "" }}]},
      [Field.ClosePrice]: security.close_price ? { number: security.close_price ?? (security.type === 'cash' ? 1 : undefined )} : undefined,
      [Field.ClosePriceAsOf]: security.close_price_as_of ? { date: { start: security.close_price_as_of }} : undefined,
      [Field.Type]: { select: { name: security.type }},
    }
  },
  updated({ security }) {
    return {
      [Field.ClosePrice]: security.close_price ? { number: security.close_price || (security.type === 'cash' ? 1 : undefined )} : undefined,
      [Field.ClosePriceAsOf]: security.close_price_as_of ? { date: { start: security.close_price_as_of }} : undefined
    }
  },
} as SecurityFormatter