import { fetchChannlesSuccess } from '../actions/index';
import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';


const handleFetchChannels = (state, { payload: { channels, currentChannelId } }) => {
    return { list: [...channels], currentChannelId: currentChannelId };
}


const handleFetchMessages = (state, { payload: { messages } }) => {
    const debugMessages = [
        {
            body: '123',
            channelId: 1,
            username: 'user2',
            id: 3,
        },
        {
            body: 'abc',
            channelId: 1,
            username: 'admin',
            id: 4,
        },
        {
            body: 'qwerty123',
            channelId: 2,
            username: 'admin',
            id: 5,
        },
        {
            body: 'lslsl',
            channelId: 1,
            username: 'user1',
            id: 6,
        },
        {
            body: '442131',
            channelId: 2,
            username: 'wwww',
            id: 7,
        }
    ]
    return [...debugMessages, ...messages];
}


const channelHandlers = {
    [fetchChannlesSuccess]: handleFetchChannels,
}

const messageHandlers = {
    [fetchChannlesSuccess]: handleFetchMessages
}

const channelReducer = handleActions(channelHandlers, {list: [], currentChannelId: 1});


const messageReducer = handleActions(messageHandlers, []);


const reducer = combineReducers({
    channels: channelReducer,
    messages: messageReducer,
})


export default reducer;