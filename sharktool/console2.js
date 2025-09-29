(function () {
  "use strict";
  const WIN = window;
  if (WIN.__GOONEE_CONSOLE2__) {
    try {
      WIN.GO2.toggle();
    } catch (e) {}
    return;
  }
  WIN.__GOONEE_CONSOLE2__ = true;

  const NS = "goonee:console2";
  const KEY_SNIPPETS = NS + ":snippets_v1",
    KEY_LAYOUT = NS + ":layout_v1",
    KEY_THEME = NS + ":theme_v1",
    KEY_ERUDA = NS + ":eruda_on";

  const store = {
    read(key, fb) {
      try {
        const s = localStorage.getItem(key);
        return s ? JSON.parse(s) : fb ?? null;
      } catch (e) {
        return fb ?? null;
      }
    },
    write(key, val) {
      try {
        localStorage.setItem(key, JSON.stringify(val));
        return true;
      } catch (e) {
        return false;
      }
    },
  };

  const THEMES = [
    {
      name: "Matrix",
      accent: "#00ff40d7",
      accent2: "#00ec3bc9",
      accentText: "#001affff",
      bgPanel: "rgba(0, 0, 0, 0.47)",
      bgInput: "#002200c2",
      bgOutput: "#025a3db6",
      status: "#00ff83",
    },
    {
      name: "Cyan",
      accent: "#00e1ffcb",
      accent2: "#0077ffdc",
      accentText: "#ff0000ff",
      bgPanel: "rgba(0, 33, 117, 0.63)",
      bgInput: "#013566b7",
      bgOutput: "#03305cb4",
      status: "#6dd6ff",
    },
    {
      name: "Flame",
      accent: "#ff9900c2",
      accent2: "#ff5500be",
      accentText: "#ff0000bc",
      bgPanel: "rgba(20, 10, 0, 0.56)",
      bgInput: "#4d3501",
      bgOutput: "#4e0017b6",
      status: "#ffcc66",
    },
    {
      name: "Matrix2",
      accent: "#09ff00ff",
      accent2: "#23ec00ff",
      accentText: "#001affff",
      bgPanel: "rgba(109, 4, 4, 1)",
      bgInput: "#002200ff",
      bgOutput: "#025a3dff",
      status: "#00ff83",
    },
    {
      name: "Cyan2",
      accent: "#3700ffff",
      accent2: "#ff5100ff",
      accentText: "#ff0000ff",
      bgPanel: "rgba(26, 107, 1, 1)",
      bgInput: "#011066ff",
      bgOutput: "#03305cb4",
      status: "#6dd6ff",
    },
    {
      name: "Flame2",
      accent: "#ff0000ff",
      accent2: "#3cff00ff",
      accentText: "#ff0000ff",
      bgPanel: "rgba(20, 10, 0, 0.56)",
      bgInput: "#e9a30dff",
      bgOutput: "#443208b6",
      status: "#0feb3bff",
    },
    {
      name: "Matrix3",
      accent: "#00ff40d7",
      accent2: "#00ec3bc9",
      accentText: "#001affff",
      bgPanel: "rgba(0, 0, 0, 0.47)",
      bgInput: "#002200c2",
      bgOutput: "#025a3db6",
      status: "#ff0090ff",
    },
    {
      name: "Cyan3",
      accent: "#1aff00cb",
      accent2: "#0077ffdc",
      accentText: "#ff0000a3",
      bgPanel: "rgba(2, 23, 7, 0.63)",
      bgInput: "#013566b7",
      bgOutput: "#5c0333b4",
      status: "#836dffff",
    },
    {
      name: "Flame3",
      accent: "#00ff08c2",
      accent2: "#ff5500be",
      accentText: "#ff0000bc",
      bgPanel: "rgba(10, 127, 20, 0.76)",
      bgInput: "#014d0eff",
      bgOutput: "#4e3700b6",
      status: "#f8400dff",
    },
    {
      name: "Matrix4",
      accent: "#0091ffb8",
      accent2: "#23ec00ff",
      accentText: "#00ffc8ff",
      bgPanel: "rgba(214, 8, 8, 1)",
      bgInput: "#002200ff",
      bgOutput: "#02035aff",
      status: "#33ff00ff",
    },
    {
      name: "Cyan4",
      accent: "#3700ffff",
      accent2: "#ff00ddff",
      accentText: "#98c70dff",
      bgPanel: "rgba(17, 1, 107, 1)",
      bgInput: "#17cd1aff",
      bgOutput: "#05284bb4",
      status: "#0e20deff",
    },
    {
      name: "Flame4",
      accent: "#ff0000ff",
      accent2: "#ff0000ff",
      accentText: "#ff0000ff",
      bgPanel: "rgba(230, 118, 7, 0.56)",
      bgInput: "#563b01ff",
      bgOutput: "#ce9309b6",
      status: "#ffcc66",
    },
    {
      name: "random1",
      accent: "#00ff40d7",
      accent2: "#00ec3bc9",
      accentText: "#001affff",
      bgPanel: "rgba(0, 0, 0, 0.47)",
      bgInput: "#002200c2",
      bgOutput: "#5a0222b6",
      status: "#bd108cff",
    },
    {
      name: "random2",
      accent: "#00e1ffcb",
      accent2: "#0077ffdc",
      accentText: "#ff0000ff",
      bgPanel: "rgba(0, 72, 255, 0.63)",
      bgInput: "#0469c8b7",
      bgOutput: "#035c0cb4",
      status: "#6dd6ff",
    },
    {
      name: "random3",
      accent: "#ff9900c2",
      accent2: "#ff5500be",
      accentText: "#ff0000bc",
      bgPanel: "rgba(76, 146, 6, 0.56)",
      bgInput: "#4d3501",
      bgOutput: "#4e3700b6",
      status: "#ff6675ff",
    },
    {
      name: "random4",
      accent: "#09ff00ff",
      accent2: "#23ec00ff",
      accentText: "#00ff44ff",
      bgPanel: "rgba(109, 4, 4, 1)",
      bgInput: "#01ff01ff",
      bgOutput: "#4807d4ff",
      status: "#ff005dff",
    },
    {
      name: "random5",
      accent: "#3700ffff",
      accent2: "#ff5100ff",
      accentText: "#1900ffff",
      bgPanel: "rgba(56, 217, 7, 1)",
      bgInput: "#3609caff",
      bgOutput: "#0761bab4",
      status: "#6d6fffff",
    },
    {
      name: "random6",
      accent: "#ff0000ff",
      accent2: "#3cff00ff",
      accentText: "#b00e0eff",
      bgPanel: "rgba(197, 104, 12, 0.56)",
      bgInput: "#563b01ff",
      bgOutput: "#443208b6",
      status: "#0feb3bff",
    },
    {
      name: "random7",
      accent: "#00ff40d7",
      accent2: "#00ec3bc9",
      accentText: "#001affff",
      bgPanel: "rgba(215, 20, 20, 0.47)",
      bgInput: "#002200c2",
      bgOutput: "#2a025ab6",
      status: "#4dff00ff",
    },
    {
      name: "random8",
      accent: "#1aff00cb",
      accent2: "#0077ffdc",
      accentText: "#ff0000a3",
      bgPanel: "rgba(215, 9, 6, 0.63)",
      bgInput: "#013566b7",
      bgOutput: "#03305cb4",
      status: "#080bc6ff",
    },
    {
      name: "random9",
      accent: "#00ff08c2",
      accent2: "#ff5500be",
      accentText: "#ff0000bc",
      bgPanel: "rgba(0, 255, 21, 0.93)",
      bgInput: "#048c1aff",
      bgOutput: "#4e3700b6",
      status: "#f80d21ff",
    },
    {
      name: "random10",
      accent: "#0091ffb8",
      accent2: "#23ec00ff",
      accentText: "#0fdbaeff",
      bgPanel: "rgba(229, 7, 7, 1)",
      bgInput: "#08db08ff",
      bgOutput: "#195a02ff",
      status: "#33ff00ff",
    },
    {
      name: "random11",
      accent: "#3700ffff",
      accent2: "#ff00ddff",
      accentText: "#ff0000ff",
      bgPanel: "rgba(34, 3, 214, 1)",
      bgInput: "#016603ff",
      bgOutput: "#fc0a0ab4",
      status: "#0e20deff",
    },
    {
      name: "random12",
      accent: "#ff0000ff",
      accent2: "#ff0000ff",
      accentText: "#1eff00ff",
      bgPanel: "rgba(249, 80, 1, 0.56)",
      bgInput: "#07f103ff",
      bgOutput: "#ff6302b6",
      status: "#f7a80aff",
    },
    {
      name: "Pink",
      accent: "#ff3d7ecb",
      accent2: "#57f833d5",
      accentText: "#ff0000ff",
      bgPanel: "rgba(117, 1, 88, 0.79)",
      bgInput: "#f7046db7",
      bgOutput: "#470120ff",
      status: "#ff0059ff",
    },
  ];

  const host = document.createElement("div");
  Object.assign(host.style, {
    all: "initial",
    position: "fixed",
    zIndex: "2147483647",
    inset: "auto 30px 30px auto",
  });
  const root = host.attachShadow({ mode: "open" });

  const style = document.createElement("style");
  style.textContent = `
    :host { all:initial; --accent:#00ff41;--accent2:#00cc33;--accentText:#00ffc3;--bgPanel:rgba(0,0,0,.96);--bgInput:#002200;--bgOutput:#001b12;--status:#00ff83; font-family:system-ui,-apple-system,sans-serif; }
    .gc2-launcher { position:fixed; width:54px; height:54px; border-radius:50%; background:var(--bgPanel); border:2px solid var(--accent); box-shadow:0 8px 24px rgba(0,0,0,.5); display:flex; align-items:center; justify-content:center; color:var(--accent); font-size:24px; cursor:pointer; touch-action:none; transition:transform .2s; }
    .gc2-launcher:hover { transform:scale(1.1); }
    .gc2-panel { position:fixed; top:10vh; left:10vw; width:80vw; height:70vh; min-width:280px; min-height:250px; background:var(--bgPanel); border:2px solid var(--accent); border-radius:12px; color:#e0e0e0; display:none; flex-direction:column; box-shadow:0 12px 40px rgba(0,0,0,.6); resize:both; overflow:hidden; }
    .gc2-header { display:flex; align-items:center; justify-content:space-between; padding:8px 12px; background:linear-gradient(90deg,var(--accent),var(--accent2)); color:#001a0a; font-weight:700; user-select:none; cursor:move; flex-shrink:0; touch-action:none; }
    .gc2-title { display:flex; gap:8px; align-items:center; }
    .gc2-actions button { background:transparent; border:none; color:#001a0a; padding:6px; gap:24px; font-size:24px; font-weight:bold; cursor:pointer; }
    .gc2-toolbar { display:flex; gap:6px; flex-wrap:wrap; padding:6px 8px; border-bottom:1px solid var(--accent); background:rgba(0,0,0,.2); flex-shrink:0; }
    .gc2-tbtn { background:rgba(255,255,255,.08); border:1px solid var(--accent); color:var(--accentText); padding:4px 8px; border-radius:6px; font:600 12px/1.2 system-ui; cursor:pointer; }
    .gc2-tbtn:hover { background:rgba(255,255,255,.15); }
    .gc2-body { flex:1; display:flex; flex-direction:column; gap:6px; padding:8px; overflow:auto; }
    .gc2-label { color:var(--accentText); font-size:12px; font-weight:600; opacity:0.9; }
    .gc2-text { width:100%; flex:1; box-sizing:border-box; resize:none; background:var(--bgInput); border:1px solid var(--accent); border-radius:6px; color:#e0e0e0; padding:8px; font:13px/1.4 'SF Mono', Consolas, Menlo, monospace; }
    .gc2-output { width:100%; flex:0.7; white-space:pre-wrap; overflow:auto; background:var(--bgOutput); border:1px solid var(--accent); border-radius:6px; color:#bde0d5; padding:8px; font:13px/1.4 'SF Mono', Consolas, Menlo, monospace; }
    .gc2-footer { padding:6px 10px; border-top:1px solid var(--accent); color:var(--status); font:12px/1.2 system-ui; display:flex; justify-content:space-between; align-items:center; flex-shrink:0; background:rgba(0,0,0,.2); }
    .gc2-badge { background:#062; color:#9cffb0; border:1px solid #0a4; padding:2px 6px; border-radius:999px; font:600 10px/1 system-ui; }
    
    /* Hacker Effects */
    .gc2-glitch { animation: gc2-glitch 0.3s infinite; }
    @keyframes gc2-glitch {
      0% { transform: translate(0); }
      20% { transform: translate(-2px, 2px); }
      40% { transform: translate(-2px, -2px); }
      60% { transform: translate(2px, 2px); }
      80% { transform: translate(2px, -2px); }
      100% { transform: translate(0); }
    }
    
    .gc2-hacker-mode { 
      background: #000 !important; 
      color: #00ff00 !important; 
      font-family: 'Courier New', monospace !important;
    }
    
    .gc2-pulse { animation: gc2-pulse 1s infinite; }
    @keyframes gc2-pulse {
      0% { opacity: 1; }
      50% { opacity: 0.5; }
      100% { opacity: 1; }
    }
    @media (max-width:720px) { .gc2-panel{left:2vw;right:2vw;width:96vw;height:70vh;} }
      /* เพิ่ม resizer ขนาดใหญ่เพื่อกดง่ายขึ้น */
    .gc2-resizer {
      position: absolute;
      width: 28px;
      height: 28px;
      right: 6px;
      bottom: 6px;
      border-radius:6px;
      cursor: se-resize;
      background: linear-gradient(135deg, rgba(255,255,255,.04), transparent);
      z-index: 10;
      touch-action: none;
    }
  `;

  const launcher = document.createElement("div");
  launcher.className = "gc2-launcher";
  launcher.title = "Goonee Console";
  launcher.innerHTML = "⚡️";
  launcher.style.right = "30px";
  launcher.style.bottom = "30px";

  const panel = document.createElement("div");
  panel.className = "gc2-panel";
  panel.innerHTML = `
    <div class="gc2-header" id="gc2Header">
      <div class="gc2-title"><span>🦈</span><span>กูนี่คอนโซล 2</span></div>
      <div class="gc2-actions"><button id="gc2Min" title="ย่อ">－</button><button id="gc2Close" title="ปิด">×</button>.    .</div>
    </div>
    <div class="gc2-toolbar">
      <button class="gc2-tbtn" id="gc2Run">▶ รัน</button><button class="gc2-tbtn" id="gc2Save">💾 บันทึก</button><button class="gc2-tbtn" id="gc2Load">⤴ โหลด</button><button class="gc2-tbtn" id="gc2Del">🗑 ลบ</button>
      <select class="gc2-tbtn" id="gc2Select" title="สคริปต์ที่บันทึก"></select>
      <button class="gc2-tbtn" id="gc2Theme">🎨 ธีม</button><button class="gc2-tbtn" id="gc2SaveLayout">💾 บันทึกตำแหน่ง</button><button class="gc2-tbtn" id="gc2Eruda">🧪 Eruda</button>
    </div>
    <div class="gc2-toolbar">
      <button class="gc2-tbtn" id="gc2UnlockForms">🔓 ปลดล็อคฟอร์ม</button>
      <button class="gc2-tbtn" id="gc2EditPage">✏️ แก้ไขเว็บ</button>
      <button class="gc2-tbtn" id="gc2SwKill">🧹 ล้าง SW</button>
      <button class="gc2-tbtn" id="gc2ShowPasswords">👁️ แสดงรหัส</button>
      <button class="gc2-tbtn" id="gc2RemoveCSS">🎭 ลบ CSS</button>
      <button class="gc2-tbtn" id="gc2Matrix">🌊 Matrix</button>
    </div>
    <div class="gc2-toolbar">
      <button class="gc2-tbtn" id="gc2XSSTest">⚡ XSS Test</button>
      <button class="gc2-tbtn" id="gc2CookieHack">🍪 Cookie Hack</button>
      <button class="gc2-tbtn" id="gc2DOMSpy">🔍 DOM Spy</button>
      <button class="gc2-tbtn" id="gc2NetSniffer">📡 Net Sniffer</button>
      <button class="gc2-tbtn" id="gc2JSInject">💉 JS Inject</button>
      <button class="gc2-tbtn" id="gc2PhishKit">🎣 Phish Kit</button>
    </div>
    <div class="gc2-body">
      <div class="gc2-label">📋 โค้ด (Javascript)</div><textarea class="gc2-text" id="gc2Code" placeholder="javascript:alert('Hello from Goonee!')"></textarea>
      <div class="gc2-label">🧾 ผลลัพธ์</div><pre class="gc2-output" id="gc2Out"></pre>
    </div>
    <div class="gc2-footer">
      <div id="gc2Status">พร้อมใช้งาน</div>
      <div style="display:flex;gap:8px;align-items:center;">
        <span style="font-size:10px;opacity:0.7;">Ctrl+Shift+H=Hacker | Ctrl+Shift+P=Passwords | Ctrl+Shift+X=XSS</span>
        <a href="https://x.com/omgnhoy" style="color:var(--accent);text-decoration:none;">@omgnhoy</a>
        <div id="gc2ThemeName" class="gc2-badge">Matrix</div>
      </div>
    </div>
  `;

  root.append(style, launcher, panel);
  document.documentElement.appendChild(host);

  // ensure panel has explicit left/top in px so dragging/clamping works (convert vw/vh defaults)
  (function ensurePanelPosition() {
    const r = panel.getBoundingClientRect();
    if (!panel.style.left && !panel.style.top) {
      panel.style.left = r.left + "px";
      panel.style.top = r.top + "px";
    }
    // launcher position explicit
    if (!launcher.style.right) launcher.style.right = "30px";
    if (!launcher.style.bottom) launcher.style.bottom = "30px";
  })();

  const $ = (sel) => root.querySelector(sel);
  const setStatus = (msg) => {
    const el = $("#gc2Status");
    if (el) el.textContent = String(msg);
  };
  const log = (msg) => {
    const out = $("#gc2Out");
    if (!out) return;
    out.textContent +=
      (typeof msg === "string" ? msg : JSON.stringify(msg, null, 2)) + "\n";
    out.scrollTop = out.scrollHeight;
  };

  const togglePanel = (show) => {
    const isVisible = panel.style.display === "flex";
    const showState = show === undefined ? !isVisible : show;
    panel.style.display = showState ? "flex" : "none";
    launcher.style.display = showState ? "none" : "flex";
  };

  launcher.addEventListener("click", () => togglePanel(true));
  $("#gc2Min")?.addEventListener("click", () => togglePanel(false));
  $("#gc2Close")?.addEventListener("click", () => {
    host.remove();
    WIN.__GOONEE_CONSOLE2__ = false;
  });

  const makeDraggable = (trigger, target) => {
    let activePointerId = -1,
      initialRect,
      sx,
      sy;
    const onPointerDown = (e) => {
      if (e.target.closest("button,select")) return;
      e.preventDefault();
      activePointerId = e.pointerId;
      initialRect = target.getBoundingClientRect();
      sx = e.clientX;
      sy = e.clientY;
      trigger.setPointerCapture(e.pointerId);
      WIN.addEventListener("pointermove", onPointerMove, { passive: false });
      WIN.addEventListener("pointerup", onPointerUp, { once: true });
      WIN.addEventListener("pointercancel", onPointerUp, { once: true });
    };
    const onPointerMove = (e) => {
      if (e.pointerId !== activePointerId) return;
      e.preventDefault();
      const dx = e.clientX - sx,
        dy = e.clientY - sy;
      // allow dragging partly off-screen but keep a small visible margin so the handle remains reachable
      const marginVisible = 48; // px visible when dragged off-screen
      let newLeft = initialRect.left + dx;
      let minLeft = -initialRect.width + marginVisible;
      let maxLeft = WIN.innerWidth - marginVisible;
      newLeft = Math.min(Math.max(newLeft, minLeft), maxLeft);

      let newTop = initialRect.top + dy;
      let minTop = -initialRect.height + marginVisible;
      let maxTop = WIN.innerHeight - marginVisible;
      newTop = Math.min(Math.max(newTop, minTop), maxTop);

      Object.assign(target.style, {
        left: newLeft + "px",
        top: newTop + "px",
        right: "auto",
        bottom: "auto",
      });
    };
    const onPointerUp = (e) => {
      if (e.pointerId !== activePointerId) return;
      activePointerId = -1;
      trigger.releasePointerCapture(e.pointerId);
      WIN.removeEventListener("pointermove", onPointerMove);
    };
    trigger.addEventListener("pointerdown", onPointerDown);
  };
  makeDraggable(launcher, launcher);
  makeDraggable($("#gc2Header"), panel);

  // เพิ่ม resizer 4 มุม
  const corners = [
    {
      name: "se",
      style: { right: "10px", bottom: "10px", cursor: "se-resize" },
      dx: 1,
      dy: 1,
    },
    {
      name: "sw",
      style: { left: "10px", bottom: "10px", cursor: "sw-resize" },
      dx: -1,
      dy: 1,
    },
    {
      name: "ne",
      style: { right: "2px", top: "2px", cursor: "ne-resize" },
      dx: 1,
      dy: -1,
    },
    {
      name: "nw",
      style: { left: "10px", top: "10px", cursor: "nw-resize" },
      dx: -1,
      dy: -1,
    },
  ];
  corners.forEach((corner) => {
    const resizer = document.createElement("div");
    resizer.className = "gc2-resizer gc2-resizer-" + corner.name;
    Object.assign(resizer.style, {
      position: "absolute",
      width: "28px",
      height: "28px",
      borderRadius: "6px",
      background: "linear-gradient(135deg, rgba(255,255,255,.04), transparent)",
      zIndex: 10,
      touchAction: "none",
      ...corner.style,
    });
    panel.appendChild(resizer);

    let activePointerId = -1,
      sx = 0,
      sy = 0,
      sw = 0,
      sh = 0,
      left0 = 0,
      top0 = 0;
    resizer.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      activePointerId = e.pointerId;
      sx = e.clientX;
      sy = e.clientY;
      const r = panel.getBoundingClientRect();
      sw = r.width;
      sh = r.height;
      left0 = parseFloat(panel.style.left) || r.left;
      top0 = parseFloat(panel.style.top) || r.top;
      try {
        resizer.setPointerCapture(activePointerId);
      } catch (e) {}
      WIN.addEventListener("pointermove", onPointerMove, { passive: false });
      WIN.addEventListener("pointerup", onPointerUp, { once: true });
      WIN.addEventListener("pointercancel", onPointerUp, { once: true });
    });
    function onPointerMove(e) {
      if (e.pointerId !== activePointerId) return;
      e.preventDefault();
      const dx = (e.clientX - sx) * corner.dx;
      const dy = (e.clientY - sy) * corner.dy;
      let newW = Math.max(200, sw + dx);
      let newH = Math.max(150, sh + dy);
      let newLeft = left0,
        newTop = top0;
      if (corner.dx < 0) newLeft = left0 - dx;
      if (corner.dy < 0) newTop = top0 - dy;
      Object.assign(panel.style, {
        width: newW + "px",
        height: newH + "px",
        left: newLeft + "px",
        top: newTop + "px",
        right: "auto",
        bottom: "auto",
      });
    }
    function onPointerUp(e) {
      if (e.pointerId !== activePointerId) return;
      activePointerId = -1;
      try {
        resizer.releasePointerCapture(e.pointerId);
      } catch (e) {}
      WIN.removeEventListener("pointermove", onPointerMove);
    }
  });

  const applyTheme = (t) => {
    if (!t) return;
    Object.keys(t).forEach(
      (k) => k !== "name" && host.style.setProperty(`--${k}`, t[k])
    );
    const el = $("#gc2ThemeName");
    if (el) el.textContent = t.name;
  };
  $("#gc2Theme")?.addEventListener("click", () => {
    const current = host.style.getPropertyValue("--accent").trim();
    const idx = THEMES.findIndex((t) => t.accent === current) ?? -1;
    const next = THEMES[(idx + 1) % THEMES.length];
    applyTheme(next);
    store.write(KEY_THEME, next);
    setStatus(`เปลี่ยนธีมเป็น ${next.name}`);
  });

  $("#gc2SaveLayout")?.addEventListener("click", () => {
    const r = panel.getBoundingClientRect();
    store.write(KEY_LAYOUT, {
      left: r.left + "px",
      top: r.top + "px",
      width: r.width + "px",
      height: r.height + "px",
    });
    setStatus("บันทึกตำแหน่งและขนาดแล้ว");
  });

  const codeEl = $("#gc2Code"),
    snipSel = $("#gc2Select");
  const readSnips = () => store.read(KEY_SNIPPETS, []),
    writeSnips = (list) => store.write(KEY_SNIPPETS, list);
  function refreshSelect() {
    if (!snipSel) return;
    const list = readSnips(),
      prev = snipSel.value;
    snipSel.innerHTML = "";
    list.forEach((it, i) => {
      const o = document.createElement("option");
      o.value = i;
      o.textContent = it.name || `สคริปต์ ${i + 1}`;
      snipSel.add(o);
    });
    if (list.length > 0) snipSel.value = prev;
    if (snipSel.selectedIndex === -1 && snipSel.options.length > 0)
      snipSel.selectedIndex = 0;
    snipSel.dispatchEvent(new Event("change"));
  }
  snipSel?.addEventListener("change", () => {
    const list = readSnips(),
      idx = snipSel.selectedIndex;
    if (list[idx] && codeEl) codeEl.value = list[idx].code || "";
  });

  $("#gc2Run")?.addEventListener("click", () => {
    if (!codeEl) return;
    const code = codeEl.value.trim();
    if (!code) return setStatus("ไม่มีโค้ดให้รัน");
    const src = code.startsWith("javascript:") ? code.slice(11) : code;
    setStatus("กำลังรัน...");
    try {
      const ret = new Function(src)();
      if (typeof ret !== "undefined") log(ret);
      setStatus("รันโค้ดเสร็จสิ้น");
    } catch (err) {
      log(err.stack || String(err));
      setStatus("เกิดข้อผิดพลาด");
    }
  });
  $("#gc2Save")?.addEventListener("click", () => {
    if (!codeEl) return;
    const code = codeEl.value.trim();
    if (!code) return setStatus("ไม่มีโค้ดให้บันทึก");
    const name = prompt("ตั้งชื่อสคริปต์:", `สคริปต์ ${Date.now() % 1000}`);
    if (name === null) return setStatus("ยกเลิกการบันทึก");
    const list = readSnips();
    list.push({ name: String(name || "สคริปต์"), code });
    writeSnips(list);
    refreshSelect();
    snipSel.value = list.length - 1;
    setStatus(`บันทึก "${name}" แล้ว`);
  });
  $("#gc2Del")?.addEventListener("click", () => {
    if (!snipSel || snipSel.selectedIndex < 0) return;
    const list = readSnips(),
      idx = snipSel.selectedIndex,
      target = list[idx];
    if (!target || !confirm(`ลบสคริปต์ "${target.name}"?`))
      return setStatus("ยกเลิกการลบ");
    list.splice(idx, 1);
    writeSnips(list);
    refreshSelect();
    if (codeEl) codeEl.value = "";
    setStatus(`ลบ "${target.name}" แล้ว`);
  });

  $("#gc2UnlockForms")?.addEventListener("click", () => {
    let count = 0;
    document.querySelectorAll("input,textarea,select,button").forEach((el) => {
      if (el.disabled || el.readOnly) {
        el.disabled = false;
        el.readOnly = false;
        count++;
      }
    });
    setStatus(`ปลดล็อค ${count} ฟอร์ม`);
  });
  $("#gc2EditPage")?.addEventListener("click", (e) => {
    const btn = e.target,
      isEditing = document.body.contentEditable === "true";
    document.body.contentEditable = !isEditing;
    Object.assign(btn.style, {
      background: isEditing ? "" : "#00ff41",
      color: isEditing ? "" : "#001a0a",
    });
    setStatus(isEditing ? "ปิดโหมดแก้ไขเว็บ" : "เปิดโหมดแก้ไขเว็บ");
  });
  $("#gc2Eruda")?.addEventListener("click", async () => {
    setStatus("กำลังโหลด Eruda...");
    try {
      if (!WIN.eruda)
        await new Promise((res, rej) => {
          const s = document.createElement("script");
          s.src = "https://cdn.jsdelivr.net/npm/eruda";
          s.onload = res;
          s.onerror = rej;
          document.head.append(s);
        });
      WIN.eruda.init();
      WIN.eruda.show();
      store.write(KEY_ERUDA, true);
      setStatus("Eruda พร้อมใช้งาน");
    } catch (err) {
      setStatus("โหลด Eruda ไม่สำเร็จ");
    }
  });
  $("#gc2SwKill")?.addEventListener("click", async () => {
    if (!navigator.serviceWorker) return setStatus("ไม่รองรับ Service Worker");
    try {
      const regs = await navigator.serviceWorker.getRegistrations(),
        count = regs.length;
      await Promise.all(regs.map((r) => r.unregister()));
      setStatus(`ล้าง Service Worker ${count} ตัวสำเร็จ`);
    } catch (err) {
      setStatus("ล้าง SW ไม่สำเร็จ");
    }
  });

  // 🔥 HACKER TOOLS - Advanced Features
  $("#gc2ShowPasswords")?.addEventListener("click", () => {
    let count = 0;
    document.querySelectorAll('input[type="password"]').forEach((input) => {
      input.type = "text";
      input.style.background = "#ff000020";
      input.style.border = "2px solid #ff0000";
      count++;
    });
    log(`🔓 เปิดเผยรหัสผ่าน ${count} ช่อง`);
    setStatus(`แสดงรหัสผ่าน ${count} ช่อง`);
  });

  $("#gc2RemoveCSS")?.addEventListener("click", () => {
    let count = 0;
    document.querySelectorAll('style, link[rel="stylesheet"]').forEach((el) => {
      el.remove();
      count++;
    });
    document.body.style.background = "#000";
    document.body.style.color = "#00ff00";
    log(`🎭 ลบ CSS ${count} ไฟล์ - เปิดโหมดแฮ็กเกอร์`);
    setStatus(`ลบ CSS ${count} ไฟล์`);
  });

  let matrixInterval;
  $("#gc2Matrix")?.addEventListener("click", () => {
    if (matrixInterval) {
      clearInterval(matrixInterval);
      matrixInterval = null;
      document.body.style.background = "";
      setStatus("ปิด Matrix Effect");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.style.cssText =
      "position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:999999;pointer-events:none;background:#000";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars =
      "กขคงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*(){}[]<>?/|\\~`";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    matrixInterval = setInterval(() => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00ff41";
      ctx.font = fontSize + "px monospace";

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }, 35);

    log("🌊 Matrix Effect เปิดใช้งาน - คลิกอีกครั้งเพื่อปิด");
    setStatus("Matrix Effect ON");
  });

  $("#gc2XSSTest")?.addEventListener("click", () => {
    const payloads = [
      '<script>alert("XSS by Goonee!")</script>',
      '<img src=x onerror=alert("XSS")>',
      'javascript:alert("XSS")',
      '<svg onload=alert("XSS")>',
      '"><script>alert("XSS")</script>',
    ];

    const payload = payloads[Math.floor(Math.random() * payloads.length)];

    // Test in all input fields
    let tested = 0;
    document.querySelectorAll("input, textarea").forEach((input) => {
      if (input.type !== "password" && input.type !== "file") {
        input.value = payload;
        input.style.background = "#ffff0020";
        input.style.border = "2px solid #ffff00";
        tested++;
      }
    });

    log(`⚡ XSS Payload ฉีดเข้า ${tested} ช่อง: ${payload}`);
    setStatus(`ทดสอบ XSS ใน ${tested} ช่อง`);
  });

  $("#gc2CookieHack")?.addEventListener("click", () => {
    const cookies = document.cookie;
    if (!cookies) {
      log("🍪 ไม่พบ Cookie ในเว็บนี้");
      setStatus("ไม่มี Cookie");
      return;
    }

    log("🍪 Cookie ที่พบ:");
    cookies.split(";").forEach((cookie) => {
      const [name, value] = cookie.trim().split("=");
      log(`  ${name} = ${value}`);
    });

    // Try to steal session cookies
    const sessionCookies = cookies
      .split(";")
      .filter(
        (c) =>
          c.toLowerCase().includes("session") ||
          c.toLowerCase().includes("auth") ||
          c.toLowerCase().includes("token")
      );

    if (sessionCookies.length > 0) {
      log("🚨 พบ Session Cookie ที่อาจสำคัญ:");
      sessionCookies.forEach((cookie) => log(`  ⚠️ ${cookie.trim()}`));
    }

    setStatus(`พบ Cookie ${cookies.split(";").length} ตัว`);
  });

  $("#gc2DOMSpy")?.addEventListener("click", () => {
    const forms = document.querySelectorAll("form");
    const inputs = document.querySelectorAll("input");
    const scripts = document.querySelectorAll("script");
    const iframes = document.querySelectorAll("iframe");

    log("🔍 DOM Spy Report:");
    log(`📝 Forms: ${forms.length}`);
    forms.forEach((form, i) => {
      log(`  Form ${i + 1}: action="${form.action}" method="${form.method}"`);
    });

    log(`📋 Inputs: ${inputs.length}`);
    const inputTypes = {};
    inputs.forEach((input) => {
      inputTypes[input.type] = (inputTypes[input.type] || 0) + 1;
      if (input.name) log(`  ${input.type}: name="${input.name}"`);
    });

    log(`📜 Scripts: ${scripts.length}`);
    scripts.forEach((script, i) => {
      if (script.src) log(`  Script ${i + 1}: ${script.src}`);
    });

    log(`🖼️ iFrames: ${iframes.length}`);
    iframes.forEach((iframe, i) => {
      log(`  iFrame ${i + 1}: ${iframe.src}`);
    });

    // Check for common vulnerabilities
    const vulns = [];
    if (
      document.querySelector('input[type="password"]:not([autocomplete="off"])')
    ) {
      vulns.push("Password fields without autocomplete=off");
    }
    if (document.querySelector('form:not([method="post"])')) {
      vulns.push("Forms using GET method");
    }
    if (scripts.length > 10) {
      vulns.push("High number of scripts (potential XSS risk)");
    }

    if (vulns.length > 0) {
      log("⚠️ Potential Vulnerabilities:");
      vulns.forEach((vuln) => log(`  🚨 ${vuln}`));
    }

    setStatus("DOM Spy สำเร็จ");
  });

  let networkSniffer = null;
  $("#gc2NetSniffer")?.addEventListener("click", () => {
    if (networkSniffer) {
      networkSniffer = null;
      setStatus("ปิด Network Sniffer");
      log("📡 Network Sniffer ปิดแล้ว");
      return;
    }

    // Intercept fetch
    const originalFetch = window.fetch;
    window.fetch = function (...args) {
      const url = args[0];
      const options = args[1] || {};

      log(`📡 FETCH: ${options.method || "GET"} ${url}`);
      if (options.headers) {
        log(`  Headers: ${JSON.stringify(options.headers)}`);
      }
      if (options.body) {
        log(`  Body: ${options.body}`);
      }

      return originalFetch
        .apply(this, args)
        .then((response) => {
          log(`📡 RESPONSE: ${response.status} ${response.statusText}`);
          return response;
        })
        .catch((error) => {
          log(`📡 ERROR: ${error.message}`);
          throw error;
        });
    };

    // Intercept XMLHttpRequest
    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function () {
      const xhr = new originalXHR();
      const originalOpen = xhr.open;
      const originalSend = xhr.send;

      xhr.open = function (method, url, ...args) {
        log(`📡 XHR: ${method} ${url}`);
        return originalOpen.apply(this, [method, url, ...args]);
      };

      xhr.send = function (data) {
        if (data) log(`  Data: ${data}`);
        return originalSend.apply(this, [data]);
      };

      return xhr;
    };

    networkSniffer = true;
    log("📡 Network Sniffer เปิดใช้งาน - ติดตามการส่งข้อมูลทั้งหมด");
    setStatus("Network Sniffer ON");
  });

  $("#gc2JSInject")?.addEventListener("click", () => {
    const jsCode = prompt(
      "ใส่ JavaScript Code ที่ต้องการฉีด:",
      'alert("Hacked by Goonee!");'
    );
    if (!jsCode) return;

    try {
      // Create script element
      const script = document.createElement("script");
      script.textContent = jsCode;
      document.head.appendChild(script);

      log(`💉 ฉีด JavaScript สำเร็จ: ${jsCode}`);
      setStatus("ฉีด JS สำเร็จ");
    } catch (error) {
      log(`💉 ฉีด JavaScript ล้มเหลว: ${error.message}`);
      setStatus("ฉีด JS ล้มเหลว");
    }
  });

  $("#gc2PhishKit")?.addEventListener("click", () => {
    const target = prompt("เลือกเว็บไซต์ที่จะจำลอง:", "facebook.com");
    if (!target) return;

    // Create phishing overlay
    const overlay = document.createElement("div");
    overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0,0,0,0.95);
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-family: Arial, sans-serif;
      `;

    overlay.innerHTML = `
          <div style="background: #1877f2; padding: 40px; border-radius: 8px; text-align: center; max-width: 400px;">
              <h2>🔒 Security Check Required</h2>
              <p>Please verify your ${target} credentials to continue:</p>
              <input type="text" placeholder="Username/Email" style="width: 100%; padding: 10px; margin: 10px 0; border: none; border-radius: 4px;">
              <input type="password" placeholder="Password" style="width: 100%; padding: 10px; margin: 10px 0; border: none; border-radius: 4px;">
              <button onclick="this.parentElement.parentElement.remove(); alert('Credentials captured! (Demo only)');" 
                      style="background: #42b883; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; width: 100%; margin: 10px 0;">
                  Verify Account
              </button>
              <button onclick="this.parentElement.parentElement.remove();" 
                      style="background: #666; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                  Cancel
              </button>
              <p style="font-size: 12px; color: #ccc; margin-top: 20px;">⚠️ This is a DEMO phishing page for educational purposes only!</p>
          </div>
      `;

    document.body.appendChild(overlay);

    log(`🎣 สร้าง Phishing Page จำลอง ${target} (เพื่อการศึกษาเท่านั้น)`);
    setStatus("Phishing Demo สร้างแล้ว");
  });

  // 🔥 Advanced Keyboard Shortcuts
  WIN.addEventListener("keydown", (e) => {
    // Ctrl+` = Toggle console
    if ((e.ctrlKey || e.metaKey) && e.key === "`") {
      togglePanel();
      e.preventDefault();
    }

    // Ctrl+Shift+H = Hacker Mode (remove all CSS + Matrix)
    if (e.ctrlKey && e.shiftKey && e.key === "H") {
      $("#gc2RemoveCSS")?.click();
      setTimeout(() => $("#gc2Matrix")?.click(), 500);
      e.preventDefault();
    }

    // Ctrl+Shift+P = Show all passwords
    if (e.ctrlKey && e.shiftKey && e.key === "P") {
      $("#gc2ShowPasswords")?.click();
      e.preventDefault();
    }

    // Ctrl+Shift+X = XSS Test
    if (e.ctrlKey && e.shiftKey && e.key === "X") {
      $("#gc2XSSTest")?.click();
      e.preventDefault();
    }
  });

  WIN.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "`") {
      togglePanel();
      e.preventDefault();
    }
  });

  WIN.GO2 = {
    open: () => togglePanel(true),
    close: () => togglePanel(false),
    toggle: togglePanel,
  };

  (() => {
    applyTheme(store.read(KEY_THEME) || THEMES[0]);
    const layout = store.read(KEY_LAYOUT);
    if (layout) Object.assign(panel.style, layout);
    refreshSelect();
    if (store.read(KEY_ERUDA)) $("#gc2Eruda")?.click();
  })();
})();
