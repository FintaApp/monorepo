import { Box, BoxProps, HStack, Text, Tooltip, useColorModeValue as mode } from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";

export interface FieldGroupProps extends BoxProps {
  title: string;
  description?: string;
  showDescriptionAsTooltip?: boolean;
  showTitle?: boolean
}

export const FieldGroup = ({ showTitle = true, title, showDescriptionAsTooltip, description, ...boxProps }: FieldGroupProps) => (
  <Box width = "full">
    { showTitle && (
    <HStack justifyContent = { showDescriptionAsTooltip ? "flex-start" : "space-between"}>
      <Text opacity = "0.7" color = { mode('primary.light.12', 'primary.dark.12') } fontWeight = "semibold">{ title }</Text>
      { showDescriptionAsTooltip && <Tooltip label = { description }><InfoOutlineIcon /></Tooltip> }
    </HStack>
    )}
    { description && !showDescriptionAsTooltip && (
      <Text color = { mode('gray.light.11', 'gray.dark.11') } fontSize = "sm">{ description }</Text>
    )}
    <Box { ...boxProps } />
  </Box>
)