import { Formik } from "formik";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel
} from "@chakra-ui/react";
import { useRouter } from "next/router";

import { Input } from "./Input";
import { Form } from "./Form";
import { PasswordField } from "./PasswordField";
import { nhost } from "~/utils/nhost";
import { alias } from "~/utils/frontend/analytics";
import { parseAuthError } from "~/lib/parseAuthError";

export const LoginForm = () => {
  const router = useRouter();
  return (
    <Formik
      initialValues = {{
        email: "",
        password: ""
      }}
      onSubmit = {({ email, password }, { setSubmitting, setFieldError }) => {
        nhost.auth.signIn({ email, password })
        .then(async ({ error, session }) => {
          if ( error ) {
            const parsedError = parseAuthError(error);
            if ( parsedError.code === "already_singed_in" ) { router.push('/') }
            setSubmitting(false);
            setFieldError(parsedError.field, parsedError.message);
            return;
          }
          
          alias({ userId: session!.user.id })

          const onLoginRedirect = router.query.next as string || "/";
          router.push(onLoginRedirect);
        })
      }}
      validate = {({ email }) => {
        const errors = {} as { form: undefined | boolean };
        if ( !email ) { errors.form = true };
        return errors
      }}
    >
      {({ handleSubmit, values, handleChange, errors, isValid, isSubmitting }) => (
        <Form onSubmit = { handleSubmit }>
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
              autoFocus = { true }
            />
            <FormErrorMessage id = "email-error">{ errors.email }</FormErrorMessage>
          </FormControl>

          <PasswordField 
            autoComplete = "current-password"
            showHelpText = { false }
            label = "Password"
            id = "current-password-input"
            name = "password"
            onChange = { handleChange }
            value = { values.password }
            isInvalid = { !!errors.password }
            errorMessage = { errors.password }
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
              loadingText = "Logging in..."
              id = 'submit-login-button'
            >Log In</Button> 
          </Box>
        </Form>
      )}
    </Formik>  
  )
}