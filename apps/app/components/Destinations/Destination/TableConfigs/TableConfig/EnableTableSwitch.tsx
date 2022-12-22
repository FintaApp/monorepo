import { FormControl, FormLabel, Switch } from "@chakra-ui/react";
import { Table } from "@prisma/client";
import { useDestination } from "~/components/Destinations/context"

const humanizeTableType = (tableType: Table) => tableType === Table.InvestmentTransactions 
  ? "Investment Transactions" : tableType

export const EnableTableSwitch = ({ tableType }: { tableType: Table }) => {
  const { tableConfigs, onChangeTableConfig } = useDestination();
  const tableConfig = tableConfigs?.find(config => config.table === tableType) || { table: tableType, isEnabled: false, tableId: '', fieldConfigs: [] };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeTableConfig({ ...tableConfig, isEnabled: e.target.checked})
  }

  return (
    <FormControl display = "flex" alignItems = "center" justifyContent = "space-between">
      <FormLabel textTransform = 'capitalize' htmlFor = { `enable-${tableType}`} mb = '0'>Enable {humanizeTableType(tableType)}</FormLabel>
      <Switch id = {`enable-${tableType}`} isChecked = { tableConfig.isEnabled } onChange = { onChange } />
    </FormControl>
  )
}