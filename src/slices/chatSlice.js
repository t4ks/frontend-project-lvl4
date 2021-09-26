import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import routers from '../routes.js';
import axios from 'axios';
import produce from 'immer';


const initialState = {
  channels: [],
  currentChannelId: null,
  messages: [],
  state: 'idle',
}


export const fetchChannels = createAsyncThunk('chat/fetchChannels', async (authToken) => {
  const response = await axios.get(routers.dataPath(), { headers: { Authorization: `Bearer ${authToken}` } });
  return response.data
});


const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addNewMessage(state, action) {
      const message = action.payload;
      state.messages.push(message);
    },
    changeCurrentChannel(state, action) {
      const newCurrentChannel = action.payload;
      state.currentChannelId = newCurrentChannel;
    },
    addNewChannel(state, action) {
      const newChannel = action.payload;
      state.channels.push(newChannel);
    },
    renameChannel(state, action) {
      const updatedChannel = action.payload;
      const newChannels = produce(state.channels, draft => {
        const index = draft.findIndex(ch => ch.id === updatedChannel.id)
        if (index !== -1) draft[index] = updatedChannel;
      });
      state.channels = newChannels;
    },
    removeChannel(state, action) {
      const removedChannelId = action.payload;
      const newChannels = state.channels.filter(ch => ch.id !== removedChannelId);
      const messages = state.messages.filter(msg => msg.channelId !== removedChannelId);
      state.channels = newChannels;
      state.messages = messages;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChannels.fulfilled, (state, action) => {
      state.channels = action.payload.channels;
      state.messages = action.payload.messages;
      state.currentChannelId = action.payload.currentChannelId;
    })
  },
});

export const chatReducer = chatSlice.reducer;
export const {
  addNewMessage,
  changeCurrentChannel,
  addNewChannel,
  renameChannel,
  removeChannel,
} = chatSlice.actions;