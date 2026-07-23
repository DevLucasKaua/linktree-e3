import type { TemplateProps } from "@/templates/types";
import { buildUrlWithUtms, initials } from "@/lib/utils";

/** Template Executivo: navy profundo, detalhes dourados e foto quadrada em moldura. */
export function Template({ config, photoSrc }: TemplateProps) {
  const activeLinks = config.links.filter((link) => link.active);

  return (
    <main className="exec-page">
      {/* Cabeçalho: retrato quadrado emoldurado, nome em caps e linha dourada */}
      <header className="exec-header">
        <div className="portrait-frame">
          <div className="portrait">
            {photoSrc ? (
              <img src={photoSrc} alt={config.clientName} />
            ) : (
              <span className="portrait-initials">
                {initials(config.clientName)}
              </span>
            )}
          </div>
        </div>
        <h1 className="exec-name">{config.clientName}</h1>
        <span className="gold-rule" />
        {config.bio && <p className="exec-bio">{config.bio}</p>}
      </header>

      {/* Lista de links ativos com filete dourado à esquerda */}
      <nav className="exec-links">
        {activeLinks.map((link) => (
          <a
            key={link.id}
            className="exec-btn"
            href={buildUrlWithUtms(link.url, link.utm)}
            target="_blank"
            rel="noopener"
          >
            <span className="exec-icon">
              <i className={`ti ti-${link.icon}`} />
            </span>
            <span className="exec-text">
              <span className="exec-label">{link.label}</span>
              {link.description && (
                <span className="exec-desc">{link.description}</span>
              )}
            </span>
            <i className="ti ti-arrow-narrow-right exec-arrow" />
          </a>
        ))}
      </nav>

      <div className="exec-divider" />
      <footer className="exec-footer">
        {config.clientName} © {new Date().getFullYear()} · feito por E3 Digital
      </footer>
    </main>
  );
}
