import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import auth from '../auth/Authenticator';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    auth.loggedIn() ? (
      <Component {...props} />
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    )
  )}/>
);

export default PrivateRoute;
