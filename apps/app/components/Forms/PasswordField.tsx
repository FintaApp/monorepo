import { useRef } from "react";
import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  IconButton,
  InputProps,
  InputGroup,
  InputRightAddon,
  forwardRef,
  Tooltip,
  useColorModeValue as mode,
  useBoolean,
  useMergeRefs
} from "@chakra-ui/react";
import { EyeOpenIcon, EyeClosedIcon } from '@radix-ui/react-icons'

import { Input } from "./Input";

export interface PasswordFieldParams extends InputProps {
  displayForgotPassword?: boolean;
  errorMessage?: string;
  isInvalid?: boolean;
  label?: string;
  showHelpText?: boolean;
  value: string;
}

const PasswordVisibilityIcon = ({ isVisible }: { isVisible: boolean }) => (
  <Tooltip label = { isVisible ? "Hide Password" : "View Password"} >
    { isVisible ? <EyeClosedIcon /> : <EyeOpenIcon /> }
  </Tooltip>
)

export const PasswordField = forwardRef((params: PasswordFieldParams, ref) => {
  const { id, isInvalid, label, displayForgotPassword = false, errorMessage, showHelpText, ...inputProps } = params;
  const [ isVisible, setIsVisible ] = useBoolean(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const mergeRef = useMergeRefs(inputRef, ref);

  const onToggleReveal = () => {
    setIsVisible.toggle();
    const input = inputRef.current;

    if ( input ) {
      input.focus({
        preventScroll: true
      });
      const length = input?.value.length * 2;
      requestAnimationFrame(() => {
        input.setSelectionRange(length, length);
      });
    }
  };

  return (
    <FormControl id = { id } isInvalid = { isInvalid }>
      <Flex justify = "space-between">
        <FormLabel visibility = { inputProps.value?.length > 0 ? "visible" : 'hidden'}>{ label }</FormLabel>
        <Box 
          display = { displayForgotPassword ? "inline-flex" : "none" } 
          as = "a"
          color = { mode('primary.600', 'primary.200') }
          fontWeight = "semibold"
          fontSize = "sm"
        >Forgot Password?</Box>
      </Flex>
      <InputGroup variant = 'outline'>
        <Input
          ref = { mergeRef }
          name = { id }
          type = { isVisible ? "text" : "password" }
          placeholder = { label }
          id = { id }
          { ...inputProps }
        />

        <InputRightAddon>
          <IconButton
            bg="transparent !important"
            variant="ghost"
            aria-label={ isVisible ? 'Mask password' : 'Reveal password'}
            icon = { <PasswordVisibilityIcon isVisible = { isVisible } /> }
            onClick = { onToggleReveal }
            tabIndex = { -1 }
          />
        </InputRightAddon>
      </InputGroup>
      <FormHelperText display = { showHelpText ? "inline-flex" : "none" }>Password must be at least 8 characters.</FormHelperText>
      <FormErrorMessage>{ errorMessage }</FormErrorMessage>
    </FormControl>
  )
})