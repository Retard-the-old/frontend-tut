import { createContext, useContext, useState, useEffect } from "react";
import { auth, users, setTokens, clearTokens, getRefreshToken } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, try to restore session from stored refresh token
  useEffect(() => {
    async function restore() {
      const rt = getRefreshToken();
      if (!rt) { setLoading(false); return; }
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || "https://backend-tut-production.up.railway.app/api/v1"}/auth/refresh`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: rt }),
          }
        );
        if (!res.ok) throw new Error("Session expired");
        const data = await res.json();
        setTokens(data.access_token, data.refresh_token);
        const me = await users.me();
        setUser(me);
      } catch {
        clearTokens();
      } finally {
        setLoading(false);
      }
    }
    restore();
  }, []);

  async function login(email, password) {
    const data = await auth.login(email, password);
    setTokens(data.access_token, data.refresh_token);
    const me = await users.me();
    setUser(me);
    return me;
  }

  async function register(full_name, email, password, referral_code, phone) {
    const data = await auth.register(full_name, email, password, referral_code, phone);
    setTokens(data.access_token, data.refresh_token);
    const me = await users.me();
    setUser(me);
    return me;
  }

  function logout() {
    clearTokens();
    setUser(null);
  }

  function refreshUser() {
    return users.me().then(setUser);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
