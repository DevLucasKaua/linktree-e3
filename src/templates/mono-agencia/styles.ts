import type { Palette } from "@/templates/types";

/** CSS do template Mono — cards flat preto e branco com setas. */
export function css(p: Palette): string {
  return `
*{box-sizing:border-box;margin:0;padding:0}
body{background:${p.bg};min-height:100vh;display:flex;justify-content:center;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color:${p.text}}
.pagina{max-width:420px;width:100%;margin:0 auto;padding:2rem 1rem;display:flex;flex-direction:column;gap:.8rem}
.card-perfil{width:100%;background:${p.surface};border:1px solid ${p.border};border-radius:14px;padding:1.75rem 1.25rem 1.4rem;display:flex;flex-direction:column;align-items:center;gap:.55rem}
.foto{width:78px;height:78px;border-radius:50%;background:${p.primary};display:flex;align-items:center;justify-content:center;overflow:hidden}
.foto img{width:100%;height:100%;object-fit:cover}
.foto-iniciais{color:${p.surface};font-size:26px;font-weight:800}
.nome{color:${p.text};font-size:18px;font-weight:700;text-align:center}
.bio{color:${p.muted};font-size:13px;text-align:center;line-height:1.5;max-width:290px}
.redes{display:flex;gap:1.05rem;justify-content:center;flex-wrap:wrap;margin-top:.35rem}
.rede{color:${p.primary};font-size:19px;text-decoration:none;transition:opacity .15s}
.rede:hover{opacity:.55}
.titulo-secao{width:100%;margin-top:.35rem;text-align:center;font-size:14px;font-weight:700;color:${p.text}}
.botao{position:relative;width:100%;display:flex;align-items:center;justify-content:center;gap:8px;padding:14px 18px;background:${p.surface};border:1px solid ${p.border};border-radius:10px;color:${p.text};text-decoration:none;transition:border-color .15s,transform .15s}
.botao:hover{border-color:${p.primary};transform:translateY(-1px)}
.botao i{font-size:17px}
.botao-texto{display:flex;flex-direction:column;align-items:center}
.botao-rotulo{font-size:14.5px;font-weight:600}
.botao-desc{font-size:12px;color:${p.muted};margin-top:1px}
.seta{font-size:15px;color:${p.muted}}
.botao.destaque{border-color:${p.primary};animation:mono-pulso 2.8s ease-in-out infinite}
.selo{position:absolute;top:-8px;right:-4px;width:21px;height:21px;border-radius:50%;background:${p.primary};display:flex;align-items:center;justify-content:center}
.selo i{font-size:10px;color:${p.surface}}
@keyframes mono-pulso{0%,100%{box-shadow:none}50%{box-shadow:0 4px 14px rgba(0,0,0,.14)}}
.video{position:relative;width:100%;display:block;border-radius:10px;overflow:hidden;border:1px solid ${p.border};text-decoration:none}
.video-capa{width:100%;display:block;aspect-ratio:16/9;object-fit:cover;filter:grayscale(.2)}
.video-play{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:46px;height:46px;border-radius:50%;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center}
.video-play i{color:#fff;font-size:20px}
.video-rotulo{position:absolute;left:0;right:0;bottom:0;padding:22px 14px 10px;background:linear-gradient(transparent,rgba(0,0,0,.72));color:#fff;font-size:13px;font-weight:600;text-align:center}
.salvar-contato{align-self:center;display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:10px;background:${p.primary};color:${p.surface};font-size:13px;font-weight:600;text-decoration:none;transition:opacity .15s}
.salvar-contato:hover{opacity:.85}
.salvar-contato i{font-size:16px}
.rodape{margin-top:.4rem;font-size:11px;color:${p.muted};text-align:center}
`.trim();
}
