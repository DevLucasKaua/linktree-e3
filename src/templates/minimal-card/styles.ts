import type { Palette } from "@/templates/types";

/** CSS do template Minimal com a paleta interpolada. */
export function css(p: Palette): string {
  return `
*{box-sizing:border-box;margin:0;padding:0}
body{background:${p.bg};min-height:100vh;display:flex;justify-content:center;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color:${p.text}}
.moldura{max-width:420px;width:100%;margin:0 auto;padding:2rem 1rem;display:flex;flex-direction:column;justify-content:flex-start}
.card{width:100%;background:${p.surface};border-radius:24px;box-shadow:0 8px 30px color-mix(in srgb, ${p.primary} 8%, transparent);padding:2.5rem 1.5rem;display:flex;flex-direction:column;align-items:center;gap:1.75rem}
.perfil{display:flex;flex-direction:column;align-items:center;gap:.65rem}
.avatar{width:84px;height:84px;border-radius:50%;background:color-mix(in srgb, ${p.primary} 8%, transparent);display:flex;align-items:center;justify-content:center;overflow:hidden}
.avatar img{width:100%;height:100%;object-fit:cover}
.avatar-iniciais{color:${p.primary};font-size:28px;font-weight:700}
.titulo{color:${p.text};font-size:20px;font-weight:700;text-align:center;margin-top:.3rem}
.subtitulo{color:${p.muted};font-size:13px;text-align:center;line-height:1.55;max-width:280px}
.botoes{width:100%;display:flex;flex-direction:column;gap:.75rem}
.botao{width:100%;display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:10px;background:${p.primary};text-decoration:none;transition:background .15s}
.botao:hover{background:color-mix(in srgb, ${p.primary} 85%, ${p.surface})}
.botao-icone{font-size:20px;color:${p.surface};flex-shrink:0}
.botao-texto{flex:1;display:flex;flex-direction:column;align-items:center;padding-right:32px}
.botao-rotulo{font-size:15px;font-weight:600;color:${p.surface}}
.botao-detalhe{font-size:12px;color:color-mix(in srgb, ${p.surface} 65%, transparent);margin-top:2px;text-align:center}
.botao-contato{display:inline-flex;align-items:center;gap:8px;padding:9px 18px;border-radius:999px;border:1px solid ${p.border};color:${p.muted};font-size:13px;text-decoration:none;transition:color .15s,border-color .15s}
.botao-contato:hover{color:${p.primary};border-color:${p.primary}}
.botao-contato i{font-size:16px}
.linha{width:100%;height:1px;background:${p.border}}
.assinatura{font-size:11px;color:color-mix(in srgb, ${p.text} 35%, transparent);text-align:center}
`.trim();
}
