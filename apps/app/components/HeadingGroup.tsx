import { Heading, Stack, StackProps, Text, useColorModeValue as mode } from "@chakra-ui/react";

export interface HeadingGroupProps extends StackProps {
  title: string;
  description?: string
}

export const HeadingGroup = ({ title, description, ...stackProps }: HeadingGroupProps) => (
  <Stack spacing = "1" { ...stackProps }>
    <Heading as = "h2" variant = "h2">{ title }</Heading>
    <Text color = { mode('gray.light.11', 'gray.dark.11') }>{ description }</Text>
  </Stack>
)