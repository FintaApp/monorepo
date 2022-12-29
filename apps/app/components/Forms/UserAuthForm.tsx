import { useState } from "react";
import { Box, FormLabel, FormControl, Link, VStack, Button, FormErrorMessage, Text } from "@chakra-ui/react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";

import { IAuthSchema, authSchema } from "~/lib/validation/forms";
import { Input } from "./Input";
import { PasswordField } from "./PasswordField";
import { TERMS_AND_CONDITIONS_URL, PRIVACY_POLICY_URL } from "~/lib/constants";
import { trpc } from "~/lib/trpc";
import { nhost } from "~/utils/nhost";

type FormData = z.infer<typeof authSchema>

type Mode = 'signUp' | 'logIn';
type Provider = 'credentials';

interface UserAuthFormProps {
  mode: Mode
}

const getButtonText = ({ mode, provider }: { mode: Mode, provider: Provider }) => {
  if ( mode === 'logIn' && provider === 'credentials' ) { return "Log In" }
  if ( mode === 'signUp' && provider === 'credentials' ) { return "Sign Up" }
}

export const UserAuthForm = ({ mode }: UserAuthFormProps) => {
  const [ isLoading, setIsLoading ] = useState(false);
  const { mutateAsync: signUp } = trpc.users.onSignUp.useMutation();
  const { mutateAsync: logIn } = trpc.users.onLogIn.useMutation();
  const { register, handleSubmit, formState, setError, getValues } = useForm<IAuthSchema>({ resolver: zodResolver(authSchema) });
  const router = useRouter();
  const provider = "credentials";

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    if ( mode === 'signUp' ) { await onSignUpCredentials({ email: data.email!, password: data.password!, name: data.name! })};
    if ( mode === 'logIn' ) { await onLogInCredentials({ email: data.email!, password: data.password! })};
  }

  const onLogInCredentials = async ({ email, password }: { email: string; password: string }) => {
    logIn({ email, password })
      .then(({ error }) => {
        if ( error ) {
          setIsLoading(false);
          if ( error.code === "already_singed_in" ) { router.push('/');};
          setError(error.field, { message: error.message });
          return;
        }

        nhost.auth.signIn({ email, password })
          .then(() => {
            const onLoginRedirect = router.query.next as string || "/";
            router.push(onLoginRedirect);
          });
      })
  }

  const onSignUpCredentials = async ({ email, password, name }: { email: string; password: string; name: string }) => {
    signUp({ name, email, password })
      .then(({ error }) => {
        setIsLoading(false);
        if ( error ) {
          if ( error.code === "already_singed_in" ) { router.push('/');};
          setError(error.field, { message: error.message });
          return;
        }

        nhost.auth.signIn({ email, password }).then(() => router.push('/'))
      })
  }

  const isNameInputVisible = mode === 'signUp' && provider === 'credentials';
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
              autoFocus = { mode === 'logIn' }
              id = "email"
              type = "email"
              placeholder = "Email"
              { ...register("email") }
            />
            <FormErrorMessage>{ formState.errors.email?.message }</FormErrorMessage>
          </FormControl>

          <PasswordField
            autoComplete = { mode === 'logIn' ? 'current-password' : 'new-password' }
            showHelpText = { mode === 'signUp' }
            label = "Password"
            id = "password"
            name = "password"
            { ...register("password", { required: isPasswordInputVisible, minLength: mode === 'logIn' ? undefined : 8 })}
            display = { isPasswordInputVisible ? 'block' : 'none' }
            value = { getValues("password") }
            isInvalid = { !!formState.errors.password }
            errorMessage = { formState.errors.password?.message }
          />

          <Box width = "full">
            <Button
              type = "submit"
              variant = "primary"
              size = "md"
              fontSize = "md"
              width = "full"
              isDisabled = { !formState.isValid }
              isLoading = { isLoading }
            >{ getButtonText({ mode, provider }) }</Button>
            { mode === 'signUp' && <Text mt = { 1 } fontSize = "sm" textAlign = "center">
              By signing up, you agree to our <Link isExternal href = { TERMS_AND_CONDITIONS_URL }>Terms and Conditions</Link> and <Link isExternal href = { PRIVACY_POLICY_URL }>Privacy Policy</Link>
            </Text> }
          </Box>
        </VStack>
      </form>
    </VStack>
  )
}