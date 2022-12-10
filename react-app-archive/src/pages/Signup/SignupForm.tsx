import { Box, Button, FormControl, Link, FormLabel, Stack, Text, FormErrorMessage } from "@chakra-ui/react";
import { Form, Formik, FormikHelpers } from "formik";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import * as analytics from "src/lib/analytics";
import { nhost } from "src/lib/nhost";
import { Input } from "src/components/Input";
import { PasswordField } from "src/components/PasswordField";

import { useAuth } from "src/lib/useAuth";
import { password as isPasswordValid } from "src/lib/validate";

import { AppRoutes } from "src/routes";

export const SignupForm = () => {
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  const initialValues = { name: "", email: "", password: "" };

  const validate = (values: typeof initialValues) => {
    const errors = {} as { form: undefined | boolean };
    if ( !values.email || !values.name || !isPasswordValid(values.password) ) { errors.form = true };
    return errors
  };

  nhost.auth.onAuthStateChanged((event, session) => {
    if ( event === 'SIGNED_IN' ) {
      if ( !session ) { throw new Error("Signed-in user does not have a session") };
      if ( !session.user ) { throw new Error("Session does not have a user") };
      const { id } = session.user;

      analytics.alias({ userId: id });
      analytics.identify({ userId: id });
    }

    if ( event === 'SIGNED_OUT' ) { analytics.reset();}
  })

  const onSubmit = (values: typeof initialValues, { setFieldError, setSubmitting }: FormikHelpers<typeof initialValues>) => {
    signUp({ email: values.email, password: values.password, name: values.name })
    .then(({ error }) => {
      setSubmitting(false);
      if ( error ) { setFieldError(error.field, error.message); return; }

      navigate(AppRoutes.ACCOUNTS);
    })
    .catch(err => console.log(err))
  };

  return (
    <Formik
      initialValues = { initialValues }
      validate = { validate }
      onSubmit = { onSubmit }
    >
      {({ handleSubmit, handleChange, isSubmitting, errors, values, isValid }) => (
        <Form onSubmit = { handleSubmit }>
          <Stack spacing = "4">
            <FormControl id = "name-input">
              <FormLabel visibility = { values.name.length > 0 ? 'visible' : 'hidden' }>Name</FormLabel>
              <Input
                autoComplete = "given-name"
                autoFocus = { true }
                id = "name-input"
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
                isDisabled = { !isValid || !!user }
                isLoading = { isSubmitting }
                id = 'submit-signup-button'
              >Sign Up</Button> 
              <Text mt = { 1 } fontSize = "sm" textAlign = "center">
                { user && !isSubmitting
                ? <>You already have an account. <Link as = { RouterLink } to = { AppRoutes.DESTINATIONS }>Go to Dashboard</Link></>
                : <>By signing up, you agree to our <Link isExternal href = "https://www.iubenda.com/terms-and-conditions/49633829">Terms and Conditions</Link> and <Link isExternal href = "https://www.iubenda.com/privacy-policy/49633829">Privacy Policy</Link>.</>}
              </Text>
            </Box>
          </Stack>
        </Form>
      )}
    </Formik>
  )
}