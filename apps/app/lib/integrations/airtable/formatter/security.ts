import { Field } from "@prisma/client";
import { SecurityFormatter } from "../../base/types";

export const security = {
  new({ security }) {
    return {
      [Field.Id]: security.security_id,
      [Field.Name]: security.name,
      [Field.Symbol]: security.ticker_symbol,
      [Field.ClosePrice]: security.close_price ?? (security.type === 'cash' ? 1 : undefined ),
      [Field.ClosePriceAsOf]: security.close_price_as_of,
      [Field.Type]: security.type,
    }
  },
  updated({ security }) {
    return {
      [Field.ClosePrice]: security.close_price || (security.type === 'cash' ? 1 : undefined ),
      [Field.ClosePriceAsOf]: security.close_price_as_of
    }
  },
} as SecurityFormatter