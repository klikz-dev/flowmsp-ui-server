import * as types from './types';
import auth from '../auth/Authenticator';

export function loginSuccess(authData) {
  return { type: types.LOG_IN_SUCCESS };
}

export function logoutUser() {
  auth.logout();
  return {type: types.LOG_OUT};
}

export function loginError(errMsg) {
	  return {type: types.INVALID_CREDENTIAL, errMsg: errMsg};
}
