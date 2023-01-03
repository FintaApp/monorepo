import { FormControl, FormLabel, Switch } from "@chakra-ui/react";
import { Integration, Table } from "@prisma/client";
import { useDestination } from "~/components/Destinations/context"

const humanizeTableType = (tableType: Table) => tableType === Table.InvestmentTransactions 
  ? "Investment Transactions" : tableType

export const EnableTableSwitch = ({ tableType }: { tableType: Table }) => {
  const { tableConfigs, onChangeTableConfig, toggleTableConfigCoda, integration, isSetupMode } = useDestination();
  const tableConfig = tableConfigs?.find(config => config.table === tableType) || { table: tableType, isEnabled: false, tableId: '', fieldConfigs: [] };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isEnabled = e.target.checked;
    onChangeTableConfig({ ...tableConfig, isEnabled })
    if ( integration === Integration.Coda && !isSetupMode ) {
      toggleTableConfigCoda({ isEnabled, table: tableType })
    }
  }

  return (
    <FormControl display = "flex" alignItems = "center" justifyContent = "space-between">
      <FormLabel textTransform = 'capitalize' htmlFor = { `enable-${tableType}`} mb = '0'>Enable {humanizeTableType(tableType)}</FormLabel>
      <Switch id = {`enable-${tableType}`} isChecked = { tableConfig.isEnabled } onChange = { onChange } />
    </FormControl>
  )
}