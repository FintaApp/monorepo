import {
  ChakraProvider,
  Box
} from '@chakra-ui/react'; 
import {
  BrowserRouter as Router,
  Navigate,
  Routes,
  Route
} from 'react-router-dom';

import { AuthProvider } from './lib/useAuth';
import { AuthGate } from 'src/components/AuthGate';
import { theme } from "src/theme";
import { Accounts } from "src/pages/Accounts";
import { VerifyEmail } from "src/pages/VerifyEmail";
import { Destinations } from './pages/Destinations';
import { Login } from "src/pages/Login";
import { NotionAuth } from "src/pages/NotionAuth";
import { OAuthAuthorize } from 'src/pages/OAuthAuthorize';
import { PlaidOauth } from 'src/pages/PlaidOauth';
import { Settings } from 'src/pages/Settings';
import { Signup } from 'src/pages/Signup';
import { SyncLogs } from 'src/pages/SyncLogs';
import { AppRoutes } from './routes';

function App() {

  return (
    <AuthProvider>
      <ChakraProvider theme = { theme }>
        <Box minH = "max" id = "App">
          <Router>
            <Routes>
              <Route path = "/" element = { <AuthGate shouldBeSignedIn><Navigate to={ AppRoutes.DESTINATIONS } /></AuthGate> } />
              <Route path = { AppRoutes.ACCOUNTS } element = { <AuthGate shouldBeSignedIn><Accounts /></AuthGate> } />
              <Route path = { AppRoutes.DESTINATIONS } element = { <AuthGate shouldBeSignedIn><Destinations /></AuthGate> } />
              <Route path = { AppRoutes.LOG_IN} element = { <AuthGate shouldBeSignedIn = { false }><Login /></AuthGate> } />
              <Route path = { AppRoutes.VERIFY_EMAIL } element = { <AuthGate><VerifyEmail /></AuthGate> } />
              <Route path = { AppRoutes.OAUTH_AUTHORIZE } element = { <AuthGate shouldBeSignedIn><OAuthAuthorize /></AuthGate> } />
              <Route path = { AppRoutes.PLAID_OAUTH } element = { <AuthGate shouldBeSignedIn><PlaidOauth /></AuthGate> } />
              <Route path = { AppRoutes.SETTINGS } element = { <AuthGate shouldBeSignedIn ><Settings /></AuthGate> } />
              <Route path = { AppRoutes.LOGS } element = { <AuthGate shouldBeSignedIn ><SyncLogs /></AuthGate> } />
              <Route path = { AppRoutes.AUTH_NOTION } element = { <AuthGate shouldBeSignedIn><NotionAuth /></AuthGate> } />
              <Route path = { AppRoutes.SIGN_UP } element = { <AuthGate><Signup /></AuthGate> } />
            </Routes>
          </Router>
        </Box>
      </ChakraProvider>
    </AuthProvider>
  );
}

export default App;
