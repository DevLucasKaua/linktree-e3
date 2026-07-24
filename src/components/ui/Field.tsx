import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

/** Controle de formulário unificado (um só fundo, hairline, foco no acento). */
export function controlClass(invalid = false): string {
  return `w-full rounded-lg border bg-bg px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-muted ${
    invalid ? "border-neg focus:border-neg" : "border-hair focus:border-accent"
  }`;
}

/** Label assinatura da linguagem: mono, uppercase, 10px, tracking largo. */
export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-soft">
      {children}
    </span>
  );
}

export function Field({
  label,
  error,
  hint,
  children,
}: {
  label: ReactNode;
  error?: string | null;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <FieldLabel>{label}</FieldLabel>
      {children}
      {error ? (
        <span className="text-xs text-neg">{error}</span>
      ) : hint ? (
        <span className="text-xs text-muted">{hint}</span>
      ) : null}
    </label>
  );
}

export function Input({
  invalid,
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return <input className={`${controlClass(invalid)} ${className}`} {...props} />;
}

export function Select({
  invalid,
  className = "",
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }) {
  return (
    <select
      className={`${controlClass(invalid)} cursor-pointer ${className}`}
      {...props}
    />
  );
}

export function Textarea({
  invalid,
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return (
    <textarea
      className={`${controlClass(invalid)} resize-none ${className}`}
      {...props}
    />
  );
}
