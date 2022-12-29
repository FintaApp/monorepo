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
import { trpc } from "~/lib/trpc";

export const LoginForm = () => {
  const { mutateAsync: logIn } = trpc.users.onLogIn.useMutation();
  const router = useRouter();

  return (
    <Formik
      initialValues = {{
        email: "",
        password: ""
      }}
      onSubmit = {({ email, password }, { setSubmitting, setFieldError }) => {
        logIn({ email, password })
        .then(async ({ error }) => {
          if ( error ) {
            if ( error.code === "already_singed_in" ) { router.push('/') }
            setSubmitting(false);
            setFieldError(error.field, error.message);
            return;
          }

          nhost.auth.signIn({ email, password })
          .then(() => {
            const onLoginRedirect = router.query.next as string || "/";
            router.push(onLoginRedirect);
          });
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