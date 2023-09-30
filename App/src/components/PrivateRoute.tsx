import React from "react";
import { Route, Navigate } from "react-router-dom";

interface PrivateRouteProps {
  path: string;
  element: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ path, element }) => {
  const isAuthenticated = !!localStorage.getItem("jwt"); // Check if JWT exists in localStorage or cookie

  return isAuthenticated ? (
    <Route path={path} element={element} />
  ) : (
    <Navigate to="/auth" replace state={{ from: path }} />
  );
};

export default PrivateRoute;
