import type { TemplateProps } from "@/templates/types";
import { buildUrlWithUtms, initials } from "@/lib/utils";

/** Template Jurídico Serif: claro e formal, serifa com detalhes dourados. */
export function Template({ config, photoSrc, vcardSrc }: TemplateProps) {
  const activeLinks = config.links.filter((link) => link.active);

  return (
    <main className="pagina">
      {/* Cabeçalho: foto, nome e bio */}
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
        <span className="filete" aria-hidden="true" />
      </header>

      {/* Lista de links ativos */}
      <nav className="lista-links">
        {activeLinks.map((link) => (
          <a
            key={link.id}
            className="cartao-link"
            href={buildUrlWithUtms(link.url, link.utm)}
            target="_blank"
            rel="noopener"
          >
            <span className="cartao-icone">
              <i className={`ti ti-${link.icon}`} />
            </span>
            <span className="cartao-texto">
              <span className="cartao-titulo">{link.label}</span>
              {link.description && (
                <span className="cartao-descricao">{link.description}</span>
              )}
            </span>
            <i className="ti ti-chevron-right cartao-seta" />
          </a>
        ))}
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
