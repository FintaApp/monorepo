import { Button, FormControl, FormErrorMessage, HStack } from "@chakra-ui/react";
 import { PlusIcon } from "@radix-ui/react-icons";

import { SelectProps, Select } from "~/components/Forms/Select";

interface OauthConnectionSelectProps extends SelectProps {
  onClickAddConnection: () => void;
  isInvalid?: boolean;
  errorMessage?: string;
}

export const OauthConnectionSelect = ({ isInvalid, errorMessage, onClickAddConnection, ...selectProps }: OauthConnectionSelectProps) => (
  <HStack>
    <FormControl isInvalid = { isInvalid }>
      <Select placeholder = "Select Connection" { ...selectProps } />
      <FormErrorMessage>{ errorMessage }</FormErrorMessage>
    </FormControl>
    <Button onClick = { onClickAddConnection }  variant = "icon" isLoading = { false }><PlusIcon /></Button>
  </HStack>
);