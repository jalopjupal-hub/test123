import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");

  const from = location.state?.from?.pathname || "/settings";

  const handleSubmit = (event) => {
    event.preventDefault();
    // Demo authentication: issue a session token for the provided user.
    login(`session-token-for-${username || "user"}`);
    navigate(from, { replace: true });
  };

  return (
    <div className="login-page">
      <header className="login-header">
        <h1>Log in</h1>
      </header>
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <button type="submit">Log in</button>
      </form>
    </div>
  );
}
