import { Flex, FlexProps, Input, Button, useClipboard, Tooltip } from "@chakra-ui/react";
import { CopyIcon, CheckIcon } from "@radix-ui/react-icons";

interface CopiableTextProps extends FlexProps {
  text: string;
}

export const CopiableText = ({ text, ...flexProps }: CopiableTextProps) => {
  const { hasCopied, onCopy } = useClipboard(text);
  
  return (
    <Flex { ...flexProps }>
      <Input value = { text } isReadOnly />
      <Tooltip label = { hasCopied ? "Copied" : "Copy"}>
        <Button 
          variant = "icon" 
          onClick = { onCopy } 
          ml = { 2 }
        >{ hasCopied ? <CheckIcon /> : <CopyIcon /> }
        </Button>
      </Tooltip>
    </Flex>
  )
}