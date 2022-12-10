import {
  Box,
  Heading,
  Image,
  Text,
  useColorModeValue as mode,
  VStack
} from "@chakra-ui/react";

export interface EmptyStateProps {
  callToAction: string;
  icon: any;
  title: string;
  onClick?: () => void;
}

export const EmptyState = ({ callToAction, icon, title, onClick }: EmptyStateProps) => (
  <Box 
    as = { onClick ? "button" : "div"} 
    onClick = { onClick }
    width = "full"
    border = "3px dashed"
    borderColor = { mode("gray.light.6", "gray.dark.6") }
    rounded = "base"
    p = "8"
    textAlign = "center"
    _hover = {{
      borderColor: onClick ? mode("gray.light.7", "gray.dark.5") : mode("gray.light.6", "gray.dark.6")
    }}
  >
    <VStack>
      <Heading as = "h3" fontSize = "md" fontWeight = "medium">{ title }</Heading>
      <Image 
        src = { icon } 
        alt = "Empty state icon" 
        height = "50px"
      />
      <Text>{ callToAction }</Text>
    </VStack>
  </Box>
);