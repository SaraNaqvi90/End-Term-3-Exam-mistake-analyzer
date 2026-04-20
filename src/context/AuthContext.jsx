import { createContext, useEffect, useState } from "react";
import {
  loginUser,
  logoutUser,
  onUserChanged,
  signupUser,
} from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onUserChanged((user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  async function signup(name, email, password) {
    await signupUser(name, email, password);
  }

  async function login(email, password) {
    await loginUser(email, password);
  }

  async function logout() {
    await logoutUser();
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        authLoading,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
