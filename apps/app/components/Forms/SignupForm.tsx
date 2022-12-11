import { Formik } from "formik";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Link,
  Text
} from "@chakra-ui/react";
import { useRouter } from "next/router";

import { Input } from "./Input";
import { Form } from "./Form";
import { PasswordField } from "./PasswordField";
import { TERMS_AND_CONDITIONS_URL, PRIVACY_POLICY_URL } from "~/utils/frontend/constants";
import { nhost } from "~/utils/nhost";
import { password as isPasswordValid } from "~/utils/frontend/validate";
import { useAuth } from "~/utils/frontend/useAuth";
import { alias } from "~/utils/frontend/analytics";

export const SignupForm = () => {
  const router = useRouter();
  const { parseAuthError } = useAuth();
  return (
    <Formik
      initialValues = {{
        name: "",
        email: "",
        password: ""
      }}
      onSubmit = {({ name, email, password }, { setSubmitting, setFieldError }) => {
        nhost.auth.signUp({ email, password, options: { displayName: name }})
        .then(async ({ error, session }) => {
          if ( error ) {
            const parsedError = await parseAuthError(error);
            if ( parsedError.code === "already_singed_in" ) { router.push('/') }
            setSubmitting(false);
            setFieldError(parsedError.field, parsedError.message);
            return;
          }
          
          alias({ userId: session.user.id })

          router.push('/');
        })
      }}
      validate = {({ name, email, password }) => {
        const errors = {} as { form: undefined | boolean };
        if ( !email || !name || !isPasswordValid(password) ) { errors.form = true };
        return errors
      }}
    >
      {({ handleSubmit, values, handleChange, errors, isValid, isSubmitting }) => (
        <Form onSubmit = { handleSubmit }>
          <FormControl id = "name-input">
            <FormLabel visibility = { values.name.length > 0 ? 'visible' : 'hidden'}>Name</FormLabel>
            <Input
              autoComplete = 'given-name'
              autoFocus = { true }
              id = 'name-input'
              name = "name"
              onChange = { handleChange }
              value = { values.name }
              placeholder = "Name"
            />
          </FormControl>

          <FormControl id = "email-input" isInvalid = { !!errors.email } >
            <FormLabel visibility = { values.email.length > 0 ? "visible" : 'hidden'}>Email</FormLabel>
            <Input 
              autoComplete = "email" 
              id = "email-input"
              name = "email"
              onChange = { handleChange }
              type = "email"
              value = { values.email }
              placeholder = "Email"
            />
            <FormErrorMessage id = "email-error">{ errors.email }</FormErrorMessage>
          </FormControl>

          <PasswordField 
            autoComplete = "new-password"
            showHelpText = { true }
            label = "Password"
            id = "new-password-input"
            name = "password"
            onChange = { handleChange }
            value = { values.password }
          />

          <Box>
            <Button 
              type = "submit" 
              variant = "primary" 
              size = "md" 
              fontSize = "md"
              width = "full"
              isDisabled = { !values.email || !isValid }
              isLoading = { isSubmitting }
              loadingText = "Setting up your account..."
              id = 'submit-signup-button'
            >Sign Up</Button> 
            <Text mt = { 1 } fontSize = "sm" textAlign = "center">
              By signing up, you agree to our <Link isExternal href = { TERMS_AND_CONDITIONS_URL }>Terms and Conditions</Link> and <Link isExternal href = { PRIVACY_POLICY_URL }>Privacy Policy</Link>
            </Text>
          </Box>
        </Form>
      )}
    </Formik>  
  )
}