import type { ReactNode } from "react";

/** Card de seção do editor: surface + hairline, título único `text-lg font-semibold`. */
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
  return (
    <section
      className={`rounded-xl border border-hair bg-surface p-5 ${className}`}
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
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
