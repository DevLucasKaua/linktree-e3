import type { TemplateProps } from "@/templates/types";
import { buildUrlWithUtms, initials } from "@/lib/utils";

/** Template Gradiente: fundo em gradiente escuro com cartões de vidro (glassmorphism). */
export function Template({ config, photoSrc }: TemplateProps) {
  const activeLinks = config.links.filter((link) => link.active);

  return (
    <main className="glass-page">
      {/* Cabeçalho: foto com anel em gradiente, nome e bio */}
      <header className="glass-header">
        <div className="avatar-ring">
          <div className="avatar">
            {photoSrc ? (
              <img src={photoSrc} alt={config.clientName} />
            ) : (
              <span className="avatar-initials">
                {initials(config.clientName)}
              </span>
            )}
          </div>
        </div>
        <h1 className="client-name">{config.clientName}</h1>
        {config.bio && <p className="client-bio">{config.bio}</p>}
      </header>

      {/* Lista de links ativos como cartões translúcidos */}
      <nav className="glass-links">
        {activeLinks.map((link) => (
          <a
            key={link.id}
            className="glass-card"
            href={buildUrlWithUtms(link.url, link.utm)}
            target="_blank"
            rel="noopener"
          >
            <span className="card-icon">
              <i className={`ti ti-${link.icon}`} />
            </span>
            <span className="card-text">
              <span className="card-label">{link.label}</span>
              {link.description && (
                <span className="card-desc">{link.description}</span>
              )}
            </span>
            <i className="ti ti-chevron-right card-arrow" />
          </a>
        ))}
      </nav>

      <div className="glass-divider" />
      <footer className="glass-footer">
        {config.clientName} © {new Date().getFullYear()} · feito por E3 Digital
      </footer>
    </main>
  );
}
