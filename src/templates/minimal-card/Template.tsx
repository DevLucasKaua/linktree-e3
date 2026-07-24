import type { TemplateProps } from "@/templates/types";
import { initials, linkItemHref, youtubeVideoId } from "@/lib/utils";

/** Template Minimal: card branco central sobre fundo neutro, botões sólidos. */
export function Template({ config, photoSrc, vcardSrc }: TemplateProps) {
  const activeLinks = config.links.filter((link) => link.active);
  const socials = config.socials.filter((social) => social.url.trim());

  return (
    <main className="moldura">
      {/* Todo o conteúdo fica dentro do card central */}
      <section className="card">
        <header className="perfil">
          <div className="avatar">
            {photoSrc ? (
              <img src={photoSrc} alt={config.clientName} />
            ) : (
              <span className="avatar-iniciais">
                {initials(config.clientName)}
              </span>
            )}
          </div>
          <h1 className="titulo">{config.clientName}</h1>
          {config.bio && <p className="subtitulo">{config.bio}</p>}
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

        {/* Blocos ativos */}
        <nav className="botoes">
          {activeLinks.map((item) => {
            const type = item.type ?? "link";

            if (type === "header") {
              return (
                <div key={item.id} className="secao-titulo">
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
                  className="video"
                  href={item.url}
                  target="_blank"
                  rel="noopener"
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
                className={`botao${item.highlight ? " destaque" : ""}`}
                href={linkItemHref(item)}
                target="_blank"
                rel="noopener"
              >
                <i className={`ti ti-${item.icon} botao-icone`} />
                <span className="botao-texto">
                  <span className="botao-rotulo">{item.label}</span>
                  {item.description && (
                    <span className="botao-detalhe">{item.description}</span>
                  )}
                </span>
                {item.highlight && (
                  <span className="selo-destaque">
                    <i className="ti ti-star-filled" />
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Botão de download do vCard */}
        {vcardSrc && (
          <a className="botao-contato" href={vcardSrc} download="contato.vcf">
            <i className="ti ti-user-plus" />
            Salvar contato
          </a>
        )}

        {/* Rodapé */}
        <div className="linha" />
        <footer className="assinatura">
          {config.clientName} © {new Date().getFullYear()} · feito por E3
          Digital
        </footer>
      </section>
    </main>
  );
}
