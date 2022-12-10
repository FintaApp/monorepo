import { useState } from "react";
import { Button } from "@chakra-ui/react";

import { useToast } from "src/lib/useToast";
import { nhost } from "src/lib/nhost";
import { useAuth } from "src/lib/useAuth";

export const VerifyEmail = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [ isSending, setIsSending ] = useState(false);
  const [ isSent, setIsSent ] = useState(false);

  const onClick = () => {
    setIsSending(true);
    nhost.auth.sendVerificationEmail({ email: user!.email, options: { redirectTo: '/verifyEmail'} })
    .then(response => {
      setIsSending(false);
      const { error } = response;
      if ( error ) {
        console.log(error.message)
        toast({
          title: "Uh Oh",
          message: "We've ran into an error unfortunately. The team has already been notified, and you will receive an email when Finta is up and running again.",
          status: "error"
        })
        return null;
      }

      setIsSent(true);
      toast({
        title: "Check your Email",
        message: "Please check your email inbox for instructions.",
        status: "success"
      })
    })
  }
  return <Button 
    isLoading = { isSending }
    onClick = { onClick }
    isDisabled = { isSent } 
    size = "sm" 
    variant = "outline"
  >Verify Email</Button>
}