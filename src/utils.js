import axios from 'axios';

export const withTimeout = (onSuccess, onTimeout, timeout) => {
  // eslint-disable-next-line functional/no-let
  let called = false;

  const timer = setTimeout(() => {
    if (called) return;
    called = true;
    onTimeout();
  }, timeout);

  return (...args) => {
    if (called) return;
    called = true;
    clearTimeout(timer);
    // eslint-disable-next-line functional/no-this-expression
    onSuccess.apply(this, args);
  };
};

export const authorizeUser = async ({
  url, username, password, auth, history, from,
}) => {
  const response = await axios.post(url, { username, password });
  auth.logIn({ user: { userId: response.data.token, userName: response.data.username } });
  history.replace(from);
};
