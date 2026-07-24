import type { TemplateProps } from "@/templates/types";
import { initials, linkItemHref, youtubeVideoId } from "@/lib/utils";

/** Template Jurídico Serif: claro e formal, serifa com detalhes dourados. */
export function Template({ config, photoSrc, vcardSrc }: TemplateProps) {
  const activeLinks = config.links.filter((link) => link.active);
  const socials = config.socials.filter((social) => social.url.trim());

  return (
    <main className="pagina">
      {/* Cabeçalho: foto, nome, bio e redes sociais */}
      <header className="cabecalho">
        <div className="retrato">
          {photoSrc ? (
            <img src={photoSrc} alt={config.clientName} />
          ) : (
            <span className="retrato-iniciais">
              {initials(config.clientName)}
            </span>
          )}
        </div>
        <h1 className="nome">{config.clientName}</h1>
        {config.bio && <p className="bio">{config.bio}</p>}
        {socials.length > 0 && (
          <div className="redes">
            {socials.map((social) => (
              <a
                key={social.id}
                className="rede-icone"
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
        <span className="filete" aria-hidden="true" />
      </header>

      {/* Lista de blocos ativos */}
      <nav className="lista-links">
        {activeLinks.map((item) => {
          const type = item.type ?? "link";

          if (type === "header") {
            return (
              <div key={item.id} className="titulo-secao">
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
                className="cartao-video"
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
                <span className="video-titulo">{item.label}</span>
              </a>
            );
          }

          return (
            <a
              key={item.id}
              className={`cartao-link${item.highlight ? " destaque" : ""}`}
              href={linkItemHref(item)}
              target="_blank"
              rel="noopener"
            >
              <span className="cartao-icone">
                <i className={`ti ti-${item.icon}`} />
              </span>
              <span className="cartao-texto">
                <span className="cartao-titulo">{item.label}</span>
                {item.description && (
                  <span className="cartao-descricao">{item.description}</span>
                )}
              </span>
              <i className="ti ti-chevron-right cartao-seta" />
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
        <a className="salvar-contato" href={vcardSrc} download="contato.vcf">
          <i className="ti ti-user-plus" />
          Salvar contato
        </a>
      )}

      {/* Rodapé */}
      <div className="divisor" />
      <footer className="rodape">
        {config.clientName} © {new Date().getFullYear()} · feito por E3 Digital
      </footer>
    </main>
  );
}
