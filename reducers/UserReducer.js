import * as types from '../actions/types';

const defaultState = {};

export default function userReducer(state = defaultState, action) {
  switch(action.type) {
    case types.SET_USER:
    	const userInfo = action.user;
    	return Object.assign({}, state, userInfo);
    default:
      return state;
  }
}
