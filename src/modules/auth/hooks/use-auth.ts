import { useContext } from "react";
import { AuthContext } from "@/modules/auth/contexts/auth-context";
import type { AuthContextType } from "@/modules/auth/types/auth";

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
