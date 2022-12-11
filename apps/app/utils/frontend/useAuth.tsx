import { createContext, ReactNode, useEffect, useState, useMemo, useContext } from "react";
import { ErrorPayload } from "@nhost/core";
import { useAuthenticated, useUserId } from "@nhost/nextjs";
import { useRouter } from "next/router";

import { useGetUserQuery } from "~/graphql/frontend"
import { FrontendUserModel } from "~/types/frontend";
import * as analytics from "~/utils/frontend/analytics";

import { useLogger } from "./useLogger";

interface AuthContextType {
  parseAuthError: (error: ErrorPayload) => Promise<{ field: string, message: string, code: string }>;
  user?: FrontendUserModel;
  isAuthenticated?: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [ isUserIdentified, setIsUserIdentified ] = useState(false);
  const logger = useLogger();
  const userId = useUserId();
  const router = useRouter();
  const isAuthenticated = useAuthenticated();

  //const action = router.query.action as string;

  const { data: userData, error } = useGetUserQuery({
    variables: { userId },
    skip: !userId
  });
  const user = useMemo(() => userData?.user || undefined, [ userData ]);

  useEffect(() => {
    if ( userId && !isUserIdentified ) {
      analytics.identify({ userId })
      setIsUserIdentified(true);
    }
  }, [ userId, isUserIdentified ]);

  const parseAuthError = async (error: ErrorPayload ) => {
    const { message } = error!;
  
    let response = { field: "", message: "", code: "" }
  
    switch (message) {
      case "Incorrect email or password":
        response = { field: "password", message: "Incorrect credentials", code: "incorrect_credentials"};
        break;
      case "Email already in use":
        response = { field: "email", message: "Account already exists", code: "email_conflict" };
        break;
      case 'Error validating request body. "email" must be a valid email.':
        response = { field: "email", message: "Invalid email", code: "invalid_email" };
        break;
      case 'User is already signed in':
        response = { field: "", message: "", code: "already_singed_in" }
      default:
        await logger.error(new Error("Unhandled auth error"), { error }, true)
    }
  
    return response;
  }

  const memoedValue = useMemo(
    () => ({
      parseAuthError,
      user,
      isAuthenticated
    }) as AuthContextType,
    [ parseAuthError, user, isAuthenticated ]
  )

  return <AuthContext.Provider value = { memoedValue }>{ children }</AuthContext.Provider> 
}

export const useAuth = () => useContext(AuthContext);