import type { Palette } from "@/templates/types";

/** CSS do template Neon — botões sólidos na cor primária, clima noturno. */
export function css(p: Palette): string {
  return `
*{box-sizing:border-box;margin:0;padding:0}
body{background:linear-gradient(170deg, ${p.bg}, color-mix(in srgb, ${p.primary} 30%, ${p.bg}));min-height:100vh;display:flex;justify-content:center;font-family:system-ui,-apple-system,sans-serif}
.pagina{max-width:420px;width:100%;margin:0 auto;padding:2.5rem 1.25rem;display:flex;flex-direction:column;align-items:center;gap:1rem}
.cabecalho{display:flex;flex-direction:column;align-items:center;gap:.55rem;margin-bottom:.5rem}
.foto{width:90px;height:90px;border-radius:50%;border:3px solid ${p.primary};background:color-mix(in srgb, ${p.primary} 25%, transparent);display:flex;align-items:center;justify-content:center;overflow:hidden;box-shadow:0 0 26px color-mix(in srgb, ${p.primary} 55%, transparent)}
.foto img{width:100%;height:100%;object-fit:cover}
.foto-iniciais{color:${p.text};font-size:30px;font-weight:800}
.nome{color:${p.text};font-size:21px;font-weight:800;text-align:center;text-shadow:0 1px 10px rgba(0,0,0,.5)}
.bio{color:${p.muted};font-size:13.5px;text-align:center;line-height:1.5;max-width:300px;text-shadow:0 1px 8px rgba(0,0,0,.45)}
.redes{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;margin-top:.2rem}
.rede{color:${p.text};font-size:21px;text-decoration:none;text-shadow:0 0 12px color-mix(in srgb, ${p.primary} 60%, transparent);transition:transform .15s}
.rede:hover{transform:scale(1.12)}
.titulo-secao{width:100%;margin-top:.6rem;text-align:center;font-size:15px;font-weight:800;letter-spacing:.4px;color:${p.text};text-shadow:0 1px 8px rgba(0,0,0,.5)}
.botao{position:relative;width:100%;display:flex;align-items:center;justify-content:center;gap:10px;padding:16px 20px;border-radius:12px;background:color-mix(in srgb, ${p.primary} 92%, transparent);color:${p.text};text-decoration:none;box-shadow:0 4px 18px rgba(0,0,0,.3);transition:filter .15s,transform .15s}
.botao:hover{filter:brightness(1.08);transform:translateY(-1px)}
.botao i{font-size:19px}
.botao-texto{display:flex;flex-direction:column;align-items:center}
.botao-rotulo{font-size:15px;font-weight:700}
.botao-desc{font-size:12px;opacity:.8;margin-top:1px}
.botao.destaque{animation:neon-pulso 2.4s ease-in-out infinite}
.selo{position:absolute;top:-8px;right:2px;width:22px;height:22px;border-radius:50%;background:${p.text};display:flex;align-items:center;justify-content:center}
.selo i{font-size:11px;color:${p.primary}}
@keyframes neon-pulso{0%,100%{box-shadow:0 4px 18px rgba(0,0,0,.3)}50%{box-shadow:0 0 24px color-mix(in srgb, ${p.primary} 80%, transparent)}}
.video{position:relative;width:100%;display:block;border-radius:14px;overflow:hidden;border:2px solid color-mix(in srgb, ${p.primary} 70%, transparent);text-decoration:none;box-shadow:0 4px 18px rgba(0,0,0,.35)}
.video-capa{width:100%;display:block;aspect-ratio:16/9;object-fit:cover}
.video-play{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:46px;height:46px;border-radius:50%;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center}
.video-play i{color:#fff;font-size:20px}
.video-rotulo{position:absolute;left:0;right:0;bottom:0;padding:22px 14px 10px;background:linear-gradient(transparent,rgba(0,0,0,.78));color:#fff;font-size:13px;font-weight:700;text-align:center}
.salvar-contato{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:12px;border:1.5px solid ${p.border};color:${p.text};font-size:13px;text-decoration:none;text-shadow:0 1px 8px rgba(0,0,0,.4);transition:background .15s}
.salvar-contato:hover{background:rgba(255,255,255,.1)}
.salvar-contato i{font-size:16px}
.rodape{margin-top:.6rem;font-size:11px;color:${p.muted};text-shadow:0 1px 8px rgba(0,0,0,.4)}
`.trim();
}
