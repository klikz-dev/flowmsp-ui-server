import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import session from './SessionReducer';
import customer from './CustomerReducer';
import user from './UserReducer';

const rootReducer = combineReducers({
    session,
    customer,
    user,
    routing
});

export default rootReducer;
