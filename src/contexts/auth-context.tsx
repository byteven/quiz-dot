import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { clearQuizSession } from "../modules/quiz/utils/storage";

interface User {
  username: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);
const TOKEN_KEY = "accessToken";

function decodeJWTPayload(token: string) {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

function createFakeJWT(username: string) {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };
  const payload = {
    sub: "user-1",
    username: username,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  };

  const encodeBase64Url = (obj: any) =>
    window
      .btoa(JSON.stringify(obj))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

  const fakeSignature = "vS5M-abc123DEF456ghi789jkl012mno345pqr678stu9";

  return `${encodeBase64Url(header)}.${encodeBase64Url(payload)}.${fakeSignature}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const token = sessionStorage.getItem(TOKEN_KEY);
      if (token) {
        const payload = decodeJWTPayload(token);
        if (payload && payload.exp * 1000 > Date.now()) {
          return { username: payload.username };
        } else {
          sessionStorage.removeItem(TOKEN_KEY);
        }
      }
    } catch {
      // e
    }
    return null;
  });

  const login = useCallback(async (username: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (username !== "viosalman" || password !== "Password123@") {
      throw new Error("Invalid username or password");
    }

    const token = createFakeJWT(username);
    sessionStorage.setItem(TOKEN_KEY, token);
    setUser({ username });
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    clearQuizSession();
    setUser(null);
  }, []);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      const token = sessionStorage.getItem(TOKEN_KEY);
      if (token) {
        const payload = decodeJWTPayload(token);
        if (!payload || payload.exp * 1000 <= Date.now()) {
          logout();
        }
      } else {
        logout();
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [user, logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
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
