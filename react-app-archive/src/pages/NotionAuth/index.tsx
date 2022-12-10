import { Center } from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";

import { LoadingSpinner } from "src/components/LoadingSpinner";
import { AccessDenied } from "./AccessDenied";
import { Success } from "./Success";
import { Card } from "src/components/Card";
import { nhost } from "src/lib/nhost";
import { Page } from "src/components/Page";
import { useCallback, useEffect, useState } from "react";
import { exchangeNotionToken } from "src/lib/functions";
import { useAuth } from "src/lib/useAuth";

export const NotionAuth = () => {
  const { user } = useAuth();
  const session = nhost.auth.getSession();
  const [ screen, setScreen ] = useState('');
  const [ isLoading, setIsLoading ] = useState(true);
  const searchParams = useSearchParams();
  const code = searchParams[0].get('code');
  const refreshToken = searchParams[0].get('state');
  const error = searchParams[0].get('error');

  // TODO: Figure out why I can't call this function without userId
  const fetchRefreshToken = useCallback(async (code: string) => {
    return exchangeNotionToken({ code, userId: user?.id, redirectUri: `${window.location.origin}/auth/notion` })
    .then(() => { setScreen('success'); setIsLoading(false) })
  }, [ user ]);

  useEffect(() => {
    if ( code && session && user && !screen ) {
      setIsLoading(true)
      fetchRefreshToken(code)
      .catch(err => { console.log(err); setTimeout(() => fetchRefreshToken(code), 5000)})
    }
  }, [ code, session, screen, user, fetchRefreshToken ]);
  
  useEffect(() => {
    if ( refreshToken ) { nhost.auth.refreshSession(refreshToken).then(response => {
      const accessToken = response.session?.accessToken;
      if ( !accessToken ) { return; }
      nhost.functions.setAccessToken(accessToken);
    }) }
  }, [ refreshToken ] );

  useEffect(() => { if ( error ) { setScreen(error) }}, [ error ]);
  
  return (
    <Page hasNavigation = { false }>
      <Center w = "full" maxW = "xl" mx = "auto" flexDir = "column" mt = {{ base: 10, sm: 20, md: 32 }} px = {{ base: 8, md: 'unset' }}>
        <Card shadow = "sm" width = "full" px = { 8 } py = { 8 }>
          { screen === 'access_denied' && <AccessDenied /> }
          { screen === 'success' && <Success /> }
          { isLoading &&  <LoadingSpinner /> }
        </Card>
      </Center>
    </Page>
  )
}