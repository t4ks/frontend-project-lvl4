import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { authContext } from '../contexts';

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

export default AuthButton;
