import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getCurrentUser } from "../store/slices/authSlice";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading, token } = useAppSelector(
    (state) => state.auth
  );

  // NOTE: We don't auto-fetch current user here for the mocked local auth
  // flow. When backend is available, consider re-adding a refresh path (e.g.
  // dispatch(getCurrentUser()) when a token exists).

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
