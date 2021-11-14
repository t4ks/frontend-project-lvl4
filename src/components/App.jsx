import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import Chat from './Chat.jsx';
import LoginPage from './Login.jsx';
import NotFound from './NotFound.jsx';
import SignUp from './SignUp.jsx';
import AuthButton from './AuthButton';
import { useAuth } from '../hooks';
import AuthProvider from '../providers/auth';
import SocketProvider from '../providers/socket';

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
