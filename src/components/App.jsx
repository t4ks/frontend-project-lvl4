import React, { useState, useContext } from 'react';
import { Navbar, Button, Container } from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Chat from './Chat.jsx';
import LoginPage from './Login.jsx';
import NotFound from './NotFound.jsx';
import SignUp from './SignUp.jsx';
import { authContext, socketContext } from '../contexts';
import useAuth from '../hooks/index.jsx';

// eslint-disable-next-line react/prop-types
const AuthProvider = ({ children }) => {
  const savedUserData = localStorage.getItem('userData');
  const initialState = savedUserData !== undefined ? JSON.parse(savedUserData) : null;
  const [userData, setLoggedIn] = useState(initialState);
  const logIn = ({ user }) => {
    localStorage.setItem('userData', JSON.stringify(user));
    setLoggedIn(user);
  };
  const logOut = () => {
    localStorage.removeItem('userData');
    setLoggedIn(null);
  };

  return (
    <authContext.Provider value={
      {
        logIn, logOut, userData,
      }
    }
    >
      {children}
    </authContext.Provider>
  );
};

// eslint-disable-next-line react/prop-types
const SocketProvider = ({ children, socket }) => (
  <socketContext.Provider value={socket}>
    {children}
  </socketContext.Provider>
);

const AuthButton = () => {
  const auth = useContext(authContext);
  const { t } = useTranslation();
  return (
    auth.userData !== null
      ? <Button onClick={auth.logOut}>{t('Log out')}</Button>
      : (
        <div>
          <Button as={Link} to="/login">{t('Log in')}</Button>
          {' '}
          <Button as={Link} to="/signup">{t('Sign Up')}</Button>
        </div>
      )
  );
};

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ children, path }) => {
  const auth = useAuth();
  return (
    <Route
      path={path}
      render={({ location }) => (auth.userData !== null
        ? children
        : <Redirect to={{ pathname: '/login', state: { from: location } }} />)}
    />
  );
};

const App = ({ socket }) => (
  <div className="d-flex flex-column h-100">
    <AuthProvider>
      <Router>
        <Navbar bg="white" expand="lg" className="shadow-sm">
          <Container>
            <Navbar.Brand href="/">Hexlet Chat</Navbar.Brand>
            <AuthButton />
          </Container>
        </Navbar>
        <Switch>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/signup">
            <SignUp />
          </Route>
          <PrivateRoute exact path="/">
            <SocketProvider socket={socket}>
              <Container className="h-100 my-4 overflow-hidden rounded shadow">
                <Chat />
              </Container>
            </SocketProvider>
          </PrivateRoute>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </Router>
    </AuthProvider>
  </div>
);

export default App;
