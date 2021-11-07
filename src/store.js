import { configureStore } from '@reduxjs/toolkit';
import { chatReducer } from './slices/chatSlice.js';

export default configureStore({
  reducer: {
    chat: chatReducer,
  },
});
