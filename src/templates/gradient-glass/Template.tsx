import type { TemplateProps } from "@/templates/types";
import { initials, linkItemHref, scheduleAttrs, youtubeVideoId } from "@/lib/utils";

/** Template Gradiente: fundo em gradiente escuro com cartões de vidro (glassmorphism). */
export function Template({ config, photoSrc, vcardSrc }: TemplateProps) {
  const activeLinks = config.links.filter((link) => link.active);
  const socials = config.socials.filter((social) => social.url.trim());

  return (
    <main className="glass-page">
      {/* Cabeçalho: foto com anel em gradiente, nome, bio e redes */}
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
        {socials.length > 0 && (
          <div className="glass-socials">
            {socials.map((social) => (
              <a
                key={social.id}
                className="glass-social"
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

      {/* Blocos ativos como cartões translúcidos */}
      <nav className="glass-links">
        {activeLinks.map((item) => {
          const type = item.type ?? "link";

          if (type === "header") {
            return (
              <div
                key={item.id}
                className="glass-section"
                {...scheduleAttrs(item)}
              >
                {item.label}
              </div>
            );
          }

          // Vídeo com URL reconhecida vira cartão com thumbnail; senão cai no cartão padrão.
          const videoId = type === "youtube" ? youtubeVideoId(item.url) : null;
          if (videoId) {
            return (
              <a
                key={item.id}
                className="glass-video"
                href={item.url}
                target="_blank"
                rel="noopener"
                {...scheduleAttrs(item)}
              >
                <img
                  className="glass-video-thumb"
                  src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                  alt=""
                />
                <span className="glass-video-play">
                  <i className="ti ti-player-play-filled" />
                </span>
                <span className="glass-video-label">{item.label}</span>
              </a>
            );
          }

          return (
            <a
              key={item.id}
              className={`glass-card${item.highlight ? " highlight" : ""}`}
              href={linkItemHref(item)}
              target="_blank"
              rel="noopener"
              {...scheduleAttrs(item)}
            >
              <span className="card-icon">
                <i className={`ti ti-${item.icon}`} />
              </span>
              <span className="card-text">
                <span className="card-label">{item.label}</span>
                {item.description && (
                  <span className="card-desc">{item.description}</span>
                )}
              </span>
              <i className="ti ti-chevron-right card-arrow" />
              {item.highlight && (
                <span className="highlight-badge">
                  <i className="ti ti-star-filled" />
                </span>
              )}
            </a>
          );
        })}
      </nav>

      {/* Botão de download do vCard */}
      {vcardSrc && (
        <a className="glass-contact" href={vcardSrc} download="contato.vcf">
          <i className="ti ti-user-plus" />
          Salvar contato
        </a>
      )}

      <div className="glass-divider" />
      <footer className="glass-footer">
        {config.clientName} © {new Date().getFullYear()} · feito por E3 Digital
      </footer>
    </main>
  );
}
