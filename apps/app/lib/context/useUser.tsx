import { createContext, useEffect, useMemo, ReactNode, useState, useContext } from "react";
import { useAuthenticated, useUserId } from "@nhost/nextjs";

import { LoadingIndicator } from "~/components/LoadingIndicator";
import { frontendIdentify } from "../analytics";
import { trpc, RouterOutput } from "../trpc";

export interface UserContextType {
  user?: RouterOutput['users']['getUser'];
  isAuthenticated?: boolean;
  customer?: RouterOutput['stripe']['getSubscription']['customer']
  trialEndsAt?: RouterOutput['stripe']['getSubscription']['trialEndsAt'];
  hasAppAccess?: RouterOutput['stripe']['getSubscription']['hasAppAccess'];
  subscription?: RouterOutput['stripe']['getSubscription']['subscription'];
  refetchUser: () => Promise<any>;
  refetchSubscription: () => Promise<any>; 
};

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children, isProtectedRoute }: { children: ReactNode, isProtectedRoute: boolean }) => {
  const [ isUserIdentified, setIsUserIdentified ] = useState(false);
  const userId = useUserId();
  const isAuthenticated = useAuthenticated();

  const { data: user, isLoading: isLoadingUser, refetch: refetchUser } = trpc.users.getUser.useQuery(undefined, { enabled: !!userId });
  const { data: subscriptionData, isLoading: isLoadingSubscription, refetch: refetchSubscription } = trpc.stripe.getSubscription.useQuery({ customerId: user?.stripeCustomerId! }, { enabled: !!user?.stripeCustomerId });
  const isLoading = isLoadingUser || isLoadingSubscription;

  useEffect(() => {
    if ( userId && !isUserIdentified ) {
      frontendIdentify({ userId });
      setIsUserIdentified(true)
    }
  }, [ userId, isUserIdentified ]);

  const memoedValue = useMemo(() => ({
    user,
    customer: subscriptionData?.customer,
    hasAppAccess: subscriptionData?.hasAppAccess,
    trialEndsAt: subscriptionData?.trialEndsAt,
    subscription: subscriptionData?.subscription,
    isAuthenticated,
    refetchUser,
    refetchSubscription
  }) as UserContextType, [ user, subscriptionData, isAuthenticated ]);

  if ( isLoading && isProtectedRoute ) { return <LoadingIndicator />};

  return <UserContext.Provider value = { memoedValue }>{ children }</UserContext.Provider>
};

export const useUser = () => useContext(UserContext);