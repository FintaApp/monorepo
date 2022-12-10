import { Input as ChakraInput, InputProps as ChakraInputProps, forwardRef } from "@chakra-ui/react"
import { useState } from "react"

interface InputProps extends Omit<ChakraInputProps, 'variant'> {
  mode?: 'edit' | 'read';
}

export const Input = forwardRef(({ mode = 'edit', onFocus, onBlur, ...inputProps }: InputProps, ref) => {
  const [ isFocused, setIsFocused ] = useState(false)
  return (
    <ChakraInput 
      ref = { ref }
      variant = { mode === 'edit' || isFocused ? 'outline' : 'flushed' }
      onFocus = { event => { setIsFocused(true); onFocus && onFocus(event) } }
      onBlur = { event => { setIsFocused(false); onBlur && onBlur(event) } }
      { ...inputProps }
    />
  )
})