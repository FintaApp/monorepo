import { Stack } from "@chakra-ui/react";
import { Form as FormikForm, FormikFormProps } from 'formik';
import { FormEvent } from "react";

interface FormProps extends FormikFormProps {
  onSubmit: (e?: FormEvent<HTMLFormElement> | undefined) => void
}

export const Form = ({ children, ...props }: FormProps) => (
  <FormikForm { ...props } style = {{ width: '100%' }}>
    <Stack spacing = "4">
      <>{ children }</>
    </Stack>
  </FormikForm>
)