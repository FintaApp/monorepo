import { Form, Formik, FormikHelpers } from "formik";
import {
  Box,
  Button,
  ModalBody,
  ModalFooter,
  Stack
} from "@chakra-ui/react"

import { PasswordField } from "./PasswordField";
import { useToast } from "~/utils/frontend/useToast";
import { useAuth } from "~/utils/frontend/useAuth";
import { password as isPasswordValid } from "~/utils/frontend/validate";
import { nhost } from "~/utils/nhost";

interface ChangePasswordFormProps {
  onSuccess: () => void;
  asModal?: boolean;
}

export const ChangePasswordForm = ({ onSuccess, asModal = false }: ChangePasswordFormProps) => {
  const { parseAuthError } = useAuth();
  const renderToast = useToast();

  const initialValues = { password: "" };

  const onSubmit = (values: typeof initialValues, { setFieldError, setSubmitting }: FormikHelpers<typeof initialValues>) => {
    nhost.auth.changePassword({ newPassword: values.password })
    .then(async ({ error }) => {
      setSubmitting(false);

      if ( error ) {
        const parsedError = await parseAuthError(error);
        setFieldError(parsedError.field, parsedError.message)
        return;
      }

      renderToast({ status: 'success', title: "Password Updated" });
      onSuccess();
    })
  }

  const validate = (values: typeof initialValues) => {
    const errors = {} as { form: undefined | boolean };
    if ( !isPasswordValid(values.password) ) { errors.form = true };
    return errors
  };

  const FormContainer = asModal ? ModalBody : Box;
  const ButtonContainer = asModal ? ModalFooter : Box;

  return (
    <Formik
      initialValues = { initialValues }
      validate = { validate }
      onSubmit = { onSubmit }
    >
      {({ handleSubmit, handleChange, isSubmitting, errors, values, isValid }) => (
        <Form onSubmit = { handleSubmit }>
          <FormContainer>
            <PasswordField 
              autoComplete = "new-password"
              showHelpText = { true }
              label = "Password"
              id = "new-password-input"
              name = "password"
              onChange = { handleChange }
              value = { values.password }
              errorMessage = { errors.password }
              isInvalid = { !!errors.password }
            />
          </FormContainer>

            <ButtonContainer>
              <Stack direction = "row" justifyContent = "space-between" width = "full">
                <Button 
                  width = "full"
                  type = "submit" 
                  variant = "primary"
                  isDisabled = { !isValid }
                  isLoading = { isSubmitting }
                >Change Password</Button>
              </Stack>
            </ButtonContainer>
        </Form>
      )}
    </Formik>
  )
}