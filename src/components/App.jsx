import React, { useState, useContext } from 'react';
import { Navbar, Button } from 'react-bootstrap';
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
import { authContext, socketContext } from '../contexts/index.jsx';
import useAuth from '../hooks/index.jsx';


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
  const socket = io('http://0.0.0.0:5000');
  return (
    <socketContext.Provider value={ socket }>
      {children}
    </socketContext.Provider>
  )
};


const AuthButton = () => {
  const auth = useContext(authContext);

  return (
    auth.loggedIn
      ? <Button onClick={auth.logOut}>Log out</Button>
      : <Button as={Link} to="/login">Log in</Button>
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


const App = () => {
    return (
    <AuthProvider>
      <Router>
        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="/">Chat</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end">
            <AuthButton />
          </Navbar.Collapse>
        </Navbar>
        <Switch>
          <Route path="/login">
            <LoginPage />
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
  )
}

export default App;
