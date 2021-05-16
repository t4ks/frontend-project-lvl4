import React, { useState, useContext } from 'react';
import { Navbar, Button } from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import Chat from './Chat.jsx';
import LoginPage from './Login.jsx';
import { authContext } from '../contexts/index.jsx';
import useAuth from '../hooks/index.jsx';


// eslint-disable-next-line react/prop-types
const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  return (
    <authContext.Provider value={{ loggedIn, logIn, logOut }}>
      {children}
    </authContext.Provider>
  );
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
          <PrivateRoute path='/'>
            <Chat />
          </PrivateRoute>
        </Switch>
      </Router>
    </AuthProvider>
  )
}

export default App;
