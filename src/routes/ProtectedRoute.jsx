import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isLoading, token, getCustomer, getUser } = useAuth();

  useEffect(() => {
    if (token && !user && !isLoading) {
      getCustomer().catch(() => {
        getUser();
      });
    }
  }, [token, user, isLoading, getCustomer, getUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    if (user.role === "customer") return <Navigate to="/" replace />;
    if (user.role === "vendor") return <Navigate to="/vendor" replace />;
    if (user.role === "admin") return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
