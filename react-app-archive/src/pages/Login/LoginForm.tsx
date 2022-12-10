import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Link,
  Stack,
  Text
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

import { Input } from "src/components/Input";
import { PasswordField } from "src/components/PasswordField";

import { Form, Formik, FormikHelpers } from "formik";
import { useAuth } from 'src/lib/useAuth';

export const LoginForm = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const initialValues = {email: "", password: "" };

  const onSubmit = (values: typeof initialValues, { setFieldError, setSubmitting }: FormikHelpers<typeof initialValues>) => {
    login({ email: values.email, password: values.password })
    .then(({ error }) => {
      setSubmitting(false);
      if ( error ) { setFieldError(error.field, error.message); return; }

      const onLoginRedirect = (location.state as any)?.redirect || "/";
      navigate(onLoginRedirect);
    })
  }

  const validate = (values: typeof initialValues) => {
    const errors = {} as { form: undefined | boolean };
    if ( !values.email || !values.password ) { errors.form = true }

    return errors
  }

  return (
    <Formik
      initialValues = { initialValues }
      validate = { validate }
      onSubmit = { onSubmit }
    >
      {({ handleSubmit, handleChange, isSubmitting, errors, values, isValid }) => (
        <Form onSubmit = { handleSubmit }>
          <Stack spacing = "4">
            <FormControl id = "email" isInvalid = { !!errors.email }>
              <FormLabel htmlFor = "email" visibility = { values.email.length > 0 ? 'visible' : 'hidden' }>Email</FormLabel>
              <Input
                autoComplete = "email"
                autoFocus = { true }
                onChange = { handleChange }
                type = "email"
                id = "email"
                name = "email"
                value = { values.email }
                placeholder = "Email"
              />
              <FormErrorMessage>{ errors.email }</FormErrorMessage>
            </FormControl>

            <PasswordField
              autoComplete = "current-password"
              label = "Password"
              id = "password"
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
                isDisabled = { !isValid || !!user }
                isLoading = { isSubmitting }
              >Log In</Button>
              <Text mt = { 1 } fontSize = "sm" textAlign = "center">
                { user && !isSubmitting
                ? <>You are already logged in. <Link as = { RouterLink } to = "/destinations">Go to Dashboard</Link></>
                : <></> }
              </Text>
            </Box>
          </Stack>
        </Form>
      )}
    </Formik>
  )
}