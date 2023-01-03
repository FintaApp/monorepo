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
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { PasswordField } from "~/components/Forms/PasswordField";
import { useToast } from "~/lib/context/useToast";
import { trpc } from "~/lib/trpc";
import { changePasswordSchema, IChangePasswordSchema } from "~/lib/validation/forms";

type FormData = z.infer<typeof changePasswordSchema>

export const ChangePassword = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const renderToast = useToast();
  const { register, handleSubmit, formState, setError, getValues } = useForm<IChangePasswordSchema>({ resolver: zodResolver(changePasswordSchema) });
  const { mutateAsync, isLoading } = trpc.users.changePassword.useMutation();

  const onSubmit = async (data: FormData) => {
    mutateAsync({ password: data.password }).then(() => {
      renderToast({ status: 'success', title: "Password Updated" });
      onClose();
    })
  }
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
          <form style = {{ width: '100%' }} onSubmit = { handleSubmit(onSubmit) }>
            <ModalBody>
              <PasswordField 
                autoComplete = "new-password"
                showHelpText = { true }
                label = "Password"
                id = "new-password-input"
                { ...register("password")}
                value = { getValues("password") }
                errorMessage = { formState.errors.password?.message }
                isInvalid = { !!formState.errors.password }
              />
            </ModalBody>

            <ModalFooter>
              <Stack direction = "row" justifyContent = "space-between" width = "full">
                <Button 
                  width = "full"
                  type = "submit" 
                  variant = "primary"
                  isDisabled = { !formState.isValid }
                  isLoading = { isLoading }
                >Change Password</Button>
              </Stack>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}