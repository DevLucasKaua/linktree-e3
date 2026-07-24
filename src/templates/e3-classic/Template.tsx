import type { TemplateProps } from "@/templates/types";
import { buildUrlWithUtms, initials } from "@/lib/utils";

export function Template({ config, photoSrc, vcardSrc }: TemplateProps) {
  const activeLinks = config.links.filter((link) => link.active);

  return (
    <div className="container">
      <div className="logo-area">
        <div className="logo-circle">
          {photoSrc ? (
            <img src={photoSrc} alt={config.clientName} />
          ) : (
            <span className="logo-initials">{initials(config.clientName)}</span>
          )}
        </div>
        <span className="brand-name">{config.clientName}</span>
        {config.bio && <span className="brand-sub">{config.bio}</span>}
      </div>

      {activeLinks.map((link) => (
        <a
          key={link.id}
          className="link-btn"
          href={buildUrlWithUtms(link.url, link.utm)}
          target="_blank"
          rel="noopener"
        >
          <div className="icon-wrap">
            <i className={`ti ti-${link.icon}`} />
          </div>
          <div className="btn-text">
            <span className="btn-label">{link.label}</span>
            {link.description && (
              <span className="btn-desc">{link.description}</span>
            )}
          </div>
          <i className="ti ti-arrow-right arrow" />
        </a>
      ))}

      {vcardSrc && (
        <a className="save-contact" href={vcardSrc} download="contato.vcf">
          <i className="ti ti-user-plus" />
          Salvar contato
        </a>
      )}

      <div className="divider" />
      <span className="footer">
        {config.clientName} © {new Date().getFullYear()} · feito por E3 Digital
      </span>
    </div>
  );
}
