import type { Palette } from "@/templates/types";

/** CSS do template Gradiente — todas as cores derivam da paleta `p`. */
export function css(p: Palette): string {
  return `
*{box-sizing:border-box;margin:0;padding:0}
body{background:linear-gradient(160deg, ${p.bg} 0%, color-mix(in srgb, ${p.primary} 55%, ${p.bg}) 70%, ${p.primary} 130%);background-attachment:fixed;min-height:100vh;display:flex;justify-content:center;font-family:system-ui,-apple-system,sans-serif}
.glass-page{max-width:420px;width:100%;margin:0 auto;padding:2.5rem 1.25rem;display:flex;flex-direction:column;align-items:center;gap:1.25rem}
.glass-header{display:flex;flex-direction:column;align-items:center;gap:.6rem;margin-bottom:.5rem}
.avatar-ring{padding:3px;border-radius:50%;background:linear-gradient(135deg, ${p.primary}, color-mix(in srgb, ${p.primary} 35%, ${p.surface}))}
.avatar{width:84px;height:84px;border-radius:50%;background:color-mix(in srgb, ${p.surface} 10%, ${p.bg});border:2px solid ${p.bg};display:flex;align-items:center;justify-content:center;overflow:hidden}
.avatar img{width:100%;height:100%;object-fit:cover}
.avatar-initials{color:${p.text};font-size:28px;font-weight:700}
.client-name{color:${p.text};font-size:19px;font-weight:700}
.client-bio{color:${p.muted};font-size:13px;text-align:center;line-height:1.5;max-width:300px}
.glass-links{width:100%;display:flex;flex-direction:column;gap:.875rem}
.glass-card{width:100%;display:flex;align-items:center;gap:14px;padding:14px 16px;border-radius:14px;border:1px solid ${p.border};background:color-mix(in srgb, ${p.surface} 8%, transparent);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);text-decoration:none;cursor:pointer;transition:background .15s,transform .15s}
.glass-card:hover{background:color-mix(in srgb, ${p.surface} 14%, transparent);transform:translateY(-1px)}
.card-icon{width:38px;height:38px;border-radius:10px;background:color-mix(in srgb, ${p.surface} 12%, transparent);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.card-icon i{font-size:20px;color:${p.text}}
.card-text{flex:1;display:flex;flex-direction:column}
.card-label{font-size:15px;font-weight:600;color:${p.text}}
.card-desc{font-size:12px;color:${p.muted};margin-top:2px}
.card-arrow{color:${p.muted};font-size:18px}
.glass-contact{display:inline-flex;align-items:center;gap:8px;padding:9px 18px;border-radius:999px;border:1px solid ${p.border};background:color-mix(in srgb, ${p.surface} 8%, transparent);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);color:${p.muted};font-size:13px;text-decoration:none;transition:background .15s,color .15s}
.glass-contact:hover{background:color-mix(in srgb, ${p.surface} 14%, transparent);color:${p.text}}
.glass-contact i{font-size:16px}
.glass-divider{width:100%;height:1px;background:color-mix(in srgb, ${p.text} 12%, transparent)}
.glass-footer{font-size:11px;color:color-mix(in srgb, ${p.text} 40%, transparent)}
`.trim();
}
