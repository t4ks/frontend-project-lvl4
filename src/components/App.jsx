import React, { useState, useContext } from 'react';
import { Navbar, Button } from 'react-bootstrap';
import { Provider as RollBarProvider, ErrorBoundary, LEVEL_WARN } from '@rollbar/react';
import { io } from "socket.io-client";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import Chat from './Chat.jsx';
import LoginPage from './Login.jsx';
import NotFound from './NotFound.jsx';
import SignUp from './SignUp.jsx';
import { authContext, socketContext } from '../contexts/index.jsx';
import useAuth from '../hooks/index.jsx';
import { useTranslation } from 'react-i18next';
import { rollbarConfig, rollbarInstance } from '../rollbar.js';


// eslint-disable-next-line react/prop-types
const AuthProvider = ({ children }) => {
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');
  const initialState = userId !== null;
  const [loggedIn, setLoggedIn] = useState(initialState);
  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  return (
    <authContext.Provider value={{ loggedIn, logIn, logOut, userId, userName }}>
      {children}
    </authContext.Provider>
  );
};


// eslint-disable-next-line react/prop-types
const SocketProvider = ({ children }) => {
  const socket = io(process.env.API_URL);
  return (
    <socketContext.Provider value={ socket }>
      {children}
    </socketContext.Provider>
  )
};


const AuthButton = () => {
  const auth = useContext(authContext);
  const { t } = useTranslation();
  return (
    auth.loggedIn
      ? <Button onClick={auth.logOut}>{t('Log out')}</Button>
      : <div><Button as={Link} to="/login">{t('Log in')}</Button> <Button as={Link} to="/signup">{t('Sign Up')}</Button></div>
  );
};



// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ children, path }) => {
  const auth = useAuth();

  return (
    <Route
      path={path}
      render={({ location }) => (auth.loggedIn
        ? children
        : <Redirect to={{ pathname: '/login', state: { from: location } }} />)}
    />
  );
};

const checkBoundaryCatch = ({error, info}) => {
  console.log('ERROR -> ', error);
  console.log('INFO -> ', info);
}

const App = () => {
  return (
    <RollBarProvider config={rollbarConfig} instance={rollbarInstance}>
      <ErrorBoundary level={LEVEL_WARN} extra={checkBoundaryCatch}>
        <AuthProvider>
          <Router>
            <Navbar bg="light" expand="lg">
              <Navbar.Brand href="/">Hexlet Chat</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse className="justify-content-end">
                <AuthButton />
              </Navbar.Collapse>
            </Navbar>
            <Switch>
              <Route path="/login">
                <LoginPage />
              </Route>
              <Route path='/signup'>
                <SignUp />
              </Route>
              <PrivateRoute exact path='/'>
                <SocketProvider>
                  <Chat />
                </SocketProvider>
              </PrivateRoute>
              <Route path='*'>
                <NotFound />
              </Route>
            </Switch>
          </Router>
        </AuthProvider>
      </ErrorBoundary>
    </RollBarProvider>
  )
}

export default App;
