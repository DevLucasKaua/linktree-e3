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
.socials{display:flex;gap:.5rem;justify-content:center;flex-wrap:wrap;margin-top:.35rem}
.social-btn{width:36px;height:36px;border-radius:50%;border:1px solid ${p.border};display:flex;align-items:center;justify-content:center;color:${p.muted};text-decoration:none;transition:color .15s,border-color .15s}
.social-btn:hover{color:${p.primary};border-color:${p.primary}}
.social-btn i{font-size:17px}
.section-title{width:100%;margin-top:.5rem;text-align:center;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:${p.muted}}
.yt-card{position:relative;width:100%;display:block;border-radius:12px;overflow:hidden;border:1px solid ${p.border};text-decoration:none}
.yt-thumb{width:100%;display:block;aspect-ratio:16/9;object-fit:cover}
.yt-play{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:46px;height:46px;border-radius:50%;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center}
.yt-play i{color:#fff;font-size:20px}
.yt-label{position:absolute;left:0;right:0;bottom:0;padding:22px 14px 10px;background:linear-gradient(transparent,rgba(0,0,0,.78));color:#fff;font-size:13px;font-weight:600}
.link-btn{width:100%;display:flex;align-items:center;gap:14px;padding:14px 18px;border-radius:12px;border:1px solid ${p.border};background:transparent;text-decoration:none;cursor:pointer;transition:background .15s}
.link-btn.destaque{position:relative;border-color:${p.primary};animation:destaque-pulse 2.6s ease-in-out infinite}
.destaque-badge{position:absolute;top:-8px;right:-6px;width:20px;height:20px;border-radius:50%;background:${p.primary};display:flex;align-items:center;justify-content:center}
.destaque-badge i{font-size:11px;color:${p.bg}}
@keyframes destaque-pulse{0%,100%{box-shadow:0 0 0 0 transparent}50%{box-shadow:0 0 12px 0 color-mix(in srgb, ${p.primary} 45%, transparent)}}
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
