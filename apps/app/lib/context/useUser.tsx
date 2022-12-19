import { useSession } from "next-auth/react";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { trpc } from "../trpc";
import { frontendIdentify as identify } from "../analytics";
import { User } from "@prisma/client";
import { LoadingIndicator } from "~/components/Common/LoadingIndicator";
import Stripe from "stripe";

export interface UserContextType {
  user?: User;
  isAuthenticated?: boolean;
  customer?: {
    id: string;
    createdAt: Date;
  }
  trialEndsAt?: Date;
  hasAppAccess?: boolean;
  subscription?: {
    id: string;
    status: Stripe.Subscription.Status;
    cancelAtPeriodEnd: boolean;
    trialStartedAt: Date | undefined;
    trialEndedAt: Date | undefined;
    endedAt: Date | undefined;
    startedAt: Date;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    interval: Stripe.Plan.Interval;
    canceledAt: Date | undefined;
  },
  refetchUser: () => Promise<any>;
  refetchSubscription: () => Promise<any>; 
}

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children, isProtectedRoute }: { children: ReactNode; isProtectedRoute: boolean }) => {
  const [ isUserIdentified, setIsUserIdentified ] = useState(false);
  const session = useSession();

  const userId = session.data?.user.id;
  const sessionStatus = session.status;

  const { data: user, isLoading: isLoadingUser, refetch: refetchUser, isRefetching: isRefetchingUser } = trpc.users.getUser.useQuery(undefined, { enabled: !!userId });
  const { 
    data: subscriptionData, 
    isLoading: isLoadingSubscription, 
    refetch: refetchSubscription, 
    isRefetching: isRefetchingSubscription 
  } = trpc.stripe.getSubscription.useQuery(undefined, { enabled: !!userId })

  const isRefetching = isRefetchingUser || isRefetchingSubscription
  const isLoading = (isLoadingUser || isLoadingSubscription) && !isRefetching

  useEffect(() => {
    if ( userId && !isUserIdentified ) {
      identify({ userId });
      setIsUserIdentified(true)
    }
  }, [ userId, isUserIdentified ]);

  const memoedValue = useMemo(
    () => ({
      user,
      customer: subscriptionData?.customer,
      hasAppAccess: subscriptionData?.hasAppAccess,
      trialEndsAt: subscriptionData?.trialEndsAt,
      subscription: subscriptionData?.subscription,
      isAuthenticated: sessionStatus === 'authenticated',
      refetchUser,
      refetchSubscription
    }) as UserContextType, [ user, isProtectedRoute, subscriptionData, refetchSubscription, refetchUser]
  )

  if ( isLoading && isProtectedRoute && !isRefetching ) {
    return <LoadingIndicator />
  }

  return <UserContext.Provider value = { memoedValue }>{ children }</UserContext.Provider> 
}

export const useUser = () => useContext(UserContext);