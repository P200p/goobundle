// @ts-nocheck
// Enhanced Goonee Hacker Console v2.0
(function () {
  "use strict";

  // Determine base origin from current script
  const currentScript =
    document.currentScript ||
    (function () {
      const s = document.getElementsByTagName("script");
      return s[s.length - 1];
    })();
  const BASE_URL = (function () {
    try {
      const base =
        currentScript && currentScript.src
          ? new URL(currentScript.src, location.href)
          : new URL(location.href);
      return new URL("./", base).href.replace(/\/$/, "/");
    } catch (e) {
      return "";
    }
  })();

  // Expose for other modules
  try {
    window.__HC_BASE_URL = BASE_URL;
  } catch (_) {}

  function ensureStyle() {
    const d = document;
    if (!d.querySelector("link[data-hc-style]")) {
      const link = d.createElement("link");
      link.rel = "stylesheet";
      link.href = BASE_URL + "go-style.css?t=" + Date.now();
      link.setAttribute("data-hc-style", "1");
      link.onload = function () {
        /* stylesheet loaded */
      };
      link.onerror = function () {
        try {
          injectFallbackCSS();
        } catch (_) {}
        console.warn(
          "[HC] go-style.css failed to load, applied minimal inline styles as fallback"
        );
      };
      d.head.appendChild(link);
      try {
        injectFallbackCSS();
      } catch (_) {}
    }
  }

  function injectFallbackCSS() {
    if (document.getElementById("__hc_fallback_css")) return;
    const s = document.createElement("style");
    s.id = "__hc_fallback_css";
    s.textContent = `
      :root {
        --accent: #00ff41;
        --accent2: #00cc33;
        --accentText: #00ffc3;
        --bgPanel: rgba(0,0,0,.98);
        --bgInput: #002200;
        --bgOutput: #001b12;
        --status: #00ff83;
        --warning: #ffaa00;
        --error: #ff6b6b;
        --success: #00ff88;
      }
      
      .go-matrix-bg {
        position: fixed;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        opacity: .08;
        z-index: 0;
        background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
      }
      
      .go-console-panel {
        position: fixed;
        top: 24px;
        left: 24px;
        width: 480px;
        height: 400px;
        background: var(--bgPanel);
        border: 2px solid var(--accent);
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,255,65,.3), 0 0 20px rgba(0,255,65,.1);
        z-index: 100000;
        min-width: 320px;
        min-height: 200px;
        overflow: hidden;
        resize: both;
        backdrop-filter: blur(10px);
        font-family: 'Fira Code', 'Consolas', monospace;
      }
      
      .go-console-header {
        background: linear-gradient(135deg, var(--accent), var(--accent2));
        color: #001a0a;
        padding: 12px 16px;
        cursor: move;
        display: flex;
        gap: 8px;
        justify-content: space-between;
        align-items: center;
        font-weight: 700;
        user-select: none;
        touch-action: none;
        border-radius: 10px 10px 0 0;
      }
      
      .go-console-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
      }
      
      .glitch {
        animation: glitch 2s infinite;
      }
      
      @keyframes glitch {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-1px); }
        40% { transform: translateX(1px); }
        60% { transform: translateX(-1px); }
        80% { transform: translateX(1px); }
      }
      
      .go-console-controls { 
        display: flex; 
        gap: 8px; 
      }
      
      .go-console-body {
        height: calc(100% - 48px);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      
      .go-toolbar {
        background: rgba(0,255,65,.1);
        padding: 8px;
        border-bottom: 1px solid var(--accent);
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
        overflow-x: auto;
      }
      
      .go-btn {
        background: rgba(0,255,65,.2);
        border: 1px solid var(--accent);
        color: var(--accentText);
        padding: 6px 10px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 600;
        transition: all 0.2s ease;
        white-space: nowrap;
        font-family: inherit;
      }
      
      .go-btn:hover {
        background: rgba(0,255,65,.3);
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0,255,65,.2);
      }
      
      .go-btn:active {
        transform: translateY(0);
      }
      
      .go-btn.danger {
        background: rgba(255,107,107,.2);
        border-color: var(--error);
        color: #ffcccc;
      }
      
      .go-btn.danger:hover {
        background: rgba(255,107,107,.3);
      }
      
      .go-btn.success {
        background: rgba(0,255,136,.2);
        border-color: var(--success);
        color: #ccffdd;
      }
      
      .go-main-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 12px;
        gap: 8px;
        overflow: auto;
      }
      
      .go-section-title {
        color: #61ffa7;
        font-size: 13px;
        font-weight: 600;
        margin-bottom: 4px;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      
      .go-code-input {
        background: var(--bgInput);
        border: 1px solid var(--accent);
        color: #d6ffe8;
        padding: 10px;
        border-radius: 8px;
        font-size: 13px;
        min-height: 80px;
        max-height: 200px;
        width: 100%;
        box-sizing: border-box;
        resize: vertical;
        overflow: auto;
        font-family: 'Fira Code', 'Consolas', monospace;
        line-height: 1.4;
      }
      
      .go-code-input:focus {
        outline: none;
        border-color: var(--accent2);
        box-shadow: 0 0 10px rgba(0,255,65,.2);
      }
      
      .go-output {
        background: var(--bgOutput);
        border: 1px solid var(--accent);
        color: #aaffd6;
        padding: 10px;
        border-radius: 8px;
        font-size: 12px;
        white-space: pre-wrap;
        overflow: auto;
        min-height: 80px;
        max-height: 150px;
        width: 100%;
        box-sizing: border-box;
        resize: vertical;
        font-family: 'Fira Code', 'Consolas', monospace;
        line-height: 1.4;
      }
      
      .go-status-bar {
        background: rgba(0,255,65,.08);
        padding: 8px 12px;
        border-top: 1px solid var(--accent);
        font-size: 11px;
        color: var(--status);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .go-resize-handle {
        position: absolute;
        width: 16px;
        height: 16px;
        background: linear-gradient(-45deg,transparent 40%,var(--accent) 40%,var(--accent) 60%,transparent 60%);
        touch-action: none;
        opacity: 0.7;
        transition: opacity 0.2s ease;
      }
      
      .go-resize-handle:hover {
        opacity: 1;
      }
      
      #resizeSE { right: 0; bottom: 0; cursor: se-resize; }
      #resizeSW { left: 0;  bottom: 0; cursor: sw-resize; }
      #resizeNE { right: 0; top: 0;    cursor: ne-resize; }
      #resizeNW { left: 0;  top: 0;    cursor: nw-resize; }
      
      .go-tabs {
        display: flex;
        background: rgba(0,255,65,.05);
        border-bottom: 1px solid var(--accent);
      }
      
      .go-tab {
        padding: 8px 16px;
        cursor: pointer;
        border-right: 1px solid rgba(0,255,65,.2);
        color: var(--accentText);
        font-size: 12px;
        font-weight: 600;
        transition: all 0.2s ease;
      }
      
      .go-tab:hover {
        background: rgba(0,255,65,.1);
      }
      
      .go-tab.active {
        background: rgba(0,255,65,.2);
        color: var(--accent);
      }
      
      .go-tab-content {
        display: none;
        flex: 1;
        flex-direction: column;
        overflow: auto;
      }
      
      .go-tab-content.active {
        display: flex;
      }
      
      .go-network-monitor {
        font-size: 11px;
        max-height: 120px;
        overflow-y: auto;
        background: var(--bgOutput);
        border: 1px solid var(--accent);
        border-radius: 6px;
        padding: 8px;
      }
      
      .go-network-item {
        padding: 2px 0;
        border-bottom: 1px solid rgba(0,255,65,.1);
        color: #aaffd6;
      }
      
      .go-network-item:last-child {
        border-bottom: none;
      }
      
      .go-quick-actions {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 6px;
        margin-top: 8px;
      }
      
      .go-action-btn {
        background: rgba(0,255,65,.15);
        border: 1px solid var(--accent);
        color: var(--accentText);
        padding: 8px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 11px;
        text-align: center;
        transition: all 0.2s ease;
      }
      
      .go-action-btn:hover {
        background: rgba(0,255,65,.25);
        transform: scale(1.02);
      }
      
      @media (max-width: 768px) {
        .go-console-panel {
          top: 2vh;
          left: 2vw;
          width: 96vw;
          height: 70vh;
          border-radius: 8px;
        }
        
        .go-toolbar {
          gap: 4px;
          overflow-x: auto;
          white-space: nowrap;
          -webkit-overflow-scrolling: touch;
        }
        
        .go-btn {
          padding: 8px 12px;
          font-size: 13px;
        }
        
        .go-main-content {
          padding: 8px;
          gap: 6px;
        }
        
        .go-tabs {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        
        .go-tab {
          white-space: nowrap;
          min-width: 80px;
        }
      }
    `;
    document.head.appendChild(s);
  }

  function injectHTML() {
    const d = document;
    if (!d.getElementById("matrixCanvas")) {
      const canvas = d.createElement("canvas");
      canvas.className = "go-matrix-bg";
      canvas.id = "matrixCanvas";
      d.body.appendChild(canvas);
      initMatrix(canvas);
    }

    if (d.getElementById("consolePanel")) return;

    const panel = d.createElement("div");
    panel.className = "go-console-panel";
    panel.id = "consolePanel";
    panel.innerHTML = `
      <div class="go-console-header" id="consoleHeader">
        <div class="go-console-title">
          <span>🔧</span>
          <span class="glitch">Goonee Hacker Console v2.0</span>
        </div>
        <div class="go-console-controls">
          <button class="go-btn" title="Minimize/Restore" onclick="minimizeConsole()">−</button>
          <button class="go-btn" title="Maximize" onclick="maximizeConsole()">□</button>
          <button class="go-btn danger" onclick="closeConsole()">×</button>
        </div>
      </div>
      <div class="go-console-body">
        <div class="go-toolbar">
          <button class="go-btn success" onclick="runBookmarklet()">▶️ Run</button>
          <button class="go-btn" onclick="clearCode()">🧹 Clear</button>
          <button class="go-btn" onclick="copyOutput()">📋 Copy</button>
          <button class="go-btn" onclick="saveSnippet()">💾 Save</button>
          <button class="go-btn" onclick="randomTheme()">🎨 Theme</button>
          <button class="go-btn" onclick="toggleNetworkMonitor()">📡 Network</button>
          <button class="go-btn" onclick="injectCSS()">🎭 Inject CSS</button>
          <button class="go-btn" onclick="domInspector()">🔍 DOM</button>
          <button class="go-btn" onclick="toggleEruda()">🧪 Eruda</button>
          <select class="go-btn" id="snippetSelect" title="Saved snippets"></select>
          <button class="go-btn" onclick="loadSnippet()">⤴️ Load</button>
          <button class="go-btn danger" onclick="deleteSnippet()">🗑️ Delete</button>
        </div>
        
        <div class="go-tabs">
          <div class="go-tab active" onclick="switchTab('code')">📝 Code</div>
          <div class="go-tab" onclick="switchTab('tools')">🛠️ Tools</div>
          <div class="go-tab" onclick="switchTab('network')">📡 Network</div>
          <div class="go-tab" onclick="switchTab('settings')">⚙️ Settings</div>
        </div>
        
        <div class="go-main-content">
          <div class="go-tab-content active" id="tab-code">
            <div class="bookmarklet-section">
              <div class="go-section-title">📋 JavaScript Code</div>
              <textarea class="go-code-input" id="codeInput" placeholder="// Your JavaScript code here
console.log('Hello from Goonee Console!');

// Quick examples:
// document.body.style.background = 'red';
// alert('Hacked!');
// window.location.href = 'https://example.com';"></textarea>
            </div>
            <div class="bookmarklet-section">
              <div class="go-section-title">🧾 Output</div>
              <pre class="go-output" id="outputLog"></pre>
            </div>
          </div>
          
          <div class="go-tab-content" id="tab-tools">
            <div class="go-section-title">🛠️ Quick Actions</div>
            <div class="go-quick-actions">
              <div class="go-action-btn" onclick="quickAction('viewSource')">📄 View Source</div>
              <div class="go-action-btn" onclick="quickAction('editPage')">✏️ Edit Page</div>
              <div class="go-action-btn" onclick="quickAction('removeCSS')">🚫 Remove CSS</div>
              <div class="go-action-btn" onclick="quickAction('showPasswords')">👁️ Show Passwords</div>
              <div class="go-action-btn" onclick="quickAction('highlightLinks')">🔗 Highlight Links</div>
              <div class="go-action-btn" onclick="quickAction('extractImages')">🖼️ Extract Images</div>
              <div class="go-action-btn" onclick="quickAction('cookieViewer')">🍪 View Cookies</div>
              <div class="go-action-btn" onclick="quickAction('localStorageViewer')">💾 Local Storage</div>
            </div>
          </div>
          
          <div class="go-tab-content" id="tab-network">
            <div class="go-section-title">📡 Network Monitor</div>
            <div class="go-network-monitor" id="networkMonitor">
              Network monitoring disabled. Click "📡 Network" to enable.
            </div>
          </div>
          
          <div class="go-tab-content" id="tab-settings">
            <div class="go-section-title">⚙️ Console Settings</div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <button class="go-btn" onclick="saveLayout()">💾 Save Layout</button>
              <button class="go-btn" onclick="loadLayout()">⤴️ Load Layout</button>
              <button class="go-btn" onclick="resetConsole()">↺ Reset Console</button>
              <button class="go-btn" onclick="exportSettings()">📤 Export Settings</button>
              <button class="go-btn" onclick="importSettings()">📥 Import Settings</button>
            </div>
          </div>
        </div>
        
        <div class="go-status-bar">
          <span id="statusText">Ready • Drag to move • Resize from corners</span>
          <span id="timeDisplay"></span>
        </div>
      </div>
      <div class="go-resize-handle" id="resizeNW"></div>
      <div class="go-resize-handle" id="resizeNE"></div>
      <div class="go-resize-handle" id="resizeSW"></div>
      <div class="go-resize-handle" id="resizeSE"></div>
    `;
    document.body.appendChild(panel);

    // Initialize drag & resize handlers
    initDragResize(panel);
  }

  // Enhanced Matrix Animation
  function initMatrix(canvas) {
    const ctx = canvas.getContext("2d");

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    window.addEventListener("resize", resize);
    resize();

    const chars =
      "マアマラワソカユイワルミヤABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*(){}[]<>?/|\\~`";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    function draw() {
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

      requestAnimationFrame(draw);
    }

    draw();
  }

  // Enhanced drag and resize functionality
  function initDragResize(panel) {
    const header = panel.querySelector("#consoleHeader");
    let drag = { on: false, sx: 0, sy: 0, l: 0, t: 0 };

    if (header) {
      header.addEventListener("pointerdown", (e) => {
        if (e.target.tagName === "BUTTON") return;
        const ev = e;
        if (ev.button !== 0) return;
        drag.on = true;
        drag.sx = ev.clientX;
        drag.sy = ev.clientY;
        const r = panel.getBoundingClientRect();
        drag.l = r.left;
        drag.t = r.top;
        try {
          header.setPointerCapture(ev.pointerId);
        } catch (_) {}
        e.preventDefault();
      });

      header.addEventListener("pointermove", (e) => {
        e.preventDefault();
        if (!drag.on) return;
        const ev = e;
        const dx = ev.clientX - drag.sx;
        const dy = ev.clientY - drag.sy;
        panel.style.left = drag.l + dx + "px";
        panel.style.top = drag.t + dy + "px";
      });

      header.addEventListener("pointerup", () => {
        drag.on = false;
      });
      header.addEventListener("pointercancel", () => {
        drag.on = false;
      });
    }

    // Setup resize handles
    const setupHandle = (el, dir) => {
      if (!el) return;
      let rs = { on: false, sx: 0, sy: 0, w: 0, h: 0, l: 0, t: 0 };

      el.addEventListener("pointerdown", (e) => {
        const ev = e;
        if (ev.button !== 0) return;
        rs.on = true;
        rs.sx = ev.clientX;
        rs.sy = ev.clientY;
        const r = panel.getBoundingClientRect();
        rs.w = r.width;
        rs.h = r.height;
        rs.l = r.left;
        rs.t = r.top;
        try {
          el.setPointerCapture(ev.pointerId);
        } catch (_) {}
        e.preventDefault();
      });

      el.addEventListener("pointermove", (e) => {
        e.preventDefault();
        if (!rs.on) return;
        const ev = e;
        const dx = ev.clientX - rs.sx;
        const dy = ev.clientY - rs.sy;
        let newW = rs.w,
          newH = rs.h,
          newL = rs.l,
          newT = rs.t;
        const MIN_W = 320,
          MIN_H = 200;

        if (dir.includes("E")) newW = Math.max(MIN_W, rs.w + dx);
        if (dir.includes("S")) newH = Math.max(MIN_H, rs.h + dy);
        if (dir.includes("W")) {
          newW = Math.max(MIN_W, rs.w - dx);
          newL = rs.l + (rs.w - newW);
        }
        if (dir.includes("N")) {
          newH = Math.max(MIN_H, rs.h - dy);
          newT = rs.t + (rs.h - newH);
        }

        panel.style.width = newW + "px";
        panel.style.height = newH + "px";
        panel.style.left = newL + "px";
        panel.style.top = newT + "px";
      });

      el.addEventListener("pointerup", () => {
        rs.on = false;
      });
      el.addEventListener("pointercancel", () => {
        rs.on = false;
      });
    };

    setupHandle(panel.querySelector("#resizeSE"), "SE");
    setupHandle(panel.querySelector("#resizeSW"), "SW");
    setupHandle(panel.querySelector("#resizeNE"), "NE");
    setupHandle(panel.querySelector("#resizeNW"), "NW");
  }

  function getPanel() {
    return document.getElementById("consolePanel");
  }

  function showConsole() {
    const panel = getPanel();
    if (panel) {
      panel.style.display = "block";
      try {
        initPanelExtras();
      } catch (_) {}
      return;
    }
    ensureStyle();
    injectHTML();
    try {
      initPanelExtras();
    } catch (_) {}

    // Apply mobile size if needed
    try {
      const p = getPanel();
      if (p && window.innerWidth <= 768) {
        p.style.width = "96vw";
        p.style.height = "70vh";
        p.style.left = "2vw";
        p.style.top = "2vh";
      }
    } catch (_) {}
  }

  function hideConsole() {
    const panel = getPanel();
    if (panel) {
      panel.style.display = "none";
    }
  }

  function toggleConsole() {
    const panel = getPanel();
    if (!panel) {
      showConsole();
      return;
    }
    panel.style.display =
      panel.style.display === "none" ||
      getComputedStyle(panel).display === "none"
        ? "block"
        : "none";
    if (panel.style.display === "block") panel.focus();
  }

  // Public API
  window.launchConsole = showConsole;
  window.showConsole = showConsole;
  window.hideConsole = hideConsole;
  window.toggleConsole = toggleConsole;

  // Keyboard shortcut: Ctrl+`
  if (!window.__hcShortcutBound) {
    window.__hcShortcutBound = true;
    window.addEventListener("keydown", function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "`") {
        e.preventDefault();
        toggleConsole();
      }
    });
  }

  // Enhanced logging with timestamps
  function logOutput(msg) {
    try {
      const out = document.getElementById("outputLog");
      if (!out) return;
      const timestamp = new Date().toLocaleTimeString();
      const line = `[${timestamp}] ${
        typeof msg === "string" ? msg : JSON.stringify(msg, null, 2)
      }`;
      out.textContent += line + "\n";
      out.scrollTop = out.scrollHeight;
    } catch (_) {}
  }

  // Global functions
  const G = window;

  // Tab switching
  G.switchTab = function (tabName) {
    const tabs = document.querySelectorAll(".go-tab");
    const contents = document.querySelectorAll(".go-tab-content");

    tabs.forEach((tab) => tab.classList.remove("active"));
    contents.forEach((content) => content.classList.remove("active"));

    const activeTab = Array.from(tabs).find((tab) =>
      tab.textContent.includes(
        tabName === "code"
          ? "Code"
          : tabName === "tools"
          ? "Tools"
          : tabName === "network"
          ? "Network"
          : "Settings"
      )
    );
    const activeContent = document.getElementById(`tab-${tabName}`);

    if (activeTab) activeTab.classList.add("active");
    if (activeContent) activeContent.classList.add("active");
  };

  // Enhanced run function with better error handling
  G.runBookmarklet = function () {
    try {
      const ta = document.getElementById("codeInput");
      const status = document.getElementById("statusText");
      let code = "";
      if (ta instanceof HTMLTextAreaElement) {
        code = ta.value.trim();
      }
      if (!code) {
        if (status) status.textContent = "No code to run";
        return;
      }

      if (status) status.textContent = "Running…";

      // Support bookmarklet format
      const src = code.startsWith("javascript:")
        ? code.slice("javascript:".length)
        : code;

      try {
        // Create a safer evaluation context
        const result = (function () {
          return eval(src);
        })();

        if (typeof result !== "undefined") {
          logOutput(`Result: ${result}`);
        } else {
          logOutput("Code executed successfully");
        }

        if (status) status.textContent = "Done ✓";
      } catch (err) {
        const errorMsg = err && err.stack ? err.stack : String(err);
        logOutput(`Error: ${errorMsg}`);
        if (status) status.textContent = "Error ✗";
      }
    } catch (err) {
      logOutput(`Console Error: ${err && err.stack ? err.stack : String(err)}`);
    }
  };

  // Quick actions
  G.quickAction = function (action) {
    const status = document.getElementById("statusText");

    try {
      switch (action) {
        case "viewSource":
          const sourceWin = window.open("", "_blank");
          sourceWin.document.write(
            `<pre>${document.documentElement.outerHTML
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")}</pre>`
          );
          logOutput("Page source opened in new window");
          break;

        case "editPage":
          document.designMode = document.designMode === "on" ? "off" : "on";
          logOutput(`Edit mode: ${document.designMode}`);
          break;

        case "removeCSS":
          const styles = document.querySelectorAll(
            'style, link[rel="stylesheet"]'
          );
          styles.forEach((s) => s.remove());
          logOutput(`Removed ${styles.length} stylesheets`);
          break;

        case "showPasswords":
          const passwords = document.querySelectorAll('input[type="password"]');
          passwords.forEach((p) => (p.type = "text"));
          logOutput(`Revealed ${passwords.length} password fields`);
          break;

        case "highlightLinks":
          const links = document.querySelectorAll("a");
          links.forEach((link) => {
            link.style.background = "#ffff00";
            link.style.border = "2px solid #ff0000";
          });
          logOutput(`Highlighted ${links.length} links`);
          break;

        case "extractImages":
          const images = Array.from(document.querySelectorAll("img")).map(
            (img) => img.src
          );
          logOutput(`Found ${images.length} images:\n${images.join("\n")}`);
          break;

        case "cookieViewer":
          logOutput(`Cookies:\n${document.cookie || "No cookies found"}`);
          break;

        case "localStorageViewer":
          const storage = {};
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            storage[key] = localStorage.getItem(key);
          }
          logOutput(`Local Storage:\n${JSON.stringify(storage, null, 2)}`);
          break;

        default:
          logOutput(`Unknown action: ${action}`);
      }

      if (status) status.textContent = `Action: ${action} completed`;
    } catch (err) {
      logOutput(`Action error: ${err.message}`);
      if (status) status.textContent = `Action failed: ${action}`;
    }
  };

  // Network monitoring
  let networkMonitorEnabled = false;
  const networkRequests = [];

  G.toggleNetworkMonitor = function () {
    networkMonitorEnabled = !networkMonitorEnabled;
    const monitor = document.getElementById("networkMonitor");
    const status = document.getElementById("statusText");

    if (networkMonitorEnabled) {
      if (monitor) monitor.textContent = "Network monitoring enabled...\n";
      if (status) status.textContent = "Network monitoring ON";

      // Intercept fetch
      const originalFetch = window.fetch;
      window.fetch = function (...args) {
        const url = args[0];
        const startTime = Date.now();

        return originalFetch
          .apply(this, args)
          .then((response) => {
            const endTime = Date.now();
            const duration = endTime - startTime;

            if (networkMonitorEnabled) {
              const logEntry = `${new Date().toLocaleTimeString()} - FETCH ${
                response.status
              } ${url} (${duration}ms)`;
              networkRequests.push(logEntry);
              updateNetworkDisplay();
            }

            return response;
          })
          .catch((error) => {
            if (networkMonitorEnabled) {
              const logEntry = `${new Date().toLocaleTimeString()} - FETCH ERROR ${url} - ${
                error.message
              }`;
              networkRequests.push(logEntry);
              updateNetworkDisplay();
            }
            throw error;
          });
      };
    } else {
      if (monitor) monitor.textContent = "Network monitoring disabled.";
      if (status) status.textContent = "Network monitoring OFF";
    }
  };

  function updateNetworkDisplay() {
    const monitor = document.getElementById("networkMonitor");
    if (monitor && networkRequests.length > 0) {
      monitor.innerHTML = networkRequests
        .slice(-10)
        .map((req) => `<div class="go-network-item">${req}</div>`)
        .join("");
      monitor.scrollTop = monitor.scrollHeight;
    }
  }

  // CSS Injection
  G.injectCSS = function () {
    const css = prompt(
      "Enter CSS to inject:",
      "body { background: red !important; }"
    );
    if (css) {
      const style = document.createElement("style");
      style.textContent = css;
      document.head.appendChild(style);
      logOutput(`Injected CSS: ${css}`);
    }
  };

  // DOM Inspector
  G.domInspector = function () {
    const selector = prompt("Enter CSS selector to inspect:", "body");
    if (selector) {
      try {
        const elements = document.querySelectorAll(selector);
        logOutput(`Found ${elements.length} elements matching "${selector}"`);
        elements.forEach((el, i) => {
          logOutput(
            `Element ${i + 1}: ${el.tagName} - ${el.className || "no class"}`
          );
        });
      } catch (err) {
        logOutput(`Invalid selector: ${err.message}`);
      }
    }
  };

  // Enhanced copy function
  G.copyOutput = function () {
    const out = document.getElementById("outputLog");
    if (!out) return;
    const text = out.textContent || "";

    navigator.clipboard
      .writeText(text)
      .then(() => {
        const status = document.getElementById("statusText");
        if (status) status.textContent = "Output copied to clipboard ✓";
      })
      .catch(() => {
        try {
          const ta = document.createElement("textarea");
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
          const status = document.getElementById("statusText");
          if (status) status.textContent = "Output copied (fallback) ✓";
        } catch (_) {}
      });
  };

  G.clearCode = function () {
    const ta = document.getElementById("codeInput");
    const out = document.getElementById("outputLog");
    const status = document.getElementById("statusText");
    if (ta instanceof HTMLTextAreaElement) {
      ta.value = "";
    }
    if (out) {
      out.textContent = "";
    }
    if (status) {
      status.textContent = "Cleared ✓";
    }
  };

  // Enhanced minimize with animation
  G.minimizeConsole = function () {
    const panel = document.getElementById("consolePanel");
    if (!panel) return;

    const header = panel.querySelector(".go-console-header");
    const body = panel.querySelector(".go-console-body");
    const handles = panel.querySelectorAll(".go-resize-handle");
    const isCollapsed = panel.getAttribute("data-collapsed") === "1";
    const status = document.getElementById("statusText");

    if (!isCollapsed) {
      if (panel instanceof HTMLElement) {
        if (!panel.dataset.prevW) {
          panel.dataset.prevW =
            panel.style.width || panel.getBoundingClientRect().width + "px";
        }
        if (!panel.dataset.prevH) {
          panel.dataset.prevH =
            panel.style.height || panel.getBoundingClientRect().height + "px";
        }
      }

      if (body instanceof HTMLElement) body.style.display = "none";
      handles.forEach((h) => {
        if (h instanceof HTMLElement) h.style.display = "none";
      });

      if (header instanceof HTMLElement && panel instanceof HTMLElement) {
        panel.style.height = header.offsetHeight + "px";
      }

      panel.setAttribute("data-collapsed", "1");
      if (status) status.textContent = "Minimized";
    } else {
      if (body instanceof HTMLElement) body.style.display = "block";
      handles.forEach((h) => {
        if (h instanceof HTMLElement) h.style.display = "block";
      });

      panel.removeAttribute("data-collapsed");

      if (panel instanceof HTMLElement) {
        if (panel.dataset.prevW) {
          panel.style.width = panel.dataset.prevW;
          delete panel.dataset.prevW;
        }
        if (panel.dataset.prevH) {
          panel.style.height = panel.dataset.prevH;
          delete panel.dataset.prevH;
        }
      }

      if (status) status.textContent = "Restored";
    }
  };

  G.maximizeConsole = function () {
    const panel = document.getElementById("consolePanel");
    if (!panel) return;

    const wasCollapsed = panel.getAttribute("data-collapsed") === "1";
    const body = panel.querySelector(".go-console-body");
    const handles = panel.querySelectorAll(".go-resize-handle");

    if (body instanceof HTMLElement) body.style.display = "block";
    handles.forEach((h) => {
      if (h instanceof HTMLElement) h.style.display = "block";
    });

    panel.removeAttribute("data-collapsed");

    // Save current size before maximizing
    if (panel instanceof HTMLElement) {
      panel.dataset.prevW = panel.style.width || "480px";
      panel.dataset.prevH = panel.style.height || "400px";
      panel.dataset.prevL = panel.style.left || "24px";
      panel.dataset.prevT = panel.style.top || "24px";
    }

    // Maximize
    panel.style.left = "0";
    panel.style.top = "0";
    panel.style.width = "100vw";
    panel.style.height = "100vh";

    const status = document.getElementById("statusText");
    if (status) status.textContent = "Maximized - Click again to restore";

    // Change button behavior temporarily
    const maxBtn = panel.querySelector(
      ".go-console-controls .go-btn:nth-child(2)"
    );
    if (maxBtn) {
      maxBtn.onclick = function () {
        // Restore
        if (panel.dataset.prevW) panel.style.width = panel.dataset.prevW;
        if (panel.dataset.prevH) panel.style.height = panel.dataset.prevH;
        if (panel.dataset.prevL) panel.style.left = panel.dataset.prevL;
        if (panel.dataset.prevT) panel.style.top = panel.dataset.prevT;

        delete panel.dataset.prevW;
        delete panel.dataset.prevH;
        delete panel.dataset.prevL;
        delete panel.dataset.prevT;

        maxBtn.onclick = () => G.maximizeConsole();
        if (status) status.textContent = "Restored from maximized";
      };
    }
  };

  G.resetConsole = function () {
    const panel = document.getElementById("consolePanel");
    if (!panel) return;

    panel.removeAttribute("data-collapsed");
    const body = panel.querySelector(".go-console-body");
    const handles = panel.querySelectorAll(".go-resize-handle");

    if (body instanceof HTMLElement) body.style.display = "block";
    handles.forEach((h) => {
      if (h instanceof HTMLElement) h.style.display = "block";
    });

    // Reset to default size and position
    panel.style.left = "24px";
    panel.style.top = "24px";
    panel.style.width = "480px";
    panel.style.height = "400px";

    const status = document.getElementById("statusText");
    if (status) status.textContent = "Reset to default ✓";
  };

  G.closeConsole = function () {
    const panel = document.getElementById("consolePanel");
    if (!panel) return;
    panel.style.display = "none";
    const status = document.getElementById("statusText");
    if (status) status.textContent = "Closed";
  };

  // Settings management
  const LAYOUT_KEY = "goonee_hc_layout_v2";
  const SETTINGS_KEY = "goonee_hc_settings_v2";

  G.saveLayout = function () {
    const panel = document.getElementById("consolePanel");
    if (!panel) return;

    const r = panel.getBoundingClientRect();
    const data = {
      left: panel.style.left || r.left + "px",
      top: panel.style.top || r.top + "px",
      width: panel.style.width || r.width + "px",
      height: panel.style.height || r.height + "px",
    };

    try {
      localStorage.setItem(LAYOUT_KEY, JSON.stringify(data));
      const status = document.getElementById("statusText");
      if (status) status.textContent = "Layout saved ✓";
    } catch (_) {}
  };

  G.loadLayout = function () {
    const panel = document.getElementById("consolePanel");
    if (!panel) return;

    let data = null;
    try {
      data = JSON.parse(localStorage.getItem(LAYOUT_KEY) || "null");
    } catch (_) {
      data = null;
    }

    if (!data) {
      const status = document.getElementById("statusText");
      if (status) status.textContent = "No saved layout";
      return;
    }

    if (data.left) panel.style.left = data.left;
    if (data.top) panel.style.top = data.top;
    if (data.width) panel.style.width = data.width;
    if (data.height) panel.style.height = data.height;

    const status = document.getElementById("statusText");
    if (status) status.textContent = "Layout loaded ✓";
  };

  G.exportSettings = function () {
    const settings = {
      layout: JSON.parse(localStorage.getItem(LAYOUT_KEY) || "null"),
      theme: JSON.parse(localStorage.getItem("goonee_hc_theme_v2") || "null"),
      snippets: JSON.parse(
        localStorage.getItem("goonee_hc_snippets_v2") || "[]"
      ),
    };

    const dataStr = JSON.stringify(settings, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "goonee-console-settings.json";
    a.click();

    URL.revokeObjectURL(url);
    logOutput("Settings exported to file");
  };

  G.importSettings = function () {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = function (e) {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          const settings = JSON.parse(e.target.result);

          if (settings.layout) {
            localStorage.setItem(LAYOUT_KEY, JSON.stringify(settings.layout));
          }
          if (settings.theme) {
            localStorage.setItem(
              "goonee_hc_theme_v2",
              JSON.stringify(settings.theme)
            );
          }
          if (settings.snippets) {
            localStorage.setItem(
              "goonee_hc_snippets_v2",
              JSON.stringify(settings.snippets)
            );
          }

          logOutput("Settings imported successfully");
          const status = document.getElementById("statusText");
          if (status) status.textContent = "Settings imported ✓";

          // Refresh UI
          refreshSnippetSelect();
          G.loadLayout();
        } catch (err) {
          logOutput(`Import error: ${err.message}`);
        }
      };

      reader.readAsText(file);
    };

    input.click();
  };

  // Enhanced snippet management
  const SNIP_KEY = "goonee_hc_snippets_v2";

  function readSnips() {
    try {
      return JSON.parse(localStorage.getItem(SNIP_KEY) || "[]");
    } catch (_) {
      return [];
    }
  }

  function writeSnips(list) {
    try {
      localStorage.setItem(SNIP_KEY, JSON.stringify(list));
    } catch (_) {}
  }

  function refreshSnippetSelect() {
    const sel = document.getElementById("snippetSelect");
    if (!sel || !(sel instanceof HTMLSelectElement)) return;

    const list = readSnips();
    const prevIndex = sel.selectedIndex;
    sel.innerHTML = '<option value="">Select snippet...</option>';

    list.forEach((item, idx) => {
      const opt = document.createElement("option");
      opt.value = String(idx);
      opt.textContent = item.name || "Snippet " + (idx + 1);
      sel.appendChild(opt);
    });

    if (list.length > 0) {
      sel.selectedIndex =
        prevIndex >= 0 && prevIndex < list.length + 1 ? prevIndex : 0;
    }
  }

  G.saveSnippet = function () {
    const ta = document.getElementById("codeInput");
    if (!(ta instanceof HTMLTextAreaElement)) return;

    const code = ta.value.trim();
    if (!code) {
      logOutput("No code to save");
      return;
    }

    let name = prompt("Snippet name?", "My Snippet");
    if (name === null) {
      const status = document.getElementById("statusText");
      if (status) status.textContent = "Save cancelled";
      return;
    }

    name = String(name).trim();
    if (!name) name = "My Snippet";

    const list = readSnips();
    list.push({ name, code, created: new Date().toISOString() });
    writeSnips(list);
    refreshSnippetSelect();

    const sel = document.getElementById("snippetSelect");
    if (sel instanceof HTMLSelectElement) {
      sel.selectedIndex = list.length; // +1 because of "Select snippet..." option
    }

    const status = document.getElementById("statusText");
    if (status) status.textContent = "Snippet saved ✓";
    logOutput(`Saved snippet: ${name}`);
  };

  G.deleteSnippet = function () {
    const sel = document.getElementById("snippetSelect");
    if (!(sel instanceof HTMLSelectElement)) return;

    const list = readSnips();
    const idx = parseInt(sel.value, 10);

    if (isNaN(idx) || !list[idx]) {
      const status = document.getElementById("statusText");
      if (status) status.textContent = "No snippet selected";
      return;
    }

    const target = list[idx];
    const ok = confirm(`Delete snippet "${target.name}"?`);
    if (!ok) {
      const status = document.getElementById("statusText");
      if (status) status.textContent = "Delete cancelled";
      return;
    }

    list.splice(idx, 1);
    writeSnips(list);
    refreshSnippetSelect();

    const ta = document.getElementById("codeInput");
    if (ta instanceof HTMLTextAreaElement) {
      ta.value = "";
    }

    const status = document.getElementById("statusText");
    if (status) status.textContent = "Snippet deleted ✓";
    logOutput(`Deleted snippet: ${target.name}`);
  };

  G.loadSnippet = function () {
    const sel = document.getElementById("snippetSelect");
    const ta = document.getElementById("codeInput");

    if (
      !(sel instanceof HTMLSelectElement) ||
      !(ta instanceof HTMLTextAreaElement)
    )
      return;

    const list = readSnips();
    const idx = parseInt(sel.value, 10);

    if (isNaN(idx) || !list[idx]) {
      const status = document.getElementById("statusText");
      if (status) status.textContent = "No snippet selected";
      return;
    }

    ta.value = list[idx].code || "";
    const status = document.getElementById("statusText");
    if (status) status.textContent = "Snippet loaded ✓";
    logOutput(`Loaded snippet: ${list[idx].name}`);
  };

  // Enhanced theme system
  const THEME_KEY = "goonee_hc_theme_v2";
  const THEMES = [
    {
      name: "Matrix Green",
      accent: "#00ff41",
      accent2: "#00cc33",
      accentText: "#00ffc3",
      bgPanel: "rgba(0,0,0,.98)",
      bgInput: "#002200",
      bgOutput: "#001b12",
      status: "#00ff83",
    },
    {
      name: "Cyber Blue",
      accent: "#00e1ff",
      accent2: "#0077ff",
      accentText: "#b8f3ff",
      bgPanel: "rgba(2,8,23,.98)",
      bgInput: "#001a33",
      bgOutput: "#001326",
      status: "#6dd6ff",
    },
    {
      name: "Hacker Orange",
      accent: "#ff9900",
      accent2: "#ff5500",
      accentText: "#ffe0b3",
      bgPanel: "rgba(20,10,0,.98)",
      bgInput: "#261a00",
      bgOutput: "#1a1200",
      status: "#ffcc66",
    },
    {
      name: "Neon Pink",
      accent: "#ff3d7f",
      accent2: "#a71d5d",
      accentText: "#ffd1e6",
      bgPanel: "rgba(23,0,12,.98)",
      bgInput: "#330016",
      bgOutput: "#260011",
      status: "#ff8ab3",
    },
    {
      name: "Purple Haze",
      accent: "#9d4edd",
      accent2: "#7209b7",
      accentText: "#e0aaff",
      bgPanel: "rgba(15,0,20,.98)",
      bgInput: "#2d0a35",
      bgOutput: "#1a0520",
      status: "#c77dff",
    },
  ];

  function applyThemeVars(panel, theme) {
    if (!(panel instanceof HTMLElement)) return;
    Object.keys(theme).forEach((key) => {
      if (key !== "name") {
        panel.style.setProperty(`--${key}`, theme[key]);
      }
    });
  }

  function readTheme() {
    try {
      return JSON.parse(localStorage.getItem(THEME_KEY) || "null");
    } catch (_) {
      return null;
    }
  }

  function writeTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, JSON.stringify(theme));
    } catch (_) {}
  }

  G.randomTheme = function () {
    const panel = document.getElementById("consolePanel");
    if (!panel) return;

    const theme = THEMES[Math.floor(Math.random() * THEMES.length)];
    applyThemeVars(panel, theme);
    writeTheme(theme);

    const status = document.getElementById("statusText");
    if (status) status.textContent = `Theme: ${theme.name} ✓`;
    logOutput(`Applied theme: ${theme.name}`);
  };

  // Enhanced Eruda integration
  const ERUDA_KEY = "goonee_hc_eruda_on";
  const ERUDA_URL = "https://cdn.jsdelivr.net/npm/eruda@3/eruda.min.js";

  function isErudaLoaded() {
    return typeof window.eruda !== "undefined";
  }

  function loadEruda() {
    return new Promise((resolve, reject) => {
      if (isErudaLoaded()) {
        resolve(undefined);
        return;
      }

      const id = "__goonee_eruda_loader";
      if (document.getElementById(id)) {
        const check = setInterval(() => {
          if (isErudaLoaded()) {
            clearInterval(check);
            resolve(undefined);
          }
        }, 100);
        setTimeout(() => {
          clearInterval(check);
          isErudaLoaded()
            ? resolve(undefined)
            : reject(new Error("Eruda timeout"));
        }, 10000);
        return;
      }

      const script = document.createElement("script");
      script.id = id;
      script.src = ERUDA_URL;
      script.async = true;
      script.onload = () => resolve(undefined);
      script.onerror = () => reject(new Error("Failed to load Eruda"));
      document.documentElement.appendChild(script);
    });
  }

  G.toggleEruda = async function () {
    const status = document.getElementById("statusText");

    try {
      if (!isErudaLoaded()) {
        if (status) status.textContent = "Loading Eruda…";
        await loadEruda();
        window.eruda.init();
        logOutput("Eruda loaded and initialized");
      }

      const eruda = window.eruda;
      if (!eruda) return;

      const visible = eruda._devTools && eruda._devTools._isShow;
      if (visible) {
        eruda.hide();
        localStorage.setItem(ERUDA_KEY, "0");
        if (status) status.textContent = "Eruda hidden";
        logOutput("Eruda hidden");
      } else {
        eruda.show();
        localStorage.setItem(ERUDA_KEY, "1");
        if (status) status.textContent = "Eruda shown";
        logOutput("Eruda shown");
      }
    } catch (err) {
      if (status) status.textContent = "Eruda error";
      logOutput(`Eruda error: ${err.message}`);
    }
  };

  // Time display
  function updateTimeDisplay() {
    const timeEl = document.getElementById("timeDisplay");
    if (timeEl) {
      timeEl.textContent = new Date().toLocaleTimeString();
    }
  }

  // Initialize panel extras
  function initPanelExtras() {
    const panel = document.getElementById("consolePanel");
    if (!panel) return;

    // Apply saved theme
    const theme = readTheme();
    if (theme) applyThemeVars(panel, theme);

    // Populate snippets
    refreshSnippetSelect();

    // Bind snippet selection
    const sel = document.getElementById("snippetSelect");
    const ta = document.getElementById("codeInput");
    if (sel instanceof HTMLSelectElement && ta instanceof HTMLTextAreaElement) {
      sel.addEventListener("change", function () {
        const list = readSnips();
        const idx = parseInt(sel.value, 10);
        if (!isNaN(idx) && list[idx]) {
          ta.value = list[idx].code || "";
        }
      });
    }

    // Start time display
    updateTimeDisplay();
    setInterval(updateTimeDisplay, 1000);

    // Auto-restore Eruda if it was enabled
    try {
      if (localStorage.getItem(ERUDA_KEY) === "1") {
        loadEruda().then(() => {
          if (window.eruda) {
            window.eruda.init();
            window.eruda.show();
          }
        });
      }
    } catch (_) {}

    // Welcome message
    logOutput("🔧 Goonee Hacker Console v2.0 initialized");
    logOutput("Press Ctrl+` to toggle console");
    logOutput("Use tabs to navigate different features");
  }

  // Auto-open if requested
  const auto =
    (currentScript &&
      currentScript.getAttribute &&
      currentScript.getAttribute("data-auto") === "1") ||
    (currentScript &&
      currentScript.src &&
      /[?&]auto=1/.test(currentScript.src)) ||
    (typeof window.HC_AUTO !== "undefined" && !!window.HC_AUTO);

  if (auto) {
    setTimeout(showConsole, 100);
  }
})();
