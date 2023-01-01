import { createContext, useContext } from 'react';

import { RouterOutput } from '~/lib/trpc';

export interface PlaidItemContextType {
  plaidItem: RouterOutput['plaid']['getPlaidItem'],
  refetch: () => Promise<any>,
  onRemove: () => Promise<any>
}

export const PlaidItemContext = createContext<PlaidItemContextType>({} as PlaidItemContextType);

export const usePlaidItem = () => useContext(PlaidItemContext);