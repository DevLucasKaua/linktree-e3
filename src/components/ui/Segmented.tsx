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
  responsiveLabels = false,
}: {
  value: T;
  onChange: (next: T) => void;
  options: SegmentedOption<T>[];
  /** true = ocupa toda a largura, opções com flex-1. */
  grow?: boolean;
  /** true = rótulos somem no mobile (ícone-only; o title mantém o nome). */
  responsiveLabels?: boolean;
}) {
  return (
    <div
      className={`glass flex items-center gap-0.5 rounded-full border border-hair bg-seg p-0.5 ${
        grow ? "w-full" : ""
      }`}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          title={option.title}
          onClick={() => onChange(option.value)}
          className={`pressable flex cursor-pointer items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-sm ${
            grow ? "flex-1" : ""
          } ${
            value === option.value
              ? "bg-seg-active font-medium text-seg-ink shadow-seg"
              : "text-muted hover:text-ink"
          }`}
        >
          {option.icon && <i className={`ti ti-${option.icon}`} />}
          {option.label && (
            <span className={responsiveLabels ? "hidden sm:inline" : ""}>
              {option.label}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
