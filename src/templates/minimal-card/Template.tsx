import type { TemplateProps } from "@/templates/types";
import { buildUrlWithUtms, initials } from "@/lib/utils";

/** Template Minimal: card branco central sobre fundo neutro, botões sólidos. */
export function Template({ config, photoSrc, vcardSrc }: TemplateProps) {
  const activeLinks = config.links.filter((link) => link.active);

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
        </header>

        {/* Botões sólidos dos links ativos */}
        <nav className="botoes">
          {activeLinks.map((link) => (
            <a
              key={link.id}
              className="botao"
              href={buildUrlWithUtms(link.url, link.utm)}
              target="_blank"
              rel="noopener"
            >
              <i className={`ti ti-${link.icon} botao-icone`} />
              <span className="botao-texto">
                <span className="botao-rotulo">{link.label}</span>
                {link.description && (
                  <span className="botao-detalhe">{link.description}</span>
                )}
              </span>
            </a>
          ))}
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
