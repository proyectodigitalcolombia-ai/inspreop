import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { login, logout, getCurrentUser, type AppUser } from "@/lib/auth";

interface AuthContextValue {
  user: AppUser | null;
  signIn: (username: string, password: string) => boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(() => getCurrentUser());

  const signIn = useCallback((username: string, password: string): boolean => {
    const u = login(username, password);
    if (!u) return false;
    setUser(u);
    return true;
  }, []);

  const signOut = useCallback(() => {
    logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
