import {
  Box,
  CloseButton,
  HStack,
  Icon,
  Text,
  useColorModeValue as mode
} from "@chakra-ui/react";
import { CheckCircleIcon, InfoIcon, WarningIcon } from "@chakra-ui/icons";

const toastColor = {
  info: "primary",
  success: "green",
  error: "tomato"
}

const ToastIcon = {
  info: InfoIcon,
  success: CheckCircleIcon,
  error: WarningIcon
}

export type ToastStatusType = 'info' | 'success' | 'error';

export interface ToastParams {
  message?: string;
  onClose: () => void;
  status: ToastStatusType;
  title: string;
  duration?: number;
}

export const Toast = (params: ToastParams) => {
  const { message, onClose, status, title } = params;

  return (
    <Box 
      width = "full"
      shadow = "sm"
      bg = { mode("white", "gray.dark.5") } p = "3" rounded = "base"
    >
      <HStack justifyContent = "space-between">
        <HStack>
          <Icon width = { 4 } height = { 4 } color = { `${toastColor[status]}.${mode('light', 'dark')}.9` } as = { ToastIcon[status] } />
          { title ? <Text fontSize = "sm" display = "flex" flexWrap = "wrap" fontWeight = "medium">{ title }</Text> : null }
        </HStack>
        <CloseButton onClick = { onClose } size = "sm" />
      </HStack>
      
      { message ? <Text fontSize = "sm" mt = "1">{ message }</Text> : null }
    </Box>
  );
}