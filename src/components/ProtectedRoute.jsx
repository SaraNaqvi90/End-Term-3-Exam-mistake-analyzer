import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import LoadingScreen from "./LoadingScreen";

function ProtectedRoute() {
  const { currentUser, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return <LoadingScreen message="Checking your account..." />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
