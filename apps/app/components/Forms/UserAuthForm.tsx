import { useState } from "react";
import { Box, FormLabel, FormControl, Link, VStack, Button, FormErrorMessage, Text } from "@chakra-ui/react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import { IAuthSchema, authSchema } from "~/lib/validation/forms";
import { Input } from "./Input";
import { PasswordField } from "./PasswordField";
import { TERMS_AND_CONDITIONS_URL, PRIVACY_POLICY_URL } from "~/lib/constants";
import { useToast } from "~/lib/context/useToast";

type FormData = z.infer<typeof authSchema>

type Mode = 'signup' | 'login';
type Provider = 'credentials' | 'email';

interface UserAuthFormProps {
  mode: Mode
}

const getButtonText = ({ mode, provider }: { mode: Mode, provider: Provider }) => {
  if ( provider === 'email' ) { return "Get Magic Link" }
  if ( mode === 'login' && provider === 'credentials' ) { return "Log In" }
  if ( mode === 'signup' && provider === 'credentials' ) { return "Sign Up" }
}

export const UserAuthForm = ({ mode }: UserAuthFormProps) => {
  const [ provider, setProvider ] = useState<Provider>('email')
  const renderToast = useToast();
  const { register, handleSubmit, formState, setError, getValues } = useForm<IAuthSchema>({ resolver: zodResolver(authSchema) });
  const [ isLoading, setIsLoading ] = useState(false);
  const [ isEmailSent, setIsEmailSent ] = useState(false);
  const router = useRouter();

  const searchParams = useSearchParams();
  const onLoginUrl = searchParams.get('next') || '/destinations';

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    const result = await signIn(provider, {
      email: data.email.toLowerCase(),
      password: provider === 'credentials' && data.password,
      name: provider === 'credentials' && mode === 'signup' && data.name,
      mode,
      redirect: false,
      callbackUrl: onLoginUrl
    }).finally(() => setIsLoading(false));

    if ( !result?.ok) {
      const error = result?.error;
      if ( error ) { setError('password', { message: error }) }
    }

    if ( provider === 'email' ) {
      setIsEmailSent(true);
      return renderToast({
        status: 'success',
        title: "Check your email",
        message: "We sent you a login link. Be sure to check your spam too."
      })
    }

    if ( provider === 'credentials' ) { router.push(onLoginUrl)}
  }

  const isNameInputVisible = mode === 'signup' && provider === 'credentials';
  const isPasswordInputVisible = provider === 'credentials';

  return (
    <VStack spacing = "6" width = 'full'>
      <form style = {{ width: '100%' }} onSubmit = { handleSubmit(onSubmit) }>
        <VStack spacing = "4">
          <FormControl id = "name" display = { isNameInputVisible ? 'block' : 'none' }>
            <FormLabel>Name</FormLabel>
            <Input
              autoComplete = 'given-name'
              autoFocus = { isNameInputVisible }
              id = 'name'
              placeholder = "Name"
              { ...register("name", { required: isNameInputVisible })}
            />
          </FormControl>

          <FormControl id = "email" isInvalid = { !!formState.errors.email }>
            <FormLabel>Email</FormLabel>
            <Input 
              autoComplete = "email"
              autoFocus = { mode === 'login' }
              id = "email"
              type = "email"
              placeholder = "Email"
              { ...register("email") }
            />
            <FormErrorMessage>{ formState.errors.email?.message }</FormErrorMessage>
          </FormControl>

          <Box display = { isPasswordInputVisible ? 'block' : 'none' } width = "full">
            <PasswordField
              autoComplete = { mode === 'login' ? 'current-password' : 'new-password' }
              showHelpText = { mode === 'signup' }
              label = "Password"
              id = "password"
              { ...register("password", { required: isPasswordInputVisible, minLength: mode === 'login' ? undefined : 8 })}
              display = { isPasswordInputVisible ? 'block' : 'none' }
              value = { getValues("password") }
              isInvalid = { !!formState.errors.password }
              errorMessage = { formState.errors.password?.message }
            />
          </Box>

          <VStack width = "full">
            <Button
              type = "submit"
              variant = "primary"
              size = "md"
              fontSize = "md"
              width = "full"
              isDisabled = { !formState.isValid }
              isLoading = { isLoading }
            >{ isEmailSent ? "Link sent" : getButtonText({ mode, provider }) }</Button>
            { mode === 'login' && (
              <Button variant = "link"
                onClick = { () => setProvider(prevProvider => prevProvider === 'credentials' ? 'email' : 'credentials' ) }
              >Log in with { provider === 'email' ? 'password' : 'magic link'}</Button>
            )}
            { mode === 'signup' && <Text mt = { 1 } fontSize = "sm" textAlign = "center">
              By signing up, you agree to our <Link isExternal href = { TERMS_AND_CONDITIONS_URL }>Terms and Conditions</Link> and <Link isExternal href = { PRIVACY_POLICY_URL }>Privacy Policy</Link>
            </Text> }
          </VStack>
        </VStack>
      </form>
    </VStack>
  )
}