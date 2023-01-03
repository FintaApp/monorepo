import { useBreakpointValue, useToast as useToastChakra, ToastPosition } from "@chakra-ui/react";

import { Toast, ToastStatusType } from "~/components/Common/Toast";

export interface UseToastProps {
  status: ToastStatusType;
  title: string;
  message?: string;
  duration?: number;
}

export const useToast = () => {
  const toast = useToastChakra();
  const position = useBreakpointValue<ToastPosition>({ base: "bottom", md: "bottom-right" })

  const renderToast = (params: UseToastProps) => {
    const { status = "info", title, message, duration = 7000 } = params;

    toast({ 
      position: position,
      render: ({ onClose }) => (
        <Toast
          onClose = { onClose }
          message = { message }
          title = { title }
          status = { status }
        />
      ),
      duration,
      isClosable: true
    })
  }

 return renderToast; 
}