import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { logoutRequest } from "./api";

const STORAGE_KEY = "authToken";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY));

  const login = useCallback((newToken) => {
    localStorage.setItem(STORAGE_KEY, newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(async () => {
    // Attempt to invalidate the session server-side, but always clear the
    // client-side session so the user is logged out on this device even if the
    // network request fails.
    try {
      await logoutRequest(token);
    } catch {
      // Ignore network/server errors: the local session is cleared below.
    } finally {
      localStorage.removeItem(STORAGE_KEY);
      setToken(null);
    }
  }, [token]);

  const value = useMemo(
    () => ({ token, isAuthenticated: Boolean(token), login, logout }),
    [token, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
