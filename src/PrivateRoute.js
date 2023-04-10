import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

function PrivateRoute({ path, component: Component }) {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  console.log(currentUser);
  return (
    <Routes>
      <Route
        path={path}
        element={
          currentUser ? (
            <Component />
          ) : (
            <Navigate to="/erro-nao-autorizado" replace />
          )
        }
      />
    </Routes>
  );
}

export default PrivateRoute;
