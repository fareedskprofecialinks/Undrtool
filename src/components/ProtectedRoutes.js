import React from "react";
import { Route, Redirect } from 'react-router-dom';
import Config from "../config/config";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const data = Config.getLoginData();
  return (
    <Route
      {...rest}
      render={props =>
        data
          ? <Component  {...props} />
          : <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location }
            }}
          />}
    />
  )
}

export default ProtectedRoute;