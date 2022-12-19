import { FormLabel, FormControl, VStack, Button } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "./Forms";
import { IEmailAuthSchema, emailAuthSchema } from "~/lib/validation/auth";
import { useState } from "react";
import { useToast } from "~/utils/frontend/useToast";

type FormData = z.infer<typeof emailAuthSchema>

export const UserAuthForm = () => {
  const renderToast = useToast();
  const { register, handleSubmit, formState, getValues } = useForm<IEmailAuthSchema>({ resolver: zodResolver(emailAuthSchema) });
  const [ isLoading, setIsLoading ] = useState(false);
  const [ isEmailSent, setIsEmailSent ] = useState(false);

  const searchParams = useSearchParams();

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    const result = await signIn("email", {
      email: data.email.toLowerCase(),
      redirect: false,
      callbackUrl: searchParams.get('next') || '/destinations'
    });

    setIsLoading(false);
    if ( !result?.ok ) {
      return renderToast({
        status: 'error',
        title: "Something went wrong",
        message: "Your sign in request failed. Please try again."
      })
    }

    setIsEmailSent(true);
    return renderToast({
      status: 'success',
      title: "Check your email",
      message: "We sent you a login link. Be sure to check your spam too."
    })
  }

  return (
    <VStack spacing = "6" width = 'full'>
      <form style = {{ width: '100%' }} onSubmit = { handleSubmit(onSubmit) }>
        <VStack spacing = "4">
          <FormControl id = "email">
            <FormLabel visibility = { getValues("email")?.length > 0 ? "visible" : "hidden" }>Email</FormLabel>
            <Input 
              autoComplete = "email"
              autoFocus = { true }
              id = "email"
              type = "email"
              placeholder = "Email"
              { ...register("email") }
            />
          </FormControl>

          <Button 
            variant = "primary" 
            isLoading = { isLoading } 
            type = "submit"
            width = "full"
            isDisabled = { !formState.isValid || isEmailSent }
          >{ isEmailSent ? "Link sent" : "Get Magic Link" }</Button>
        </VStack>
      </form>

      {/* <DividerWithText text = "OR CONTINUE WITH" />

      <Button
        leftIcon = { <FcGoogle /> }
        width = "full"
        isDisabled = { isLoading }
      >Google</Button> */}
    </VStack>
    
  )
}