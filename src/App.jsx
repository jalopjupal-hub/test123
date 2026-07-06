import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import RequireAuth from "./RequireAuth";
import LoginPage from "./LoginPage";
import SettingsPage from "./SettingsPage";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/settings"
          element={
            <RequireAuth>
              <SettingsPage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/settings" replace />} />
      </Routes>
    </AuthProvider>
  );
}
