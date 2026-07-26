import type { Palette } from "@/templates/types";

/** CSS do template Hero — foto widescreen no topo com nome sobreposto. */
export function css(p: Palette): string {
  return `
*{box-sizing:border-box;margin:0;padding:0}
body{background:${p.bg};min-height:100vh;display:flex;justify-content:center;font-family:system-ui,-apple-system,sans-serif;color:${p.text}}
.pagina{max-width:420px;width:100%;margin:0 auto;display:flex;flex-direction:column}
.hero{position:relative;width:100%;height:340px;overflow:hidden;border-radius:0 0 28px 28px}
.hero img{width:100%;height:100%;object-fit:cover}
.hero-iniciais{width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(160deg, color-mix(in srgb, ${p.primary} 35%, ${p.bg}), ${p.bg});font-size:88px;font-weight:800;color:color-mix(in srgb, ${p.text} 60%, transparent)}
.hero-grad{position:absolute;inset:0;background:linear-gradient(transparent 35%, color-mix(in srgb, ${p.bg} 55%, transparent) 70%, ${p.bg})}
.hero-texto{position:absolute;left:0;right:0;bottom:0;padding:0 1.5rem 1.1rem;display:flex;flex-direction:column;gap:.25rem}
.nome{color:${p.text};font-size:26px;font-weight:800;text-shadow:0 2px 10px rgba(0,0,0,.5)}
.bio{color:${p.muted};font-size:13.5px;line-height:1.5;max-width:320px;text-shadow:0 1px 8px rgba(0,0,0,.45)}
.conteudo{display:flex;flex-direction:column;align-items:center;gap:.85rem;padding:1.1rem 1.25rem 2rem}
.redes{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap}
.rede{width:40px;height:40px;border-radius:50%;background:${p.surface};border:1px solid ${p.border};display:flex;align-items:center;justify-content:center;color:${p.text};font-size:19px;text-decoration:none;transition:border-color .15s,transform .15s}
.rede:hover{border-color:${p.primary};transform:translateY(-2px)}
.titulo-secao{width:100%;margin-top:.4rem;text-align:center;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${p.muted}}
.pill{position:relative;width:100%;display:flex;align-items:center;gap:12px;padding:14px 18px;border-radius:14px;background:${p.surface};border:1px solid ${p.border};color:${p.text};text-decoration:none;transition:border-color .15s,transform .15s}
.pill:hover{border-color:${p.primary};transform:translateY(-1px)}
.pill-icone{width:38px;height:38px;border-radius:10px;background:color-mix(in srgb, ${p.primary} 18%, transparent);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.pill-icone i{font-size:19px;color:${p.primary}}
.pill-texto{flex:1;min-width:0;display:flex;flex-direction:column}
.pill-rotulo{font-size:15px;font-weight:600}
.pill-desc{font-size:12px;color:${p.muted};margin-top:2px}
.pill-seta{color:${p.primary};font-size:17px}
.pill.destaque{border-color:${p.primary};animation:hero-pulso 2.6s ease-in-out infinite}
.selo{position:absolute;top:-8px;right:-4px;width:22px;height:22px;border-radius:50%;background:${p.primary};display:flex;align-items:center;justify-content:center}
.selo i{font-size:11px;color:${p.bg}}
@keyframes hero-pulso{0%,100%{box-shadow:none}50%{box-shadow:0 0 16px color-mix(in srgb, ${p.primary} 50%, transparent)}}
.video{position:relative;width:100%;display:block;border-radius:16px;overflow:hidden;border:1px solid ${p.border};text-decoration:none}
.video-capa{width:100%;display:block;aspect-ratio:16/9;object-fit:cover}
.video-play{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:46px;height:46px;border-radius:50%;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center}
.video-play i{color:#fff;font-size:20px}
.video-rotulo{position:absolute;left:0;right:0;bottom:0;padding:22px 14px 10px;background:linear-gradient(transparent,rgba(0,0,0,.75));color:#fff;font-size:13px;font-weight:600}
.salvar-contato{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:999px;border:1px solid ${p.border};color:${p.muted};font-size:13px;text-decoration:none;transition:color .15s,border-color .15s}
.salvar-contato:hover{color:${p.primary};border-color:${p.primary}}
.salvar-contato i{font-size:16px}
.rodape{margin-top:.5rem;font-size:11px;color:${p.muted};text-align:center}
`.trim();
}
