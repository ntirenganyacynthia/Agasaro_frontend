"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api, clearToken, getToken, setToken } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCurrentUser() {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const me = await api.get("/auth/me", true);
        setUser(me);
      } catch {
        clearToken();
      } finally {
        setLoading(false);
      }
    }
    loadCurrentUser();
  }, []);

  async function login(username, password) {
    const result = await api.post("/auth/login", { username, password });
    if (result.mfa_required) {
      return { mfaRequired: true };
    }
    setToken(result.access_token);
    const me = await api.get("/auth/me", true);
    setUser(me);
    return { mfaRequired: false };
  }

  async function verifyMfa(username, password, code) {
    const result = await api.post("/auth/mfa/verify", { username, password, code });
    setToken(result.access_token);
    const me = await api.get("/auth/me", true);
    setUser(me);
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  const value = { user, loading, login, verifyMfa, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
