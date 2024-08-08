import useAuth from "@/hooks/useAuth";
import { useLocation, Navigate, Outlet } from "react-router-dom";

export default function RequireAuth() {
  const { auth } = useAuth();
  const location = useLocation();
  return !auth ? (
    <Navigate to="/login" state={{ from: location }} replace />
  ) : (
    <Outlet />
  );
}
