import { StyleFunctionProps } from "@chakra-ui/react";
import { mode } from '@chakra-ui/theme-tools';

export const Table = {
  defaultProps: {
    variant: 'unstyled'
  },
  baseStyle: (props: StyleFunctionProps) => ({
    table: {

    },
    th: {
      fontWeight: "semibold",
      opacity: "0.5",
      textAlign: "left",
      letterSpacing: "wider",
      textTransform: 'unset',
      borderBottom: '1px',
      borderColor: mode('gray.light.8', 'gray.dark.8')(props),
      color: mode('gray.light.12', 'gray.dark.12')(props),
      py: 3,
      fontSize: 'sm'
    },
    td: {
      border: "none"
    }
  }),
  sizes: {
    sm: {
      td: {
        py: 2
      },
      th: {
        py: "3",
        lineHeight: "4",
        fontSize: "sm",
      }
    }
  },
  variants: {
    bordered: (props: StyleFunctionProps) => ({
      td: {
        borderBottom: '1px',
        borderColor: mode('gray.light.6', 'gray.dark.6')(props),
      },
      tbody: {
        tr: {
          "&:last-of-type": {
            td: {
              borderBottom: "none"
            }
          }
        }
      }
    })
  }
};