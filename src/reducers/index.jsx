import { fetchChannlesSuccess } from '../actions/index';
import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';


const handleFetchChannels = (state, { payload: { channels } }) => {
    return [ ...state,  ...channels];
}


const handleFetchMessages = (state, { payload: { messages } }) => {
    return [ ...state, ...messages ];
}


const channelHandlers = {
    [fetchChannlesSuccess]: handleFetchChannels,
}

const messageHandlers = {
    [fetchChannlesSuccess]: handleFetchMessages
}

const channelReducer = handleActions(channelHandlers, []);


const messageReducer = handleActions(messageHandlers, []);


const reducer = combineReducers({
    channels: channelReducer,
    messages: messageReducer,
})


export default reducer;