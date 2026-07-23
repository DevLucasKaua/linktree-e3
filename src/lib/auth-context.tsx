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

interface AuthContextValue {
  /** Usuário logado E presente na allowlist de gestores; null caso contrário. */
  user: User | null;
  /** true enquanto o estado inicial de auth ainda não foi resolvido. */
  loading: boolean;
  /** Mensagem de erro de login (ex: e-mail fora da allowlist). */
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function isManager(email: string | null): Promise<boolean> {
  if (!email) return false;
  const snap = await getDoc(doc(getDb(), "managers", email.toLowerCase()));
  return snap.exists();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
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
        if (await isManager(firebaseUser.email)) {
          setError(null);
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
      value={{ user, loading, error, signInWithGoogle, signOut }}
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
