import { FormLabel, HStack, Icon, Tooltip } from "@chakra-ui/react";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { ReactNode } from "react";

export const FormLabelWithTooltip = ({ children, tooltipText }: { children: any; tooltipText?: string | ReactNode; }) => (
  <HStack spacing = '1' alignItems = 'flex-start' justifyContent = 'flex-start'>
    <FormLabel whiteSpace = "nowrap" mx = '0'>{ children }</FormLabel>
    { tooltipText && <Tooltip label = { tooltipText }><Icon as = { InfoCircledIcon } /></Tooltip> }
  </HStack>
)