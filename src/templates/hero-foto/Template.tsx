import type { TemplateProps } from "@/templates/types";
import { initials, linkItemHref, scheduleAttrs, youtubeVideoId } from "@/lib/utils";

/** Template Hero: foto do cliente em destaque no topo, nome sobreposto. */
export function Template({ config, photoSrc, vcardSrc }: TemplateProps) {
  const activeLinks = config.links.filter((link) => link.active);
  const socials = config.socials.filter((social) => social.url.trim());

  return (
    <main className="pagina">
      {/* Hero: foto widescreen fundindo para o fundo */}
      <header className="hero">
        {photoSrc ? (
          <img src={photoSrc} alt={config.clientName} />
        ) : (
          <div className="hero-iniciais">{initials(config.clientName)}</div>
        )}
        <div className="hero-grad" aria-hidden />
        <div className="hero-texto">
          <h1 className="nome">{config.clientName}</h1>
          {config.bio && <p className="bio">{config.bio}</p>}
        </div>
      </header>

      <div className="conteudo">
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
              className={`pill${item.highlight ? " destaque" : ""}`}
              href={linkItemHref(item)}
              target="_blank"
              rel="noopener"
              {...scheduleAttrs(item)}
            >
              <span className="pill-icone">
                <i className={`ti ti-${item.icon}`} />
              </span>
              <span className="pill-texto">
                <span className="pill-rotulo">{item.label}</span>
                {item.description && (
                  <span className="pill-desc">{item.description}</span>
                )}
              </span>
              <i className="ti ti-arrow-up-right pill-seta" />
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

        <footer className="rodape">
          {config.clientName} © {new Date().getFullYear()} · feito por E3
          Digital
        </footer>
      </div>
    </main>
  );
}
