import {
  Stack
} from "@chakra-ui/react";
import { AiFillBank, AiOutlineLineChart } from 'react-icons/ai';

import { LargeIconButton } from "~/components/LargeIconButton";
import { PlaidProduct } from "~/types";


interface SelectBankTypeProps {
  onClick: (product: PlaidProduct ) => void;
  loadingProduct: PlaidProduct | undefined
}

export const SelectBankType = ({ onClick, loadingProduct }: SelectBankTypeProps) => (
  <Stack direction = {{ base: 'column', md: 'row' }}>
    <LargeIconButton
      label = "Bank Account"
      Icon = { AiFillBank }
      description =  "Import bank account balances and transactions"
      onClick = { () => onClick('transactions' as PlaidProduct) }
      isLoading = { loadingProduct === "transactions" }
    />
    <LargeIconButton
      label = "Investment Account"
      Icon = { AiOutlineLineChart }
      description =  "Import investment and crypto holdings and transactions"
      onClick = { () => onClick('investments' as PlaidProduct) }
      isLoading = { loadingProduct === "investments" }
    />
  </Stack>
)