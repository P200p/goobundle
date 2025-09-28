(function(){
  // SharkTool Theme (minimal, safe)
  const KEY = 'sharktool_page_theme_v1';
  const STYLE_ID = 'stl-page-theme';

  function ensureStyle(){
    let st = document.getElementById(STYLE_ID);
    if (!st){ st = document.createElement('style'); st.id = STYLE_ID; document.head.appendChild(st); }
    return st;
  }

  function themeCSS(name){
    switch(name){
      case 'dark':
        return `:root{--bg:#0b1220;--fg:#e2e8f0;--muted:#94a3b8;--card:#0f172a;--accent:#22c55e;--border:#1f2a44}
        body{background:var(--bg)!important;color:var(--fg)!important}
        a{color:#60a5fa!important}
        .card,section,article,main,header,footer,aside,nav{background:var(--card)!important;color:var(--fg)!important;border-color:var(--border)!important}
        button,input,select,textarea{background:#111827!important;color:var(--fg)!important;border:1px solid var(--border)!important}
        ::selection{background:#22c55e33}`;
      case 'cyber':
        return `:root{--bg:#0a0f0f;--fg:#d1fae5;--muted:#94f6e6;--card:#0f1a1a;--accent:#00ffd0;--border:#083d3d}
        body{background:linear-gradient(135deg,#05090a,#0a0f0f 40%,#0e1b1b)!important;color:var(--fg)!important}
        a{color:#00ffd0!important}
        .card,section,article,main,header,footer,aside,nav{background:rgba(0,255,208,0.05)!important;color:var(--fg)!important;border:1px solid #00ffd033!important;box-shadow:0 0 24px #00ffd011}
        button,input,select,textarea{background:#061414!important;color:var(--fg)!important;border:1px solid #00ffd033!important}
        ::selection{background:#00ffd044}`;
      case 'pastel':
        return `:root{--bg:#fff7fb;--fg:#3b3b4f;--muted:#6b7280;--card:#fff;--accent:#ff69b4;--border:#ffd6e7}
        body{background:linear-gradient(180deg,#fff7fb,#fff)!important;color:var(--fg)!important}
        a{color:#e91e63!important}
        .card,section,article,main,header,footer,aside,nav{background:#ffffffd9!important;color:var(--fg)!important;border:1px solid var(--border)!important;border-radius:12px}
        button,input,select,textarea{background:#fff!important;color:var(--fg)!important;border:1px solid var(--border)!important;border-radius:10px}
        ::selection{background:#ff69b422}`;
      case 'retro':
        return `:root{--bg:#222244;--fg:#ffdd44;--muted:#d9f99d;--card:#2b2b55;--accent:#88ffff;--border:#444477}
        body{background:repeating-linear-gradient(45deg,#1c1c3c 0 12px,#20204a 12px 24px)!important;color:var(--fg)!important}
        a{color:#88ffff!important}
        .card,section,article,main,header,footer,aside,nav{background:#2b2b55dd!important;color:var(--fg)!important;border:2px dotted #88ffffaa!important}
        button,input,select,textarea{background:#1f1f3f!important;color:var(--fg)!important;border:2px solid #ffdd44aa!important}
        ::selection{background:#88ffff44}`;
      case 'light':
        return `:root{--bg:#ffffff;--fg:#0f172a;--muted:#475569;--card:#f8fafc;--accent:#2563eb;--border:#e2e8f0}
        body{background:var(--bg)!important;color:var(--fg)!important}
        a{color:#2563eb!important}
        .card,section,article,main,header,footer,aside,nav{background:var(--card)!important;color:var(--fg)!important;border:1px solid var(--border)!important}
        button,input,select,textarea{background:#fff!important;color:var(--fg)!important;border:1px solid var(--border)!important}
        ::selection{background:#2563eb22}`;
      case 'system':
      default:
        return '';
    }
  }

  function applyTheme(name){
    const css = themeCSS(name);
    const st = ensureStyle();
    st.textContent = css;
    try{ localStorage.setItem(KEY, name); }catch(e){}
  }

  // Build tiny floating control (cycle themes)
  const PID = 'sharktool-theme-control';
  if (document.getElementById(PID)) return;
  const ctl = document.createElement('div');
  ctl.id = PID;
  ctl.style.cssText = 'position:fixed;top:20px;right:20px;z-index:2147483646;background:#0b1220;color:#e2e8f0;border:1px solid #334155;border-radius:999px;display:flex;gap:6px;align-items:center;padding:6px 8px;box-shadow:0 10px 30px rgba(0,0,0,.4);font:12px system-ui,-apple-system,Segoe UI,Roboto,sans-serif;';
  ctl.innerHTML = '<span style="opacity:.8">Theme</span> <button id="stt-prev" style="background:#334155;color:#e2e8f0;border:none;border-radius:999px;padding:4px 8px;cursor:pointer">◀</button> <span id="stt-name" style="min-width:60px;text-align:center"></span> <button id="stt-next" style="background:#334155;color:#e2e8f0;border:none;border-radius:999px;padding:4px 8px;cursor:pointer">▶</button> <button id="stt-close" style="background:#ef4444;color:#fff;border:none;border-radius:999px;padding:4px 8px;cursor:pointer">ปิด</button>';
  document.body.appendChild(ctl);

  const THEMES = ['system','light','dark','cyber','pastel','retro'];
  let idx = 0;
  try{
    const saved = localStorage.getItem(KEY) || 'system';
    idx = Math.max(0, THEMES.indexOf(saved));
  }catch(e){}

  function setByIndex(i){ idx = (i+THEMES.length)%THEMES.length; const n = THEMES[idx]; applyTheme(n); ctl.querySelector('#stt-name').textContent = n; }

  ctl.querySelector('#stt-prev').onclick = () => setByIndex(idx-1);
  ctl.querySelector('#stt-next').onclick = () => setByIndex(idx+1);
  ctl.querySelector('#stt-close').onclick = () => ctl.remove();

  // Init current theme
  setByIndex(idx);
})();
