import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

// Guards protected routes: if there is no active session, redirect to /login
// and remember where the user was heading so they can return after signing in.
export default function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
