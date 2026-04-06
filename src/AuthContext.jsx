import { createContext, useContext, useState, useEffect } from "react";
import { auth, users, setTokens, clearTokens, getRefreshToken } from "./api";

const AuthContext = createContext(null);

const BASE_URL = import.meta.env.VITE_API_URL || "https://backend-tut-production.up.railway.app/api/v1";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restore() {
      const rt = getRefreshToken();
      if (!rt) { setLoading(false); return; }

      // Step 1: Refresh the access token.
      // Only clear tokens if THIS fails — means session is truly expired.
      try {
        const res = await fetch(`${BASE_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: rt }),
        });
        if (!res.ok) {
          clearTokens();
          setLoading(false);
          return;
        }
        const data = await res.json();
        setTokens(data.access_token, data.refresh_token);
      } catch {
        clearTokens();
        setLoading(false);
        return;
      }

      // Step 2: Fetch user profile.
      // Do NOT clear tokens here — a failure means server is busy (cold start,
      // transient 5xx), not that the session is invalid. Retry once before giving up.
      try {
        const me = await users.me();
        setUser(me);
      } catch {
        await new Promise((r) => setTimeout(r, 1500));
        try {
          const me = await users.me();
          setUser(me);
        } catch {
          // Still failed — tokens remain valid in memory.
          // Portal will re-fetch on mount; user is not force-logged-out.
        }
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
