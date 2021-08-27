import { useContext } from 'react';

import { authContext, socketContext } from '../contexts/index.jsx';

const useAuth = () => useContext(authContext);
export const useSocket = () => useContext(socketContext);

export default useAuth;
