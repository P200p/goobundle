
(function () {
  // --- ค่าพื้นฐานและตัวช่วยคำนวณพาธ ---
  const CURRENT_SCRIPT = document.currentScript;
  const SCRIPT_URL = CURRENT_SCRIPT ? CURRENT_SCRIPT.src : new URL('sharktool/bundle.js', window.location.href).href;
  const SHARKTOOL_BASE = new URL('./', SCRIPT_URL).href; // โฟลเดอร์ sharktool/
  const ROOT_BASE = new URL('../', SHARKTOOL_BASE).href; // รูทโปรเจค (สำหรับหาโฟลเดอร์อื่น)
  const ICON_BASE = new URL('gooimage/', ROOT_BASE).href; // โฟลเดอร์เก็บไอคอน

  // --- รายการเครื่องมือ (ใช้กรณี manifest โหลดไม่ได้) ---
  const FALLBACK_TOOLS = [
    { id: 'monitor', name: 'Monitor', url: 'monitor.js', description: 'หน้าจอติดตาม/มอนิเตอร์' },
    { id: 'theme', name: 'Theme', url: 'Theme.js', description: 'เปลี่ยนธีม / ตั้งค่าธีม' },
    { id: 'snipers', name: 'Snipers', url: 'snipers.js', description: 'ผู้ช่วยคลิกอัตโนมัติด้วย CSS Selector' },
    { id: 'burpshark', name: 'BurpShark', url: 'burpshark.js', description: 'ฟอร์แมตรูปแบบ HTTP Request รองรับ Burp' },
    { id: 'sharkscan', name: 'SharkScan', url: 'sharkscan.js', description: 'ปุ่มรวม recon เบื้องต้น' },
    { id: 'postshark', name: 'PostShark', url: 'postshark.js', description: 'Mini Postman สำหรับส่ง HTTP Request' },
    { id: 'console2', name: 'Goonee Console', url: 'console2.js', description: 'คอนโซลเวอร์ชันใหม่', icon: 'meta.png', iconHover: 'meta.png' }
  ];

  const MANIFEST_URL = new URL('manifest.json', SHARKTOOL_BASE).href;

  // --- ไอคอนสำหรับปุ่มย่อย ---
  const ICON_PAIRS = [
    { normal: 'a1.png', hover: 'a2.png' },
    { normal: 'b1.png', hover: 'b2.png' },
    { normal: 'c1.png', hover: 'c2.png' },
    { normal: 'd1.png', hover: 'd2.png' },
    { normal: 'e1.png', hover: 'e2.png' }
  ];
  const FALLBACK_ICON = { normal: 'meta.png', hover: 'meta.png' };

  function resolveIconPath(iconPath) {
    if (!iconPath) return null;
    if (/^(https?:)?\/\//i.test(iconPath)) {
      return iconPath;
    }
    return new URL(iconPath.replace(/^\.?\//, ''), ICON_BASE).href;
  }

  const loadedTools = new Map(); // url -> { lastLoad, module, scriptEl, toolId }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function enableDragging(container, ...handles) {
    const state = {
      pointerId: null,
      startX: 0,
      startY: 0,
      offsetX: 0,
      offsetY: 0,
      moved: false,
      lastLeft: null,
      lastTop: null,
      handlePositions: new Map(), // remember handle-specific offsets when detached
    };

    function ensureFixedPosition() {
      container.style.position = 'fixed';
      container.style.right = container.style.right || '24px';
      container.style.bottom = container.style.bottom || '24px';
    }

    function applyPosition(left, top) {
      state.lastLeft = left;
      state.lastTop = top;
      ensureFixedPosition();
      container.style.left = `${left}px`;
      container.style.top = `${top}px`;
      container.style.right = 'auto';
      container.style.bottom = 'auto';
    }

    function updatePosition(clientX, clientY) {
      const maxLeft = Math.max(12, window.innerWidth - container.offsetWidth - 12);
      const maxTop = Math.max(12, window.innerHeight - container.offsetHeight - 12);
      const left = clamp(clientX - state.offsetX, 12, maxLeft);
      const top = clamp(clientY - state.offsetY, 12, maxTop);
      applyPosition(left, top);
    }

    function clearDragSkip(handle) {
      if (handle.dataset.dragJustEnded === '1') {
        delete handle.dataset.dragJustEnded;
      }
    }

    handles.forEach((handle) => {
      handle.addEventListener('pointerdown', (event) => {
        if (event.button !== 0 && event.pointerType !== 'touch') return;
        if (handle.dataset.dragDisabled === '1') return;
        event.preventDefault();
        const rect = container.getBoundingClientRect();
        ensureFixedPosition();
        state.pointerId = event.pointerId;
        state.startX = event.clientX;
        state.startY = event.clientY;
        state.offsetX = event.clientX - rect.left;
        state.offsetY = event.clientY - rect.top;
        state.moved = false;
        clearDragSkip(handle);
        state.activeHandle = handle;
        handle.setPointerCapture(event.pointerId);
        window.addEventListener('pointermove', onPointerMove, { passive: false });
      });

      const onPointerMove = (event) => {
        if (state.pointerId !== event.pointerId) return;
        const deltaX = Math.abs(event.clientX - state.startX);
        const deltaY = Math.abs(event.clientY - state.startY);
        if (!state.moved) {
          if (deltaX <= 5 && deltaY <= 5) return;
          state.moved = true;
        }
        updatePosition(event.clientX, event.clientY);
      };

      function endDrag(event) {
        if (state.pointerId !== event.pointerId) return;
        handle.releasePointerCapture(event.pointerId);
        window.removeEventListener('pointermove', onPointerMove);

        if (state.moved) {
          handle.dataset.dragJustEnded = '1';
          // remember relative position in case the button is still in the list after drop
          const rect = handle.getBoundingClientRect();
          state.handlePositions.set(handle, { left: rect.left, top: rect.top });
          setTimeout(() => {
            clearDragSkip(handle);
          }, 160);
        }

        state.pointerId = null;
        state.activeHandle = null;
      }

      handle.addEventListener('pointerup', endDrag);
      handle.addEventListener('pointercancel', endDrag);
    });

    window.addEventListener('resize', () => {
      if (state.lastLeft === null || state.lastTop === null) return;
      const maxLeft = Math.max(12, window.innerWidth - container.offsetWidth - 12);
      const maxTop = Math.max(12, window.innerHeight - container.offsetHeight - 12);
      const left = clamp(state.lastLeft, 12, maxLeft);
      const top = clamp(state.lastTop, 12, maxTop);
      applyPosition(left, top);
    });
  }

  // --- ฟังก์ชันโหลด manifest ---
  async function loadManifest() {
    try {
      const res = await fetch(MANIFEST_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('รูปแบบ manifest ไม่ถูกต้อง');
      const normalized = data
        .map((item) => {
          const rawUrl = (item.url || '').trim();
          const absoluteUrl = /^(https?:)?\/\//i.test(rawUrl)
            ? rawUrl
            : new URL(rawUrl.replace(/^\.?\//, ''), SHARKTOOL_BASE).href;
          return {
            id: item.id,
            name: item.name || item.id,
            url: absoluteUrl,
            description: item.description || ''
          };
        })
        .filter((item) => item.id && item.url);

      const hasConsole2 = normalized.some((tool) => tool.id === 'console2');
      if (!hasConsole2) {
        normalized.push({
          id: 'console2',
          name: 'Goonee Console',
          url: new URL('console2.js', SHARKTOOL_BASE).href,
          description: 'คอนโซลเวอร์ชันใหม่'
        });
      }

      return normalized;
    } catch (err) {
      console.warn('[SharkTool Bundle] โหลด manifest ไม่สำเร็จ ใช้รายการสำรองแทน', err);
      return FALLBACK_TOOLS.map((item) => ({
        ...item,
        url: new URL(item.url.replace(/^\.?\//, ''), SHARKTOOL_BASE).href
      }));
    }
  }

  // --- ฟังก์ชันโหลดสคริปต์เครื่องมือ ---
  function loadScript(url, toolId) {
    return new Promise((resolve, reject) => {
      const cached = loadedTools.get(url);
      if (cached?.module && cached.module.reopen) {
        try {
          cached.module.reopen();
          resolve('reopened');
          return;
        } catch (err) {
          console.warn('reopen failed, fallback to reload', err);
        }
      }

      if (cached?.scriptEl) {
        cached.scriptEl.remove();
        loadedTools.delete(url);
      }

      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.onload = () => {
        let moduleRef = window.GO2 || null;
        if (moduleRef && typeof moduleRef === 'object') {
          moduleRef.reopen = moduleRef.reopen || moduleRef.toggle || moduleRef.open;
          if (toolId === 'console2') {
            moduleRef.reset = moduleRef.reset || moduleRef.reload || null;
          }
        }
        loadedTools.set(url, { lastLoad: Date.now(), module: moduleRef, scriptEl: script, toolId });
        resolve(url);
      };
      script.onerror = () => reject(new Error('โหลดไม่สำเร็จ: ' + url));
      document.body.appendChild(script);
    });
  }

  function resetConsoleTool(url) {
    const cached = loadedTools.get(url);
    if (cached) {
      try {
        if (cached.module?.reset) {
          cached.module.reset();
        }
      } catch (err) {
        console.warn('console reset via module failed, fallback to reload', err);
      }
      if (cached.scriptEl) {
        cached.scriptEl.remove();
      }
      loadedTools.delete(url);
    }

    const existingConsole = document.querySelector('.GO2-root, #GO2-root');
    if (existingConsole) {
      existingConsole.remove();
    }

    loadScript(url, 'console2')
      .then(() => {
        showToast('รีโหลด Goonee Console แล้ว', 'success');
      })
      .catch((err) => {
        console.error(err);
        showToast('รีเซ็ตคอนโซลไม่สำเร็จ', 'error');
      });
  }

  // --- จัดการ Toast แจ้งสถานะ ---
  function createToastHost() {
    let host = document.getElementById('stb-toast-host');
    if (!host) {
      host = document.createElement('div');
      host.id = 'stb-toast-host';
      host.className = 'stb-toast-host';
      document.body.appendChild(host);
    }
    return host;
  }

  function showToast(message, variant = 'info') {
    const host = createToastHost();
    const toast = document.createElement('div');
    toast.className = `stb-toast stb-toast-${variant}`;
    toast.textContent = message;
    host.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('stb-toast-visible'));
    setTimeout(() => {
      toast.classList.remove('stb-toast-visible');
      toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, 2600);
  }

  // --- สร้าง UI ปุ่มหลักและเมนูย่อย ---
  function createUI(tools) {
    if (!tools.length) {
      console.warn('[SharkTool Bundle] ไม่พบรายการเครื่องมือ');
      return;
    }

    injectStyles();

    const container = document.createElement('div');
    container.id = 'shark-bundle-launcher';
    container.className = 'stb-container';

    const toolList = document.createElement('div');
    toolList.className = 'stb-tool-list';

    let consoleToolUrl = null;

    tools.forEach((tool, index) => {
      if (tool.id === 'console2') {
        consoleToolUrl = tool.url;
        if (!tool.icon) {
          tool.icon = 'meta.png';
        }
        if (!tool.iconHover) {
          tool.iconHover = tool.icon;
        }
      }

      const iconOverrideNormal = tool.id === 'console2' ? resolveIconPath('meta.png') : resolveIconPath(tool.icon);
      const iconOverrideHover = tool.id === 'console2' ? resolveIconPath('meta.png') : resolveIconPath(tool.iconHover || tool.icon);
      const pair = ICON_PAIRS[index] || ICON_PAIRS[index % ICON_PAIRS.length] || FALLBACK_ICON;
      const normalSrc = iconOverrideNormal || new URL(pair.normal, ICON_BASE).href;
      const hoverSrc = iconOverrideHover || new URL(pair.hover, ICON_BASE).href;

      const button = document.createElement('button');
      button.className = tool.id === 'console2' ? 'stb-tool stb-tool-console' : 'stb-tool';
      button.type = 'button';
      button.title = `${tool.name}\n${tool.description || ''}`.trim();
      button.dataset.toolId = tool.id;

      if (tool.id === 'console2') {
        button.classList.add('stb-tool-console');
      }

      const img = document.createElement('img');
      img.src = normalSrc;
      img.alt = tool.name;
      img.draggable = false;

      button.appendChild(img);

      button.addEventListener('mouseenter', () => {
        img.src = hoverSrc;
      });
      button.addEventListener('mouseleave', () => {
        img.src = normalSrc;
      });

      button.addEventListener('click', async () => {
        if (button.dataset.dragJustEnded === '1') {
          delete button.dataset.dragJustEnded;
          return;
        }

        showToast(`กำลังโหลด ${tool.name}...`, 'info');
        try {
          await loadScript(tool.url, tool.id);
          if (tool.name) {
            showToast(`พร้อมใช้งาน: ${tool.name}`, 'success');
          }
        } catch (err) {
          console.error(err);
          showToast(`โหลด ${tool.name} ไม่สำเร็จ`, 'error');
        }
      });

      toolList.appendChild(button);
    });

    if (consoleToolUrl) {
      const resetButton = document.createElement('button');
      resetButton.className = 'stb-console-reset';
      resetButton.type = 'button';
      resetButton.textContent = 'รีเซ็ตคอนโซล';
      resetButton.addEventListener('click', () => {
        resetConsoleTool(consoleToolUrl);
      });
      resetButton.addEventListener('mouseenter', () => {
        resetButton.classList.add('stb-console-reset-hover');
      });
      resetButton.addEventListener('mouseleave', () => {
        resetButton.classList.remove('stb-console-reset-hover');
      });
      toolList.appendChild(resetButton);
    }

    function isMetaButton(button) {
      const img = button.querySelector('img');
      if (!img) return false;
      const src = img.src || '';
      return src.includes('meta.png');
    }

    const mainButton = document.createElement('button');
    mainButton.className = 'stb-main-button';
    mainButton.type = 'button';
    mainButton.setAttribute('aria-expanded', 'false');
    mainButton.setAttribute('aria-label', 'เปิดเมนูเครื่องมือ SharkTool');

    const mainImg = document.createElement('img');
    mainImg.src = new URL('aa.png', ICON_BASE).href;
    mainImg.alt = 'SharkTool Bundle';
    mainImg.draggable = false;

    const mainCaption = document.createElement('span');
    mainCaption.className = 'stb-main-caption';
    mainCaption.textContent = 'เปิด SharkTool';

    mainButton.appendChild(mainImg);
    mainButton.appendChild(mainCaption);

    let opened = false;
    mainButton.addEventListener('click', () => {
      if (mainButton.dataset.dragJustEnded === '1') {
        delete mainButton.dataset.dragJustEnded;
        return;
      }
      opened = !opened;
      container.classList.toggle('stb-open', opened);
      mainButton.setAttribute('aria-expanded', String(opened));
    });

    container.appendChild(toolList);
    container.appendChild(mainButton);
    document.body.appendChild(container);
    enableDragging(container, mainButton, ...toolList.querySelectorAll('.stb-tool'));
  }

  // --- ใส่สไตล์ที่จำเป็น ---
  function injectStyles() {
    if (document.getElementById('stb-styles')) return;
    const style = document.createElement('style');
    style.id = 'stb-styles';
    style.textContent = `
      .stb-container {
        position: fixed;
        right: 24px;
        bottom: 24px;
        z-index: 2147483646;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        font-family: 'Noto Sans Thai', 'Sarabun', system-ui, -apple-system, 'Segoe UI', sans-serif;
        touch-action: none;
      }
      .stb-tool-list {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 14px;
        max-height: 0;
        opacity: 0;
        overflow: hidden;
        transition: max-height 0.45s ease, opacity 0.3s ease;
      }
      .stb-open .stb-tool-list {
        max-height: 600px;
        opacity: 1;
      }
      .stb-main-button {
        position: relative;
        width: 88px;
        height: 88px;
        border-radius: 50%;
        border: 2px solid rgba(34, 197, 94, 0.7);
        background: radial-gradient(circle at 30% 30%, rgba(34, 197, 94, 0.18), rgba(15, 23, 42, 0.92));
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
        cursor: pointer;
        padding: 0;
        overflow: hidden;
        transition: transform 0.45s ease, box-shadow 0.35s ease;
      }
      .stb-main-button img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.65s ease;
        pointer-events: none;
      }
      .stb-main-button:hover {
        transform: translateY(-4px) scale(1.04);
        box-shadow: 0 18px 38px rgba(34, 197, 94, 0.35);
      }
      .stb-open .stb-main-button img {
        transform: rotate(360deg);
      }
      .stb-main-caption {
        position: absolute;
        bottom: -32px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(15, 23, 42, 0.86);
        color: #e2e8f0;
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 12px;
        letter-spacing: 0.2px;
        white-space: nowrap;
        box-shadow: 0 8px 18px rgba(0, 0, 0, 0.24);
      }
      .stb-tool {
        width: 72px;
        height: 72px;
        border-radius: 50%;
        border: 2px solid transparent;
        background: rgba(15, 23, 42, 0.72);
        backdrop-filter: blur(6px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px;
        cursor: pointer;
        transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
      }
      .stb-tool img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        pointer-events: none;
        transition: transform 0.25s ease;
      }
      .stb-tool:hover {
        transform: translateY(-4px) scale(1.05);
        box-shadow: 0 14px 26px rgba(59, 130, 246, 0.35);
        border-color: rgba(96, 165, 250, 0.55);
      }
      .stb-tool:hover img {
        transform: scale(1.08);
      }
      .stb-tool-console {
        border-color: rgba(251, 191, 36, 0.65);
        background: radial-gradient(circle at 35% 35%, rgba(251, 191, 36, 0.28), rgba(15, 23, 42, 0.94));
      }
      .stb-tool-console img {
        border-radius: 50%;
        background: rgba(15, 23, 42, 0.86);
        padding: 6px;
      }
      .stb-console-reset {
        margin-top: 6px;
        padding: 8px 16px;
        border-radius: 999px;
        border: 1px solid rgba(148, 163, 184, 0.5);
        background: rgba(15, 23, 42, 0.78);
        color: #e2e8f0;
        font-size: 13px;
        cursor: pointer;
        transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease, border-color 0.25s ease;
      }
      .stb-console-reset-hover,
      .stb-console-reset:hover {
        background: rgba(59, 130, 246, 0.82);
        border-color: rgba(59, 130, 246, 0.55);
        box-shadow: 0 12px 24px rgba(59, 130, 246, 0.35);
        transform: translateY(-2px);
      }
      .stb-toast-host {
        position: fixed;
        right: 24px;
        bottom: 130px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        z-index: 2147483647;
        pointer-events: none;
        font-family: 'Noto Sans Thai', 'Sarabun', system-ui, sans-serif;
      }
      .stb-toast {
        min-width: 200px;
        padding: 10px 14px;
        border-radius: 10px;
        box-shadow: 0 16px 32px rgba(15, 23, 42, 0.3);
        background: rgba(15, 23, 42, 0.92);
        color: #e2e8f0;
        font-size: 13px;
        transform: translateY(12px);
        opacity: 0;
        transition: transform 0.28s ease, opacity 0.28s ease;
      }
      .stb-toast-visible {
        transform: translateY(0);
        opacity: 1;
      }
      .stb-toast-success {
        background: rgba(22, 163, 74, 0.92);
        color: #f8fafc;
      }
      .stb-toast-error {
        background: rgba(220, 38, 38, 0.92);
        color: #f8fafc;
      }
      .stb-toast-info {
        background: rgba(30, 64, 175, 0.92);
        color: #e2e8f0;
      }
      @media (max-width: 640px) {
        .stb-container {
          right: 16px;
          bottom: 16px;
        }
        .stb-main-button {
          width: 72px;
          height: 72px;
        }
        .stb-tool {
          width: 60px;
          height: 60px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // --- เริ่มทำงาน ---
  (async function init() {
    const tools = await loadManifest();
    createUI(tools);
  })();
})();