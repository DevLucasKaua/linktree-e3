"use client";

export interface SegmentedOption<T extends string> {
  value: T;
  label?: string;
  /** Nome do ícone Tabler sem o prefixo. */
  icon?: string;
  title?: string;
}

/** Controle segmentado (tabs/toggles) no estilo `.seg` da referência. */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  grow = false,
}: {
  value: T;
  onChange: (next: T) => void;
  options: SegmentedOption<T>[];
  /** true = ocupa toda a largura, opções com flex-1. */
  grow?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-0.5 rounded-[9px] bg-seg p-0.5 ${
        grow ? "w-full" : ""
      }`}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          title={option.title}
          onClick={() => onChange(option.value)}
          className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-[7px] px-2.5 py-1.5 text-sm transition-colors ${
            grow ? "flex-1" : ""
          } ${
            value === option.value
              ? "bg-surface text-ink shadow-seg"
              : "text-muted hover:text-ink"
          }`}
        >
          {option.icon && <i className={`ti ti-${option.icon}`} />}
          {option.label}
        </button>
      ))}
    </div>
  );
}
