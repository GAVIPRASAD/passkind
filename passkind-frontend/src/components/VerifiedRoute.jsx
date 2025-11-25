import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/authStore";

const VerifiedRoute = () => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user && !user.isEmailVerified) {
    return <Navigate to="/verify-email" />;
  }

  return <Outlet />;
};

export default VerifiedRoute;
