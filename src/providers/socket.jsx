import React from 'react';
import { socketContext } from '../contexts';

const SocketProvider = ({ children, socket }) => (
  <socketContext.Provider value={socket}>
    {children}
  </socketContext.Provider>
);

export default SocketProvider;
