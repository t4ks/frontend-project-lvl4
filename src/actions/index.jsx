import axios from 'axios';
import { createAction } from 'redux-actions';
import routers from '../routes';
// const fetchChannels = createAction('FETCH_CHANNELS');

export const fetchChannlesRequest = createAction('FETCH_CHANNELS_REQUEST');
export const fetchChannlesSuccess = createAction('FETCH_CHANNELS_SUCCESS');
export const fetchChannlesFailure = createAction('FETCH_CHANNELS_FAILURE');


export const fetchChannels = (authToken) => async (dispatch) => {
  dispatch(fetchChannlesRequest())
  try {
    const response = await axios.get(routers.dataPath(), { headers: { Authorization: `Bearer ${authToken}` } });
    dispatch(fetchChannlesSuccess(response.data));
  } catch (e) {
    console.log(e);
    dispatch(fetchChannlesFailure());
  }
}
