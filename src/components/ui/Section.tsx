"use client";

import { createContext, useContext, type ReactNode } from "react";

/**
 * Quando true (abas do editor), Section renderiza sem o card externo e sem
 * o título — a aba já rotula o conteúdo. Zero mudança nas seções em si.
 */
export const SectionBareContext = createContext(false);

/** Card de seção: glass 20px, título 17px; ou conteúdo "bare" dentro de abas. */
export function Section({
  title,
  description,
  action,
  children,
  className = "",
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const bare = useContext(SectionBareContext);

  if (bare) {
    return (
      <div className={className}>
        {(description || action) && (
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            {description ? (
              <p className="min-w-0 text-sm text-muted">{description}</p>
            ) : (
              <span />
            )}
            {action}
          </div>
        )}
        {children}
      </div>
    );
  }

  return (
    <section
      className={`glass rounded-[20px] border border-hair bg-surface p-5 ${className}`}
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[17px] font-semibold tracking-tight">{title}</h2>
          {description && (
            <p className="mt-0.5 text-sm text-muted">{description}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
