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
import { password as isPasswordValid } from "~/utils/frontend/validate";
import { nhost } from "~/utils/nhost";
import { parseAuthError } from "~/lib/parseAuthError";
import { trpc } from "~/lib/trpc";


export const ChangePassword = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const renderToast = useToast();
  const { mutateAsync } = trpc.users.changePassword.useMutation();
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
                if ( error ) {
                  setSubmitting(false);
                  const parsedError = await parseAuthError(error);
                  setFieldError(parsedError.field, parsedError.message);
                  return;
                }

                mutateAsync({ password }).then(() => {
                  setSubmitting(false);
                  renderToast({ status: 'success', title: "Password Updated" });
                  onClose();
                })
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