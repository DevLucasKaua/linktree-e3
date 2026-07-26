import type { Palette } from "@/templates/types";

/** CSS do template Editorial — serifa e botões com recorte de papel. */
export function css(p: Palette): string {
  return `
*{box-sizing:border-box;margin:0;padding:0}
body{background:${p.bg};min-height:100vh;display:flex;justify-content:center;font-family:Georgia,'Times New Roman',serif;color:${p.text}}
.pagina{max-width:420px;width:100%;margin:0 auto;padding:2.75rem 1.25rem;display:flex;flex-direction:column;align-items:center;gap:1.05rem}
.cabecalho{display:flex;flex-direction:column;align-items:center;gap:.6rem;margin-bottom:.5rem}
.foto{width:96px;height:96px;border-radius:50%;background:${p.surface};border:1px solid ${p.border};display:flex;align-items:center;justify-content:center;overflow:hidden;box-shadow:0 2px 10px rgba(25,23,19,.12)}
.foto img{width:100%;height:100%;object-fit:cover}
.foto-iniciais{color:${p.primary};font-size:32px;font-weight:700}
.nome{color:${p.primary};font-size:25px;font-weight:700;letter-spacing:.3px;text-align:center;margin-top:.3rem}
.bio{color:${p.muted};font-size:14px;font-style:italic;text-align:center;line-height:1.6;max-width:300px}
.redes{display:flex;gap:.95rem;justify-content:center;flex-wrap:wrap;margin-top:.15rem}
.rede{color:${p.primary};font-size:20px;text-decoration:none;transition:opacity .15s}
.rede:hover{opacity:.65}
.titulo-secao{width:100%;margin-top:.55rem;text-align:center;font-size:15px;font-weight:700;font-style:italic;color:${p.muted}}
.recorte{position:relative;width:100%;display:flex;align-items:center;justify-content:center;gap:10px;padding:15px 20px;background:${p.surface};color:${p.primary};text-decoration:none;box-shadow:0 2px 8px rgba(25,23,19,.1);border-radius:13px 5px 15px 6px / 6px 14px 5px 12px;transition:transform .15s}
.pagina a.recorte:nth-of-type(odd){transform:rotate(.4deg)}
.pagina a.recorte:nth-of-type(even){transform:rotate(-.35deg)}
.recorte:hover{transform:rotate(0) scale(1.015)}
.recorte i{font-size:18px}
.recorte-texto{display:flex;flex-direction:column;align-items:center}
.recorte-rotulo{font-size:15.5px;font-weight:700;letter-spacing:.2px}
.recorte-desc{font-size:12px;color:${p.muted};margin-top:1px;font-style:italic}
.recorte.destaque{box-shadow:0 0 0 2px ${p.primary},0 2px 8px rgba(25,23,19,.1);animation:papel-pulso 2.8s ease-in-out infinite}
.selo{position:absolute;top:-9px;right:-4px;width:22px;height:22px;border-radius:50%;background:${p.primary};display:flex;align-items:center;justify-content:center}
.selo i{font-size:11px;color:${p.surface}}
@keyframes papel-pulso{0%,100%{box-shadow:0 0 0 2px ${p.primary},0 2px 8px rgba(25,23,19,.1)}50%{box-shadow:0 0 0 2px ${p.primary},0 4px 16px rgba(25,23,19,.25)}}
.video{position:relative;width:100%;display:block;overflow:hidden;border-radius:12px 6px 14px 7px / 7px 13px 6px 12px;border:1px solid ${p.border};text-decoration:none;box-shadow:0 2px 8px rgba(25,23,19,.12)}
.video-capa{width:100%;display:block;aspect-ratio:16/9;object-fit:cover;filter:saturate(.9)}
.video-play{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:46px;height:46px;border-radius:50%;background:rgba(25,23,19,.6);display:flex;align-items:center;justify-content:center}
.video-play i{color:#fff;font-size:20px}
.video-rotulo{position:absolute;left:0;right:0;bottom:0;padding:22px 14px 10px;background:linear-gradient(transparent,rgba(25,23,19,.7));color:#fff;font-size:13px;font-weight:700;text-align:center}
.salvar-contato{display:inline-flex;align-items:center;gap:8px;padding:9px 20px;border:1px solid ${p.primary};border-radius:2px;color:${p.primary};font-size:13px;letter-spacing:.4px;text-decoration:none;transition:background .15s,color .15s}
.salvar-contato:hover{background:${p.primary};color:${p.surface}}
.salvar-contato i{font-size:16px}
.divisor{width:56px;height:1px;background:${p.border};margin-top:.5rem}
.rodape{font-size:11px;color:${p.muted};letter-spacing:.4px;text-align:center}
`.trim();
}
