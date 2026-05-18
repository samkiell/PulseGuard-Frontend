import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../utils/auth";

export function ProtectedRoute() {
  if (getToken() === null) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
