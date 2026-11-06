import React, { createContext, useContext, useState, useEffect } from "react";
import type { User, UserRole } from "../types";
import { authApi } from "../services/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  registerApplicant: (data: any) => Promise<User>;
  registerRecruiter: (data: any) => Promise<User>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  isAuthenticated: boolean;
  isRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("hirenest_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("hirenest_token");
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("hirenest_token");
      if (storedToken) {
        try {
          const profile = await authApi.getMe();
          setUser(profile);
          localStorage.setItem("hirenest_user", JSON.stringify(profile));
        } catch (error) {
          console.error("Token verification failed:", error);
          localStorage.removeItem("hirenest_token");
          localStorage.removeItem("hirenest_user");
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await authApi.login(email, password);
    const { access_token, user: loggedInUser } = res;
    localStorage.setItem("hirenest_token", access_token);
    localStorage.setItem("hirenest_user", JSON.stringify(loggedInUser));
    setToken(access_token);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const registerApplicant = async (data: any): Promise<User> => {
    const res = await authApi.registerApplicant(data);
    const { access_token, user: newUser } = res;
    localStorage.setItem("hirenest_token", access_token);
    localStorage.setItem("hirenest_user", JSON.stringify(newUser));
    setToken(access_token);
    setUser(newUser);
    return newUser;
  };

  const registerRecruiter = async (data: any): Promise<User> => {
    const res = await authApi.registerRecruiter(data);
    const { access_token, user: newUser } = res;
    localStorage.setItem("hirenest_token", access_token);
    localStorage.setItem("hirenest_user", JSON.stringify(newUser));
    setToken(access_token);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem("hirenest_token");
    localStorage.removeItem("hirenest_user");
    setToken(null);
    setUser(null);
  };

  const updateUser = (updated: User) => {
    setUser(updated);
    localStorage.setItem("hirenest_user", JSON.stringify(updated));
  };

  const isRole = (role: UserRole) => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        registerApplicant,
        registerRecruiter,
        logout,
        updateUser,
        isAuthenticated: !!token && !!user,
        isRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
