import type { TemplateProps } from "@/templates/types";
import { initials, linkItemHref, scheduleAttrs, youtubeVideoId } from "@/lib/utils";

/** Template Executivo: navy profundo, detalhes dourados e foto quadrada em moldura. */
export function Template({ config, photoSrc, vcardSrc }: TemplateProps) {
  const activeLinks = config.links.filter((link) => link.active);
  const socials = config.socials.filter((social) => social.url.trim());

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
        {socials.length > 0 && (
          <div className="exec-socials">
            {socials.map((social) => (
              <a
                key={social.id}
                className="exec-social"
                href={social.url}
                target="_blank"
                rel="noopener"
                aria-label={social.icon.replace("brand-", "")}
              >
                <i className={`ti ti-${social.icon}`} />
              </a>
            ))}
          </div>
        )}
      </header>

      {/* Blocos ativos com filete dourado à esquerda */}
      <nav className="exec-links">
        {activeLinks.map((item) => {
          const type = item.type ?? "link";

          if (type === "header") {
            return (
              <div
                key={item.id}
                className="exec-section"
                {...scheduleAttrs(item)}
              >
                {item.label}
              </div>
            );
          }

          // Vídeo com URL reconhecida vira cartão com thumbnail; senão cai no botão padrão.
          const videoId = type === "youtube" ? youtubeVideoId(item.url) : null;
          if (videoId) {
            return (
              <a
                key={item.id}
                className="exec-video"
                href={item.url}
                target="_blank"
                rel="noopener"
                {...scheduleAttrs(item)}
              >
                <img
                  className="exec-video-thumb"
                  src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                  alt=""
                />
                <span className="exec-video-play">
                  <i className="ti ti-player-play-filled" />
                </span>
                <span className="exec-video-label">{item.label}</span>
              </a>
            );
          }

          return (
            <a
              key={item.id}
              className={`exec-btn${item.highlight ? " highlight" : ""}`}
              href={linkItemHref(item)}
              target="_blank"
              rel="noopener"
              {...scheduleAttrs(item)}
            >
              <span className="exec-icon">
                <i className={`ti ti-${item.icon}`} />
              </span>
              <span className="exec-text">
                <span className="exec-label">{item.label}</span>
                {item.description && (
                  <span className="exec-desc">{item.description}</span>
                )}
              </span>
              <i className="ti ti-arrow-narrow-right exec-arrow" />
              {item.highlight && (
                <span className="exec-badge">
                  <i className="ti ti-star-filled" />
                </span>
              )}
            </a>
          );
        })}
      </nav>

      {/* Botão de download do vCard */}
      {vcardSrc && (
        <a className="exec-contact" href={vcardSrc} download="contato.vcf">
          <i className="ti ti-user-plus" />
          Salvar contato
        </a>
      )}

      <div className="exec-divider" />
      <footer className="exec-footer">
        {config.clientName} © {new Date().getFullYear()} · feito por E3 Digital
      </footer>
    </main>
  );
}
