import { 
  Box,
  BoxProps,
  useStyleConfig
} from "@chakra-ui/react";

export interface CardProps extends BoxProps {
  variant?: 'fullscreen'
}

export const Card = ({ variant, ...props }: CardProps) => {
  const styles = useStyleConfig('Card', { variant })
  return (
    <Box __css={styles} { ...props } />
  );
}