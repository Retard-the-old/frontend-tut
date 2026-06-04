import { createContext, useContext, useState, useEffect } from "react";
import { auth, users, setTokens, clearTokens, getRefreshToken, refreshAccessToken } from "./api";

const AuthContext = createContext(null);

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
        await refreshAccessToken();
      } catch (err) {
        if (err && err.sessionExpired) clearTokens();
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

  function updateUser(userData) {
    setUser(userData);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
