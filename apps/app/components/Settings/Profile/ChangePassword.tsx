import { 
  Button, 
  Modal, 
  ModalBody,
  ModalCloseButton, 
  ModalContent,
  ModalFooter, 
  ModalHeader, 
  ModalOverlay, 
  Stack,
  useDisclosure 
} from "@chakra-ui/react";
import { Formik } from "formik";

import { Form } from "~/components/Forms/Form";
import { PasswordField } from "~/components/Forms/PasswordField";
import { useToast } from "~/utils/frontend/useToast";
import { useAuth } from "~/utils/frontend/useAuth";
import { password as isPasswordValid } from "~/utils/frontend/validate";
import { nhost } from "~/utils/nhost";
import { trackPasswordChanged} from "~/utils/frontend/analytics";


export const ChangePassword = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { parseAuthError } = useAuth();
  const renderToast = useToast();

  return (
    <>
      <Button 
        size = "sm" 
        variant = "outline" 
        onClick = { onOpen }
        width = {{ base: 'full', md: 'xs' }}
      >Change Password</Button>

      <Modal isOpen = { isOpen } onClose = { onClose }>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Password</ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues = {{ password: "" }}
            onSubmit = {({ password }, { setSubmitting, setFieldError }) => {
              nhost.auth.changePassword({ newPassword: password })
              .then(async ({ error }) => {
                setSubmitting(false);
                if ( error ) {
                  const parsedError = await parseAuthError(error);
                  setFieldError(parsedError.field, parsedError.message);
                  return;
                }

                trackPasswordChanged()
                renderToast({ status: 'success', title: "Password Updated" });
                onClose();
              })
            }}
            validate = {({ password }) => {
              const errors = {} as { form: undefined | boolean };
              if ( !isPasswordValid(password) ) { errors.form = true };
              return errors;
            }}
          >
            {({ handleSubmit, handleChange, isSubmitting, errors, values, isValid }) => (
              <Form onSubmit = { handleSubmit }>
                <ModalBody>
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
                </ModalBody>

                <ModalFooter>
                  <Stack direction = "row" justifyContent = "space-between" width = "full">
                    <Button 
                      width = "full"
                      type = "submit" 
                      variant = "primary"
                      isDisabled = { !isValid }
                      isLoading = { isSubmitting }
                    >Change Password</Button>
                  </Stack>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    </>
  )
}