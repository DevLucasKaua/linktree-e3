import type { Palette } from "@/templates/types";

/** CSS do template Jurídico Serif com a paleta interpolada. */
export function css(p: Palette): string {
  return `
*{box-sizing:border-box;margin:0;padding:0}
body{background:${p.bg};min-height:100vh;display:flex;justify-content:center;font-family:Georgia,'Times New Roman',serif;color:${p.text}}
.pagina{max-width:420px;width:100%;margin:0 auto;padding:2.5rem 1.25rem;display:flex;flex-direction:column;align-items:center;gap:1.5rem}
.cabecalho{display:flex;flex-direction:column;align-items:center;gap:.6rem}
.retrato{width:92px;height:92px;border-radius:50%;background:${p.surface};border:1px solid ${p.border};box-shadow:0 0 0 4px color-mix(in srgb, ${p.border} 18%, transparent);display:flex;align-items:center;justify-content:center;overflow:hidden}
.retrato img{width:100%;height:100%;object-fit:cover}
.retrato-iniciais{color:${p.primary};font-size:30px;font-weight:700;letter-spacing:1px}
.nome{color:${p.primary};font-size:24px;font-weight:800;letter-spacing:.5px;text-align:center;margin-top:.35rem}
.bio{color:${p.muted};font-size:14px;font-style:italic;text-align:center;line-height:1.6;max-width:300px}
.redes{display:flex;gap:.5rem;justify-content:center;flex-wrap:wrap;margin-top:.2rem}
.rede-icone{width:36px;height:36px;border-radius:50%;border:1px solid ${p.border};display:flex;align-items:center;justify-content:center;color:${p.primary};text-decoration:none;transition:background .15s}
.rede-icone:hover{background:color-mix(in srgb, ${p.border} 18%, transparent)}
.rede-icone i{font-size:17px}
.filete{width:56px;height:2px;background:${p.border};margin-top:.4rem}
.lista-links{width:100%;display:flex;flex-direction:column;gap:.85rem}
.titulo-secao{width:100%;margin-top:.6rem;text-align:center;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${p.border}}
.cartao-video{position:relative;width:100%;display:block;border-radius:8px;overflow:hidden;border:1px solid color-mix(in srgb, ${p.text} 12%, transparent);box-shadow:0 1px 4px color-mix(in srgb, ${p.text} 8%, transparent);text-decoration:none}
.video-capa{width:100%;display:block;aspect-ratio:16/9;object-fit:cover}
.video-play{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:46px;height:46px;border-radius:50%;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center}
.video-play i{color:#fff;font-size:20px}
.video-titulo{position:absolute;left:0;right:0;bottom:0;padding:22px 14px 10px;background:linear-gradient(transparent,rgba(0,0,0,.75));color:#fff;font-size:13px;font-weight:700;letter-spacing:.3px}
.cartao-link{width:100%;display:flex;align-items:center;gap:14px;padding:15px 18px;border-radius:8px;background:${p.surface};border:1px solid color-mix(in srgb, ${p.text} 12%, transparent);box-shadow:0 1px 4px color-mix(in srgb, ${p.text} 8%, transparent);text-decoration:none;transition:border-color .15s,box-shadow .15s}
.cartao-link:hover{border-color:${p.border};box-shadow:0 2px 8px color-mix(in srgb, ${p.border} 25%, transparent)}
.cartao-icone{width:38px;height:38px;border-radius:50%;background:color-mix(in srgb, ${p.primary} 10%, transparent);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.cartao-icone i{font-size:19px;color:${p.primary}}
.cartao-texto{flex:1;display:flex;flex-direction:column}
.cartao-titulo{font-size:15px;font-weight:700;color:${p.text};letter-spacing:.3px}
.cartao-descricao{font-size:12px;color:${p.muted};margin-top:2px;line-height:1.4}
.cartao-seta{color:${p.border};font-size:17px}
.cartao-link.destaque{position:relative;border-color:${p.border};animation:destaque-pulse 2.6s ease-in-out infinite}
.selo-destaque{position:absolute;top:-8px;right:-6px;width:20px;height:20px;border-radius:50%;background:${p.border};display:flex;align-items:center;justify-content:center}
.selo-destaque i{font-size:11px;color:${p.bg}}
@keyframes destaque-pulse{0%,100%{box-shadow:0 1px 4px color-mix(in srgb, ${p.text} 8%, transparent)}50%{box-shadow:0 0 12px 0 color-mix(in srgb, ${p.border} 55%, transparent)}}
.salvar-contato{display:inline-flex;align-items:center;gap:8px;padding:9px 20px;border-radius:4px;border:1px solid ${p.border};color:${p.primary};font-size:13px;letter-spacing:.4px;text-decoration:none;transition:background .15s}
.salvar-contato:hover{background:color-mix(in srgb, ${p.border} 15%, transparent)}
.salvar-contato i{font-size:16px}
.divisor{width:100%;height:1px;background:color-mix(in srgb, ${p.border} 35%, transparent)}
.rodape{font-size:11px;color:color-mix(in srgb, ${p.text} 40%, transparent);letter-spacing:.4px;text-align:center}
`.trim();
}
