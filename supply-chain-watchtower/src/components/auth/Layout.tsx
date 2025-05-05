import { useEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Layout = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Debug log to see auth state changes
  useEffect(() => {
    console.log("Auth state in Layout:", { isAuthenticated, isLoading, user });
  }, [isAuthenticated, isLoading, user]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-pulse">Loading authentication...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login with the return URL
    return <Navigate to={`/login?returnUrl=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <Outlet />;
};

export default Layout;
