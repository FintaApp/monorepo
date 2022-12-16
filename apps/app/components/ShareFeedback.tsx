import { useState, useEffect, FormEvent } from "react";
import { 
  Button,
  Box,
  Icon,
  Input,
  MenuItem, 
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  Textarea
} from '@chakra-ui/react';
import { PaperPlaneIcon } from '@radix-ui/react-icons';

import { createSupportTicket } from "~/utils/frontend/functions"
import { useToast } from "~/utils/frontend/useToast";

export const ShareFeedback = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ subject, setSubject ] = useState("");
  const [ body, setBody ] = useState("");
  const [ isSending, setIsSending ] = useState(false);
  const renderToast = useToast();

  useEffect(() => {
    setSubject("");
    setBody("");
    setIsSending(false);
  }, [ isOpen ]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    createSupportTicket({ subject, body })
    .then(() => {
      renderToast({
        status: 'success',
        title: "Message Sent",
        message: "You'll receive a response in your email inbox shortly"
      })
    })
    .catch(() => {
      renderToast({
        status: 'error',
        title: "Uh Oh",
        message: "There was an issue sending the message. Please email hello@finta.io directly."
      })
    })
    .finally(onClose);
  }

  return (
    <>
      <MenuItem
        icon = { <Icon display = "flex" alignItems = "center" as = { PaperPlaneIcon } width = "12px" height = "12px" /> }
        onClick = { onOpen }
      >Share feedback</MenuItem>

      <Modal isOpen = { isOpen } onClose={onClose} size = "xl" returnFocusOnClose = { false }>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
              <Text mb = "2">Share feedback</Text>
              <Text fontSize = "sm">Submit any questions, ideas, or bugs and someone will get back to you as soon as possible.</Text>
            </ModalHeader>
          <ModalCloseButton />
          <form onSubmit = { onSubmit }>
            <ModalBody>
              <Box>
                <Input 
                  value = { subject }
                  onChange = { e => setSubject(e.target.value) }
                  fontWeight = "medium"
                  border = "none"
                  _focus = {{ border: "none" }}
                  placeholder = "Subject"
                  autoFocus = { true }
                  px = "0"
                  focusBorderColor = "none"
                />
                <Textarea 
                  px = "0"
                  placeholder = "Enter feedback here"
                  value = { body }
                  onChange = { e => setBody(e.target.value )}
                  bg = "none"
                />
              </Box>
            </ModalBody>

            <ModalFooter display = "flex" justifyItems = "flex-end">
              <Button 
                rightIcon = { <PaperPlaneIcon /> }
                isDisabled = { subject === "" || body === "" }
                type = "submit"
                isLoading = { isSending }
                variant = "primary"
              >Send</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}