import {
  Box,
  BoxProps,
  chakra,
  Text,
  useColorModeValue as mode,
  VStack
} from '@chakra-ui/react'

export interface LargeIconButtonProps extends BoxProps {
  label: string;
  Icon: any;
  description: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  onClick: () => void;
  size?: 'sm' | 'lg'
}

const ButtonBox = chakra('button', {
  baseStyle: {
    borderWidth: '1px',
    py: '6',
    borderRadius: 'md',
    transition: 'all 0.2s',
    _hover: { shadow: 'sm' },
    _focus: { shadow: 'outline', boxShadow: "none", outline: "none" },
    _disabled: { opacity: ".7" }
  },
});

export const LargeIconButton = ({ label, Icon, description, onClick, isLoading = false, isDisabled = false, size = 'lg' }: LargeIconButtonProps) => (
  <ButtonBox 
    px = { size === 'sm' ? '2' : '4'} 
    py = { size === 'sm' ? '2' : '6' }
    width = "full" 
    onClick = { onClick } 
    disabled = { isDisabled || isLoading }
  >
    <VStack spacing="4">
      <VStack textAlign="center">
        <Box aria-hidden fontSize="4xl" mb={ size === 'sm' ? 1 : 3} textColor = { mode('primary.light.11', 'primary.dark.11') }>
          <Icon />
        </Box>
        <Text fontWeight="medium" fontSize="xl">
          { isLoading ? "Loading..." : label }
        </Text>
        <Text fontSize="sm">{ description }</Text>
      </VStack>
    </VStack>
  </ButtonBox>
);