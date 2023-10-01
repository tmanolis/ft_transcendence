import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from 'js-cookie';

const PrivateRoute: React.FC<{ component: React.ReactElement }> = ({ component }) => {
  let isAuthenticated = Cookies.get('jwt');
  
  if (isAuthenticated) {
    return component;
  } else {
    // Redirect the user to the login page if not authenticated
    return <Navigate to="/auth" />;
  }
};

export default PrivateRoute;
