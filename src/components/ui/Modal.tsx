"use client";

import { useEffect, type ReactNode } from "react";

/** Modal padrão: overlay com fade, caixa com pop; fecha por overlay ou Escape. */
export function Modal({
  title,
  subtitle,
  onClose,
  children,
  footer,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal
      className="fixed inset-0 z-50 flex animate-fade-in items-start justify-center bg-black/45 p-5 pt-[10vh]"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md animate-menu-in rounded-2xl border border-hair bg-surface p-6 shadow-big"
      >
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
        <div className="mt-4">{children}</div>
        {footer && (
          <div className="mt-5 flex justify-end gap-2.5 border-t border-hair pt-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
