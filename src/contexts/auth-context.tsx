import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { saveUsername, loadUsername, clearUsername } from "../modules/quiz/utils/storage";
import { clearQuizSession } from "../modules/quiz/utils/storage";

interface AuthContextType {
  username: string | null;
  isAuthenticated: boolean;
  login: (username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(() => loadUsername());

  const login = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    saveUsername(trimmed);
    setUsername(trimmed);
  }, []);

  const logout = useCallback(() => {
    clearUsername();
    clearQuizSession();
    setUsername(null);
  }, []);

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === "quizdot_user") {
        setUsername(e.newValue);
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        username,
        isAuthenticated: !!username,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
