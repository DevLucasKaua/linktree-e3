"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getDb, getFirebaseAuth, googleProvider } from "@/lib/firebase";

export type ManagerRole = "admin" | "gestor";

interface AuthContextValue {
  /** Usuário logado E presente na allowlist de gestores; null caso contrário. */
  user: User | null;
  /** Papel do gestor: "admin" vê/edita tudo (campo role no doc managers/{email}). */
  role: ManagerRole;
  /** true enquanto o estado inicial de auth ainda não foi resolvido. */
  loading: boolean;
  /** Mensagem de erro de login (ex: e-mail fora da allowlist). */
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** null = fora da allowlist; senão o papel (role "admin" definido só pelo console). */
async function getManagerRole(
  email: string | null
): Promise<ManagerRole | null> {
  if (!email) return null;
  const snap = await getDoc(doc(getDb(), "managers", email.toLowerCase()));
  if (!snap.exists()) return null;
  return snap.data().role === "admin" ? "admin" : "gestor";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<ManagerRole>("gestor");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const managerRole = await getManagerRole(firebaseUser.email);
        if (managerRole) {
          setError(null);
          setRole(managerRole);
          setUser(firebaseUser);
        } else {
          // Conta Google válida, mas fora da allowlist: desloga na hora.
          await firebaseSignOut(getFirebaseAuth());
          setUser(null);
          setError(
            "Acesso restrito a gestores E3. Sua conta não está autorizada."
          );
        }
      } catch {
        // Ex: security rules não publicadas ou sem rede.
        await firebaseSignOut(getFirebaseAuth());
        setUser(null);
        setError(
          "Não foi possível verificar suas permissões. Confira se as security rules foram publicadas no console Firebase."
        );
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function signInWithGoogle() {
    setError(null);
    try {
      await signInWithPopup(getFirebaseAuth(), googleProvider);
    } catch (err) {
      const code = (err as { code?: string }).code ?? "";
      if (code === "auth/popup-blocked") {
        await signInWithRedirect(getFirebaseAuth(), googleProvider);
        return;
      }
      if (code !== "auth/popup-closed-by-user") {
        setError("Não foi possível entrar. Tente novamente.");
      }
    }
  }

  async function signOut() {
    await firebaseSignOut(getFirebaseAuth());
  }

  return (
    <AuthContext.Provider
      value={{ user, role, loading, error, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
}
