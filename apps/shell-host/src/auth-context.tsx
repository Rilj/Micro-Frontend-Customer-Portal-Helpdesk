import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@mf-enterprise/event-bus";
import { authApi } from "./services/auth";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, name: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  isAuthenticated: false,
  login: async () => Promise.reject(),
  register: async () => Promise.reject(),
  logout: () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("access_token");
      if (storedToken) {
        setToken(storedToken);
        try {
          const currentUser = await authApi.me(storedToken);
          setUser(currentUser);
          setIsAuthenticated(true);
        } catch {
          localStorage.removeItem("access_token");
          setToken(null);
          setIsAuthenticated(false);
        }
      }
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const { user: loggedUser, token: jwt } = await authApi.login(email, password);
    localStorage.setItem("access_token", jwt);
    setToken(jwt);
    setUser(loggedUser);
    setIsAuthenticated(true);
    window.dispatchEvent(new CustomEvent("auth:login", { detail: loggedUser }));
    return loggedUser;
  };

  const register = async (email: string, password: string, name: string) => {
    const { user: registeredUser, token: jwt } = await authApi.register(email, password, name);
    localStorage.setItem("access_token", jwt);
    setToken(jwt);
    setUser(registeredUser);
    setIsAuthenticated(true);
    window.dispatchEvent(new CustomEvent("auth:register", { detail: registeredUser }));
    return registeredUser;
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    window.dispatchEvent(new CustomEvent("auth:logout"));
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
