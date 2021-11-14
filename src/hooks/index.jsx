import { useContext } from 'react';

import { authContext, socketContext } from '../contexts/index.jsx';

export const useAuth = () => useContext(authContext);
export const useSocket = () => useContext(socketContext);
