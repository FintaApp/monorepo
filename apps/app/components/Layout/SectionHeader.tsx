import { Heading, Stack, StackProps, Text, useColorModeValue as mode } from "@chakra-ui/react";

interface SectionHeaderProps extends StackProps {
  title: string;
  description?: string;
  heading?: 'h1' | 'h2' | 'h3'
}

export const SectionHeader = ({ title, description, heading = "h2", ...stackProps }: SectionHeaderProps) => (
  <Stack spacing = "1" { ...stackProps }>
    <Heading as = { heading } variant = { heading }>{ title }</Heading>
    <Text color = { mode('gray.light.11', 'gray.dark.11') }>{ description }</Text>
  </Stack>
)