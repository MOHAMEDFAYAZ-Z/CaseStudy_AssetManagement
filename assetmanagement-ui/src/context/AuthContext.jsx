import { createContext, useContext, useState } from "react";
import { clearAuth, getRole, getToken, getName } from "../utils/helpers";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getToken());
  const [role, setRole] = useState(getRole());
  const [name, setName] = useState(getName());

  function login(data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("name", data.name);
    localStorage.setItem("userId", data.userId);
    setToken(data.token);
    setRole(data.role);
    setName(data.name);
  }

  function logout() {
    clearAuth();
    setToken(null);
    setRole(null);
    setName(null);
  }

  return (
    <AuthContext.Provider value={{ token, role, name, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}