import type { Palette } from "@/templates/types";

export function css(p: Palette): string {
  return `
*{box-sizing:border-box;margin:0;padding:0}
body{background:${p.bg};min-height:100vh;display:flex;justify-content:center;font-family:system-ui,-apple-system,sans-serif}
.container{max-width:420px;width:100%;margin:0 auto;padding:2rem 1.25rem;display:flex;flex-direction:column;align-items:center;gap:1.25rem}
.logo-area{display:flex;flex-direction:column;align-items:center;gap:.5rem;margin-bottom:.5rem}
.logo-circle{width:80px;height:80px;border-radius:50%;background:${p.surface};border:2px solid ${p.primary};display:flex;align-items:center;justify-content:center;overflow:hidden}
.logo-circle img{width:100%;height:100%;object-fit:cover}
.logo-initials{color:${p.primary};font-size:26px;font-weight:700}
.brand-name{color:${p.text};font-size:18px;font-weight:600}
.brand-sub{color:${p.muted};font-size:13px;text-align:center;line-height:1.5;max-width:280px}
.link-btn{width:100%;display:flex;align-items:center;gap:14px;padding:14px 18px;border-radius:12px;border:1px solid ${p.border};background:transparent;text-decoration:none;cursor:pointer;transition:background .15s}
.link-btn:hover{background:color-mix(in srgb, ${p.primary} 8%, transparent)}
.icon-wrap{width:38px;height:38px;border-radius:8px;background:color-mix(in srgb, ${p.primary} 15%, transparent);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.icon-wrap i{font-size:20px;color:${p.primary}}
.btn-text{flex:1}
.btn-label{font-size:15px;font-weight:500;color:${p.text};display:block}
.btn-desc{font-size:12px;color:${p.muted};display:block;margin-top:2px}
.arrow{color:${p.primary};font-size:18px}
.save-contact{display:inline-flex;align-items:center;gap:8px;padding:9px 18px;border-radius:999px;border:1px solid ${p.border};color:${p.muted};font-size:13px;text-decoration:none;transition:color .15s,border-color .15s}
.save-contact:hover{color:${p.primary};border-color:${p.primary}}
.save-contact i{font-size:16px}
.divider{width:100%;height:0.5px;background:color-mix(in srgb, ${p.text} 10%, transparent)}
.footer{font-size:11px;color:color-mix(in srgb, ${p.text} 25%, transparent)}
`.trim();
}
