import React from 'react';
import { useTranslation } from 'react-i18next';


const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div><p>{t('Page not found')}</p></div>
  );
}

export default NotFound;