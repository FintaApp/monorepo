import {
  Stack
} from "@chakra-ui/react";
import { AiFillBank, AiOutlineLineChart } from 'react-icons/ai';
import { Products } from "plaid";

import { LargeIconButton } from "~/components/LargeIconButton";

interface SelectBankTypeProps {
  onClick: (product: Products ) => void;
  loadingProduct?: Products
}

export const SelectBankType = ({ onClick, loadingProduct }: SelectBankTypeProps) => (
  <Stack direction = {{ base: 'column', md: 'row' }}>
    <LargeIconButton
      label = "Bank Account"
      Icon = { AiFillBank }
      description =  "Import bank account balances and transactions"
      onClick = { () => onClick('transactions' as Products) }
      isLoading = { loadingProduct === "transactions" }
    />
    <LargeIconButton
      label = "Investment Account"
      Icon = { AiOutlineLineChart }
      description =  "Import investment and crypto holdings and transactions"
      onClick = { () => onClick('investments' as Products) }
      isLoading = { loadingProduct === "investments" }
    />
  </Stack>
)