import axios from 'axios';


export const withTimeout = (onSuccess, onTimeout, timeout) => {
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
    onSuccess.apply(this, args);
  }
};


export const authorizeUser = async ({ url, username, password, auth, history, from }) => {
  const response = await axios.post(url, { username: username, password: password });
  localStorage.setItem('userId', response.data.token);
  localStorage.setItem('userName', response.data.username);
  auth.logIn();
  history.replace(from);
};
