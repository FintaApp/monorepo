import { useEffect } from "react";
import { 
  Button,
  Box,
  Icon,
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
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "../../Forms";
import { useToast } from "~/lib/context/useToast";
import { trpc } from "~/lib/trpc";
import { ISupportTicketSchema, supportTicketSchema } from "~/lib/validation/forms";

type FormData = z.infer<typeof supportTicketSchema>

export const ShareFeedback = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { register, handleSubmit, formState, setError, reset } = useForm<ISupportTicketSchema>({ resolver: zodResolver(supportTicketSchema) });
  const { mutateAsync, isLoading } = trpc.zendesk.createSupportTicket.useMutation();
  const renderToast = useToast();

  useEffect(reset, [ isOpen ]);

  const onSubmit = (data: FormData) => {
    const { body, subject } = data;
    mutateAsync({ subject, body })
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

      <Modal isOpen = { isOpen } onClose={onClose} size = "xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
              <Text mb = "2">Share feedback</Text>
              <Text fontSize = "sm">Submit any questions, ideas, or bugs and someone will get back to you as soon as possible.</Text>
            </ModalHeader>
          <ModalCloseButton />
          <form style = {{ width: '100%' }} onSubmit = { handleSubmit(onSubmit) }>
            <ModalBody>
              <Box>
                <Input 
                  fontWeight = "medium"
                  border = "none"
                  _focus = {{ border: "none" }}
                  placeholder = "Subject"
                  autoFocus = { true }
                  px = "0"
                  focusBorderColor = "none"
                  { ...register('subject')}
                />
                <Textarea 
                  px = "0"
                  placeholder = "Enter feedback here"
                  bg = "none"
                  { ...register('body')}
                />
              </Box>
            </ModalBody>

            <ModalFooter display = "flex" justifyItems = "flex-end">
              <Button 
                rightIcon = { <PaperPlaneIcon /> }
                isDisabled = { !formState.isValid }
                type = "submit"
                isLoading = { isLoading }
                variant = "primary"
              >Send</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}