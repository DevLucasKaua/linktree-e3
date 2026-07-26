import type { Palette } from "@/templates/types";

/** CSS do template Bento — cards em grade com tiles de ícone. */
export function css(p: Palette): string {
  return `
*{box-sizing:border-box;margin:0;padding:0}
body{background:linear-gradient(180deg, ${p.bg}, color-mix(in srgb, ${p.bg} 70%, #000));min-height:100vh;display:flex;justify-content:center;font-family:system-ui,-apple-system,sans-serif;color:${p.text}}
.pagina{max-width:420px;width:100%;margin:0 auto;padding:1.5rem 1rem 2rem;display:flex;flex-direction:column;gap:.7rem}
.card{background:${p.surface};border:1px solid ${p.border};border-radius:16px}
.card-perfil{padding:1.4rem;display:flex;align-items:center;gap:1rem}
.foto{width:84px;height:84px;border-radius:16px;background:color-mix(in srgb, ${p.primary} 25%, transparent);display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0}
.foto img{width:100%;height:100%;object-fit:cover}
.foto-iniciais{color:${p.text};font-size:28px;font-weight:800}
.perfil-texto{min-width:0;display:flex;flex-direction:column;gap:.3rem}
.chip-org{align-self:flex-start;padding:3px 10px;border-radius:999px;background:color-mix(in srgb, ${p.primary} 18%, transparent);color:${p.primary};font-size:11px;font-weight:600}
.nome{color:${p.text};font-size:20px;font-weight:800;line-height:1.2}
.bio{color:${p.muted};font-size:13px;line-height:1.5}
.redes{display:grid;grid-template-columns:repeat(4,1fr);gap:.55rem}
.rede{aspect-ratio:1.4;display:flex;align-items:center;justify-content:center;background:${p.surface};border:1px solid ${p.border};border-radius:14px;color:${p.text};font-size:21px;text-decoration:none;transition:border-color .15s,transform .15s}
.rede:hover{border-color:${p.primary};transform:translateY(-2px)}
.titulo-secao{margin-top:.4rem;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${p.muted}}
.item{position:relative;display:flex;align-items:center;gap:12px;padding:14px;background:${p.surface};border:1px solid ${p.border};border-radius:16px;text-decoration:none;transition:border-color .15s,transform .15s}
.item:hover{border-color:${p.primary};transform:translateY(-1px)}
.tile{width:42px;height:42px;border-radius:12px;background:color-mix(in srgb, ${p.primary} 20%, transparent);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.tile i{font-size:21px;color:${p.primary}}
.item-texto{flex:1;min-width:0;display:flex;flex-direction:column}
.item-rotulo{font-size:15px;font-weight:700;color:${p.text}}
.item-desc{font-size:12px;color:${p.muted};margin-top:2px}
.item-seta{color:${p.muted};font-size:17px}
.item.destaque{border-color:${p.primary};animation:bento-pulso 2.6s ease-in-out infinite}
.selo{position:absolute;top:-8px;right:-4px;width:22px;height:22px;border-radius:50%;background:${p.primary};display:flex;align-items:center;justify-content:center}
.selo i{font-size:11px;color:${p.bg}}
@keyframes bento-pulso{0%,100%{box-shadow:none}50%{box-shadow:0 0 18px color-mix(in srgb, ${p.primary} 45%, transparent)}}
.video{position:relative;display:block;border-radius:16px;overflow:hidden;border:1px solid ${p.border};text-decoration:none}
.video-capa{width:100%;display:block;aspect-ratio:16/9;object-fit:cover}
.video-play{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:46px;height:46px;border-radius:50%;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center}
.video-play i{color:#fff;font-size:20px}
.video-rotulo{position:absolute;left:0;right:0;bottom:0;padding:22px 14px 10px;background:linear-gradient(transparent,rgba(0,0,0,.75));color:#fff;font-size:13px;font-weight:700}
.salvar-contato{align-self:center;display:inline-flex;align-items:center;gap:8px;margin-top:.3rem;padding:10px 20px;border-radius:12px;border:1px solid ${p.border};color:${p.text};font-size:13px;text-decoration:none;transition:border-color .15s}
.salvar-contato:hover{border-color:${p.primary}}
.salvar-contato i{font-size:16px}
.rodape{margin-top:.5rem;font-size:11px;color:${p.muted};text-align:center}
`.trim();
}
