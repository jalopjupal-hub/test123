import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./SettingsPage.css";

export default function SettingsPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="settings-page">
      <header className="settings-header">
        <h1>Settings</h1>
        <button
          type="button"
          className="settings-header__logout"
          onClick={handleLogout}
        >
          Log out
        </button>
      </header>
    </div>
  );
}
