import { createContext, ReactNode, useCallback, useEffect, useMemo, useContext } from "react";
import { useAuthenticationStatus, useSignOut } from "@nhost/react";
import * as Sentry from "@sentry/react";
import moment from "moment-timezone";

import * as analytics from "src/lib/analytics";
import { nhost } from "src/lib/nhost";
import { UserModel } from "src/types/models";
import { useGetUserQuery, useSetupUserMutation } from "src/graphql";
import { parseAuthError } from "./parseAuthError";

interface AuthErrorType { field: 'email' | 'password', message: string, code: string }

interface AuthContextType {
  user?: UserModel;
  login: ({ email, password }: { email: string; password: string }) => Promise<{ error?: AuthErrorType }>;
  signUp: ({ email, password, name }: { email: string; password: string; name: string }) => Promise<{ error?: AuthErrorType }>;
  signOut: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const { signOut } = useSignOut()
  const { isLoading: isAuthLoading } = useAuthenticationStatus();
  const [ setupUser ] = useSetupUserMutation({ refetchQueries: 'all' });
  const userId = nhost.auth.getUser()?.id;

  const { data: userData, loading: isUserDataLoading } = useGetUserQuery({
    variables: { user_id: userId },
    skip: !userId
  });

  const user = useMemo(() => userData?.user || undefined as UserModel | undefined, [ userData ]);

  useEffect(() => {
    if ( user && !user.profile ) { setupUser({ variables: { userId: user.id }});}
  }, [ user, setupUser ]);

  nhost.auth.onAuthStateChanged((event, session) => {
    if ( event === 'SIGNED_IN' ) {
      if ( !session ) { throw new Error("Signed-in user does not have a session") };
      if ( !session.user ) { throw new Error("Session does not have a user") };
      const { id, email } = session.user;

      //nhost.functions.setAccessToken(session.accessToken);
      analytics.alias({ userId: id });
      analytics.identify({ userId: id });
      Sentry.setUser({ email, id })
    }

    if ( event === 'SIGNED_OUT' ) {
      analytics.reset();
      Sentry.setUser(null);
    }
  })

  const signUp = useCallback(async ({ email, password, name }: { email: string; password: string; name: string }) => {
    const timezone = moment.tz.guess(true);
    
    return nhost.auth.signUp({ email, password, options: { displayName: name, metadata: { timezone }}})
    .then(async response => {
      const { error, session } = response;
      if ( error ) {
        if ( error.error === 'already-signed-in' ) { window.location.assign('/'); return }
        const parsedError = parseAuthError(error);
        analytics.track({ 
          event: analytics.EventNames.ERROR_TRIGGERED,
          properties: {
            error: parsedError.code
          }
        });
        return { error: parsedError }
      }

      if ( !session || !session.user ) { throw new Error("No Session") };

      return session;
    })
    .catch(err => console.log(err))
  }, []);

  const login = useCallback(async ({ email, password }: { email: string; password: string; }) => {
    return nhost.auth.signIn({ email, password })
    .then(response => {
      const { error } = response;
      if ( error ) {
        if ( error.error === 'already-signed-in' ) { window.location.assign('/'); return }
        const parsedError = parseAuthError(error);
        analytics.track({ 
          event: analytics.EventNames.ERROR_TRIGGERED,
          properties: {
            error: parsedError.code
          }
        });
        return { error: parsedError }
      };

      analytics.track({ event: analytics.EventNames.USER_LOGGED_IN });
      return {}
    })
  }, []);

  const memoedValue = useMemo(
    () => ({
      user,
      signOut,
      login,
      signUp,
      isLoading: isAuthLoading || isUserDataLoading
    }) as AuthContextType,
    [ user, signOut, signUp, login, isAuthLoading, isUserDataLoading ]
  )

  return <AuthContext.Provider value = { memoedValue }>{ children }</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);