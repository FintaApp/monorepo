import {
  AccordionButton,
  AccordionItem as ChakraAccordionItem,
  AccordionItemProps as ChakraAccordionItemProps,
  AccordionPanel,
  HStack,
  Icon,
  Stack,
  Text,
  TextProps,
  useColorModeValue as mode
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronRightIcon } from "@radix-ui/react-icons";

interface AccordionItemProps extends Omit<ChakraAccordionItemProps, 'children'> {
  buttonLabel: string;
  buttonIcon?: any;
  buttonChildren: any;
  children: any;
  buttonLabelProps?: TextProps
}

export const AccordionItem = ({ buttonIcon, buttonLabel, buttonChildren, children, buttonLabelProps = {},  ...props }: AccordionItemProps) => (
  <ChakraAccordionItem bg = { mode('white', 'gray.dark.4') } width = "full" { ...props }>
    {({ isExpanded }) => (
      <>
        <h2>
          <AccordionButton px = "0" fontSize = "sm">
            <Stack width = "full" direction = {{ base: 'column', sm: 'row' }} justifyContent = "space-between">
              <HStack width = "full">
              { isExpanded ? <Icon as = { ChevronDownIcon } /> : <Icon as = { ChevronRightIcon } /> }
                <HStack spacing = { 2 }>
                  { buttonIcon }
                  <Text { ...buttonLabelProps } width = "full" fontWeight = "semibold" flex='1' textAlign='left'>{ buttonLabel }</Text>
                </HStack>
              </HStack>

              { buttonChildren }
            </Stack>
          </AccordionButton>

          <AccordionPanel overflow = "visible">{ children }</AccordionPanel>
        </h2>
      </>
    )}
  </ChakraAccordionItem>
)