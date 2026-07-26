import type { TemplateProps } from "@/templates/types";
import { initials, linkItemHref, scheduleAttrs, youtubeVideoId } from "@/lib/utils";

/** Template Editorial: papel claro, serifa e botões de recorte irregular. */
export function Template({ config, photoSrc, vcardSrc }: TemplateProps) {
  const activeLinks = config.links.filter((link) => link.active);
  const socials = config.socials.filter((social) => social.url.trim());

  return (
    <main className="pagina">
      <header className="cabecalho">
        <div className="foto">
          {photoSrc ? (
            <img src={photoSrc} alt={config.clientName} />
          ) : (
            <span className="foto-iniciais">{initials(config.clientName)}</span>
          )}
        </div>
        <h1 className="nome">{config.clientName}</h1>
        {config.bio && <p className="bio">{config.bio}</p>}
        {socials.length > 0 && (
          <div className="redes">
            {socials.map((social) => (
              <a
                key={social.id}
                className="rede"
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

      {activeLinks.map((item) => {
        const type = item.type ?? "link";

        if (type === "header") {
          return (
            <div
              key={item.id}
              className="titulo-secao"
              {...scheduleAttrs(item)}
            >
              {item.label}
            </div>
          );
        }

        const videoId = type === "youtube" ? youtubeVideoId(item.url) : null;
        if (videoId) {
          return (
            <a
              key={item.id}
              className="video"
              href={item.url}
              target="_blank"
              rel="noopener"
              {...scheduleAttrs(item)}
            >
              <img
                className="video-capa"
                src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                alt=""
              />
              <span className="video-play">
                <i className="ti ti-player-play-filled" />
              </span>
              <span className="video-rotulo">{item.label}</span>
            </a>
          );
        }

        return (
          <a
            key={item.id}
            className={`recorte${item.highlight ? " destaque" : ""}`}
            href={linkItemHref(item)}
            target="_blank"
            rel="noopener"
            {...scheduleAttrs(item)}
          >
            <i className={`ti ti-${item.icon}`} />
            <span className="recorte-texto">
              <span className="recorte-rotulo">{item.label}</span>
              {item.description && (
                <span className="recorte-desc">{item.description}</span>
              )}
            </span>
            {item.highlight && (
              <span className="selo">
                <i className="ti ti-star-filled" />
              </span>
            )}
          </a>
        );
      })}

      {vcardSrc && (
        <a className="salvar-contato" href={vcardSrc} download="contato.vcf">
          <i className="ti ti-user-plus" />
          Salvar contato
        </a>
      )}

      <div className="divisor" />
      <footer className="rodape">
        {config.clientName} © {new Date().getFullYear()} · feito por E3 Digital
      </footer>
    </main>
  );
}
