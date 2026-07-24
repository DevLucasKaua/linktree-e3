"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ToastKind = "ok" | "err";

interface ToastState {
  id: number;
  message: string;
  kind: ToastKind;
}

const ToastContext = createContext<
  ((message: string, kind?: ToastKind) => void) | null
>(null);

/** Toast único bottom-center (substitui os alert() nativos). */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((message: string, kind: ToastKind = "ok") => {
    setToast({ id: Date.now(), message, kind });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 3500);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      {toast && (
        <div
          key={toast.id}
          role="status"
          className="fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 animate-toast-in items-center gap-2.5 rounded-xl bg-ink px-5 py-3 text-sm text-bg shadow-big"
        >
          {/* Cores fixas: o fundo do toast é sempre "ink", independe do tema */}
          <i
            className={`ti ${
              toast.kind === "ok"
                ? "ti-circle-check text-[#8fd06a]"
                : "ti-alert-circle text-[#ff7a70]"
            }`}
          />
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast deve ser usado dentro de <ToastProvider>");
  return ctx;
}
