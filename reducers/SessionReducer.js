import * as types from '../actions/types';

const defaultState = {
  isLoggedIn: false
};

export default function sessionReducer(state = defaultState, action) {
  switch(action.type) {
    case types.LOG_IN_SUCCESS:
      return Object.assign({}, state, { isLoggedIn: !!sessionStorage.jwt, errorMessage: '' });
    case types.INVALID_CREDENTIAL:
    	return Object.assign({}, state, { errorMessage: action.errMsg ? action.errMsg : 'Invalid credential' });
    case types.LOG_OUT:
      return Object.assign({}, state, { isLoggedIn: !!sessionStorage.jwt });

    default:
      return state;
  }
}
