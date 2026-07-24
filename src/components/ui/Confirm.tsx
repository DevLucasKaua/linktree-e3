"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface ConfirmOptions {
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

const ConfirmContext = createContext<
  ((options: ConfirmOptions) => Promise<boolean>) | null
>(null);

/** Diálogo de confirmação com API de promise (substitui os confirm() nativos). */
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<((ok: boolean) => void) | null>(null);

  const confirm = useCallback((next: ConfirmOptions) => {
    setOptions(next);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  function close(ok: boolean) {
    setOptions(null);
    resolver.current?.(ok);
    resolver.current = null;
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {options && (
        <Modal
          title={options.title}
          onClose={() => close(false)}
          footer={
            <>
              <Button onClick={() => close(false)}>
                {options.cancelLabel ?? "Cancelar"}
              </Button>
              <Button
                variant={options.danger ? "danger" : "primary"}
                onClick={() => close(true)}
              >
                {options.confirmLabel ?? "Confirmar"}
              </Button>
            </>
          }
        >
          <div className="whitespace-pre-line text-sm text-soft">
            {options.message}
          </div>
        </Modal>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error("useConfirm deve ser usado dentro de <ConfirmProvider>");
  }
  return ctx;
}
