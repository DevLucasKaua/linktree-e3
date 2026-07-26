import type { Palette } from "@/templates/types";

/** CSS do template Foto de Fundo — pills brancas sobre foto/gradiente. */
export function css(p: Palette): string {
  return `
*{box-sizing:border-box;margin:0;padding:0}
body{background:linear-gradient(175deg, ${p.bg}, color-mix(in srgb, ${p.bg} 55%, #000));min-height:100vh;display:flex;justify-content:center;font-family:system-ui,-apple-system,sans-serif}
.pagina{max-width:420px;width:100%;margin:0 auto;padding:2.5rem 1.25rem;display:flex;flex-direction:column;align-items:center;gap:1.1rem}
.cabecalho{display:flex;flex-direction:column;align-items:center;gap:.55rem;margin-bottom:.4rem}
.foto{width:92px;height:92px;border-radius:50%;border:3px solid ${p.surface};background:color-mix(in srgb, ${p.surface} 20%, transparent);display:flex;align-items:center;justify-content:center;overflow:hidden;box-shadow:0 4px 18px rgba(0,0,0,.3)}
.foto img{width:100%;height:100%;object-fit:cover}
.foto-iniciais{color:${p.text};font-size:30px;font-weight:700}
.nome{color:${p.text};font-size:22px;font-weight:700;text-align:center;text-shadow:0 1px 8px rgba(0,0,0,.4)}
.bio{color:${p.muted};font-size:14px;text-align:center;line-height:1.55;max-width:300px;text-shadow:0 1px 6px rgba(0,0,0,.35)}
.redes{display:flex;gap:1.1rem;justify-content:center;flex-wrap:wrap;margin-top:.2rem}
.rede{color:${p.text};font-size:22px;text-decoration:none;text-shadow:0 1px 6px rgba(0,0,0,.4);transition:transform .15s}
.rede:hover{transform:scale(1.12)}
.titulo-secao{width:100%;margin-top:.5rem;text-align:center;font-size:14px;font-weight:700;color:${p.text};text-shadow:0 1px 6px rgba(0,0,0,.4)}
.pill{position:relative;width:100%;display:flex;align-items:center;justify-content:center;gap:10px;padding:15px 20px;border-radius:999px;background:${p.surface};color:${p.primary};text-decoration:none;box-shadow:0 3px 14px rgba(0,0,0,.22);transition:transform .15s}
.pill:hover{transform:scale(1.02)}
.pill i{font-size:19px}
.pill-texto{display:flex;flex-direction:column;align-items:center}
.pill-rotulo{font-size:15px;font-weight:600}
.pill-desc{font-size:12px;opacity:.65;margin-top:1px}
.pill.destaque{animation:pulso 2.6s ease-in-out infinite}
.selo{position:absolute;top:-8px;right:2px;width:22px;height:22px;border-radius:50%;background:${p.primary};display:flex;align-items:center;justify-content:center}
.selo i{font-size:11px;color:${p.surface}}
@keyframes pulso{0%,100%{box-shadow:0 3px 14px rgba(0,0,0,.22)}50%{box-shadow:0 3px 22px rgba(255,255,255,.4)}}
.video{position:relative;width:100%;display:block;border-radius:22px;overflow:hidden;border:3px solid ${p.surface};text-decoration:none;box-shadow:0 3px 14px rgba(0,0,0,.25)}
.video-capa{width:100%;display:block;aspect-ratio:16/9;object-fit:cover}
.video-play{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:46px;height:46px;border-radius:50%;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center}
.video-play i{color:#fff;font-size:20px}
.video-rotulo{position:absolute;left:0;right:0;bottom:0;padding:22px 14px 10px;background:linear-gradient(transparent,rgba(0,0,0,.75));color:#fff;font-size:13px;font-weight:600;text-align:center}
.salvar-contato{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:999px;border:1.5px solid ${p.border};color:${p.text};font-size:13px;text-decoration:none;text-shadow:0 1px 6px rgba(0,0,0,.35);transition:background .15s}
.salvar-contato:hover{background:rgba(255,255,255,.12)}
.salvar-contato i{font-size:16px}
.rodape{margin-top:.6rem;font-size:11px;color:${p.muted};text-shadow:0 1px 6px rgba(0,0,0,.35)}
`.trim();
}
