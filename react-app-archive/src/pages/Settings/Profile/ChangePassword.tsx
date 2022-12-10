import { FormEvent, useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
  useDisclosure
} from "@chakra-ui/react";

import { PasswordField } from "src/components/PasswordField";
import * as analytics from "src/lib/analytics";
import { useToast } from "src/lib/useToast";
import { nhost } from "src/lib/nhost"
import { parseAuthError } from "src/lib/parseAuthError";
import * as validate from "src/lib/validate";

export const ChangePassword = () => {
  const toast = useToast();
  const [ newPassword, setNewPassword ] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ isLoading, setIsLoading ] = useState(false);

  useEffect(() => {
    setNewPassword("");
    setIsLoading(false);
  }, [ isOpen ]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    nhost.auth.changePassword({ newPassword })
    .then(response => {
      const { error } = response;

      if ( error ) {
        const parsedError = parseAuthError(error);
        setIsLoading(false);
        analytics.track({ event: analytics.EventNames.ERROR_TRIGGERED, properties: {
          error: parsedError.code
        }});

        return null;
      }

      analytics.track({ event: analytics.EventNames.PASSWORD_CHANGED});
      toast({
        title: "Password Changed",
        status: "success"
      });
      onClose();
    })
  }

  const isValid = validate.password(newPassword);

  return (
    <>
      <Button size = "sm" variant = "outline" onClick = { onOpen }>Change Password</Button>

      <Modal isOpen = { isOpen } onClose = { onClose }>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Password</ModalHeader>
          <ModalCloseButton />
          <form onSubmit = { onSubmit }>
            <ModalBody>
              <Stack spacing = "4">
                <PasswordField 
                  label = "New Password"
                  autoComplete = "new-password"
                  id = "new-password"
                  showHelpText = { true }
                  value = { newPassword }
                  onChange = { e => setNewPassword(e.target.value )}
                />
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Stack direction = "row" justifyContent = "space-between" width = "full">
                <Button 
                  width = "full"
                  type = "submit" 
                  variant = "primary"
                  isDisabled = { !isValid }
                  isLoading = { isLoading }
                >Change Password</Button>
              </Stack>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
};