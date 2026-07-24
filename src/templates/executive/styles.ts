import type { Palette } from "@/templates/types";

/** CSS do template Executivo — todas as cores derivam da paleta `p`. */
export function css(p: Palette): string {
  return `
*{box-sizing:border-box;margin:0;padding:0}
body{background:${p.bg};min-height:100vh;display:flex;justify-content:center;font-family:system-ui,-apple-system,sans-serif}
.exec-page{max-width:420px;width:100%;margin:0 auto;padding:2.5rem 1.25rem;display:flex;flex-direction:column;align-items:center;gap:1.25rem}
.exec-header{display:flex;flex-direction:column;align-items:center;gap:.65rem;margin-bottom:.5rem}
.portrait-frame{position:relative;padding:0;margin-bottom:.35rem}
.portrait-frame::after{content:"";position:absolute;inset:0;transform:translate(6px,6px);border:2px solid color-mix(in srgb, ${p.primary} 45%, transparent);border-radius:12px;z-index:0}
.portrait{position:relative;z-index:1;width:88px;height:88px;border-radius:12px;background:${p.surface};border:2px solid ${p.primary};display:flex;align-items:center;justify-content:center;overflow:hidden}
.portrait img{width:100%;height:100%;object-fit:cover}
.portrait-initials{color:${p.primary};font-size:28px;font-weight:700;letter-spacing:2px}
.exec-name{color:${p.text};font-size:17px;font-weight:600;text-transform:uppercase;letter-spacing:3px;text-align:center}
.gold-rule{width:44px;height:2px;background:${p.primary}}
.exec-bio{color:${p.muted};font-size:13px;text-align:center;line-height:1.6;max-width:300px}
.exec-links{width:100%;display:flex;flex-direction:column;gap:.75rem}
.exec-btn{width:100%;display:flex;align-items:center;gap:14px;padding:14px 16px;border-radius:8px;border-left:4px solid ${p.border};background:${p.surface};text-decoration:none;cursor:pointer;transition:background .15s}
.exec-btn:hover{background:color-mix(in srgb, ${p.text} 8%, ${p.surface})}
.exec-icon{width:36px;height:36px;border-radius:6px;background:color-mix(in srgb, ${p.primary} 14%, transparent);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.exec-icon i{font-size:19px;color:${p.primary}}
.exec-text{flex:1;display:flex;flex-direction:column}
.exec-label{font-size:15px;font-weight:600;color:${p.text};letter-spacing:.4px}
.exec-desc{font-size:12px;color:${p.muted};margin-top:2px}
.exec-arrow{color:${p.primary};font-size:18px}
.exec-contact{display:inline-flex;align-items:center;gap:8px;padding:9px 20px;border-radius:6px;border:1px solid color-mix(in srgb, ${p.primary} 45%, transparent);color:${p.primary};font-size:12px;letter-spacing:1.5px;text-transform:uppercase;text-decoration:none;transition:background .15s}
.exec-contact:hover{background:color-mix(in srgb, ${p.primary} 10%, transparent)}
.exec-contact i{font-size:16px}
.exec-divider{width:100%;height:1px;background:color-mix(in srgb, ${p.primary} 30%, transparent)}
.exec-footer{font-size:11px;color:color-mix(in srgb, ${p.text} 30%, transparent);letter-spacing:.5px}
`.trim();
}
