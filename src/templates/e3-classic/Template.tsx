import type { TemplateProps } from "@/templates/types";
import { initials, linkItemHref, youtubeVideoId } from "@/lib/utils";

export function Template({ config, photoSrc, vcardSrc }: TemplateProps) {
  const activeLinks = config.links.filter((link) => link.active);
  const socials = config.socials.filter((social) => social.url.trim());

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
        {socials.length > 0 && (
          <div className="socials">
            {socials.map((social) => (
              <a
                key={social.id}
                className="social-btn"
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
      </div>

      {activeLinks.map((item) => {
        const type = item.type ?? "link";

        if (type === "header") {
          return (
            <div key={item.id} className="section-title">
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
              className="yt-card"
              href={item.url}
              target="_blank"
              rel="noopener"
            >
              <img
                className="yt-thumb"
                src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                alt=""
              />
              <span className="yt-play">
                <i className="ti ti-player-play-filled" />
              </span>
              <span className="yt-label">{item.label}</span>
            </a>
          );
        }

        return (
          <a
            key={item.id}
            className={`link-btn${item.highlight ? " destaque" : ""}`}
            href={linkItemHref(item)}
            target="_blank"
            rel="noopener"
          >
            <div className="icon-wrap">
              <i className={`ti ti-${item.icon}`} />
            </div>
            <div className="btn-text">
              <span className="btn-label">{item.label}</span>
              {item.description && (
                <span className="btn-desc">{item.description}</span>
              )}
            </div>
            <i className="ti ti-arrow-right arrow" />
            {item.highlight && (
              <span className="destaque-badge">
                <i className="ti ti-star-filled" />
              </span>
            )}
          </a>
        );
      })}

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
