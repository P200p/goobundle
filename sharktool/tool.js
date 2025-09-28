(function () {

    // 🦈 Panel DevTool ฉบับ Hacker
    const panel = document.createElement('div');
    panel.style.cssText = `
      position:fixed; top:60px; right:20px; z-index:999999;
      background:#00ffccaa; color:#F0F0F0; padding:8px; border-radius:8px;
      font-family:monospace; font-size:14px; border:2px solid #ff0000;
      box-shadow:0 0 10px #ff0000aa;
      width:140px; height:400px; overflow:hidden;
    `;

    // 🎛️ Control Bar
    const controlBar = document.createElement('div');
    controlBar.style.cssText = 'display:flex; justify-content:flex-end; gap:4px; margin-bottom:6px;';

    // เพิ่มปุ่มพับ/ขยาย
    let minimized = false;
    const minimizeBtn = document.createElement('button');
    minimizeBtn.textContent = '↕';
    minimizeBtn.title = 'พับ/ขยาย';
    minimizeBtn.style.cssText = `
      padding:2px 6px; background:#00ffccaa; color:#0f0;
      border:1px solid #ff0000; border-radius:4px; cursor:pointer;
      font-family:monospace; margin: 0 4px; 
    `;
    minimizeBtn.onclick = () => {
      minimized = !minimized;
      panel.style.height = minimized ? '36px' : '400px';
      panel.style.overflow = minimized ? 'hidden' : 'auto';
    };

    // --- จุดลาก (Drag Handle) ---
    const dragHandle = document.createElement('div');
    dragHandle.title = 'ลากแผง';
    dragHandle.style.cssText = `
      width:22px; height:22px; display:inline-block;
      margin:0 2px; cursor:move; border-radius:4px;
      background:rgba(0,0,0,0.10); border:1px dashed #ff0000;
      vertical-align:middle;
    `;
    // รองรับลากทั้ง mouse และ touch
    let shiftX, shiftY, dragging = false;
    dragHandle.addEventListener('mousedown', e => {
      dragging = true;
      panel.style.left = panel.getBoundingClientRect().left + 'px';
      panel.style.top = panel.getBoundingClientRect().top + 'px';
      panel.style.right = '';
      shiftX = e.clientX - panel.getBoundingClientRect().left;
      shiftY = e.clientY - panel.getBoundingClientRect().top;
      document.addEventListener('mousemove', onDragMove);
      document.addEventListener('mouseup', onDragEnd);
      e.preventDefault();
    });
    dragHandle.addEventListener('touchstart', e => {
      dragging = true;
      const t = e.touches[0];
      panel.style.left = panel.getBoundingClientRect().left + 'px';
      panel.style.top = panel.getBoundingClientRect().top + 'px';
      panel.style.right = '';
      shiftX = t.clientX - panel.getBoundingClientRect().left;
      shiftY = t.clientY - panel.getBoundingClientRect().top;
      document.addEventListener('touchmove', onDragMoveTouch);
      document.addEventListener('touchend', onDragEndTouch);
      e.preventDefault();
    });
    function onDragMove(e) {
      if (!dragging) return;
      panel.style.left = (e.pageX - shiftX) + 'px';
      panel.style.top = (e.pageY - shiftY) + 'px';
    }
    function onDragEnd() {
      dragging = false;
      document.removeEventListener('mousemove', onDragMove);
      document.removeEventListener('mouseup', onDragEnd);
    }
    function onDragMoveTouch(e) {
      if (!dragging) return;
      const t = e.touches[0];
      panel.style.left = (t.clientX - shiftX) + 'px';
      panel.style.top = (t.clientY - shiftY) + 'px';
    }
    function onDragEndTouch() {
      dragging = false;
      document.removeEventListener('touchmove', onDragMoveTouch);
      document.removeEventListener('touchend', onDragEndTouch);
    }

    controlBar.appendChild(dragHandle);
    controlBar.appendChild(minimizeBtn);

    [['❌', 'ปิดหน้าต่าง', () => panel.remove()]]
      .forEach(([txt, ttl, fn]) => {
        const btn = document.createElement('button');
        btn.textContent = txt;
        btn.title = ttl;
        btn.style.cssText = `
        padding:2px 6px; background:#ff0000; color:#0f0;
        border:1px solid rgb(34, 0, 255); border-radius:4px; cursor:pointer;
        font-family:monospace; margin: 0 4px;
      `;
        btn.onclick = fn;
        controlBar.appendChild(btn);
      });
    panel.appendChild(controlBar);

    // 🧰 ฟังก์ชัน Debug ขั้นสูง
    function addTool(label, fn) {
      const btn = document.createElement('button');
      btn.textContent = label;
      btn.style.cssText = `
        padding:6px; background:#ff0000; color:#0f0;
        border:1px solid rgb(56, 0, 224); border-radius:6px; cursor:pointer;
        font-family:monospace; margin-bottom:6px; width:100%;
      `;
      btn.onclick = fn;
      panel.appendChild(btn);
    }

    addTool('🎯 คลิกสุ่มทุกปุ่ม', () => {
      document.querySelectorAll('button,a,[role=button]')
        .forEach(el => { try { el.click(); } catch { } });
      alert('คลิกครบทุกปุ่มแล้ว');
    });

    addTool('📋 สแกนฟอร์ม', () => {
      const fs = document.querySelectorAll('form');
      const sum = [...fs].map((f, i) => `${i}: ${f.action} (${f.querySelectorAll('input,textarea,select').length})`).join('\n');
      console.log(sum);
      alert('ดูฟอร์มใน console');
    });

    addTool('🖥️ เต็มจอพร้อมซ่อน Panel', () => {
      // ขอ fullscreen
      document.documentElement.requestFullscreen().then(() => {
        // หลังเข้าสู่โหมด fullscreen แล้วค่อยซ่อน panel
        panel.style.display = 'none';
      }).catch(err => {
        console.warn('Fullscreen failed:', err);
      });
    });


    addTool('🎨 เปลี่ยนธีม', () => {
      const dark = panel.dataset.theme !== 'dark';
      panel.dataset.theme = dark ? 'dark' : 'light';

      const style = dark
        ? {
          background: 'transparent',            // ไม่มีพื้นหลัง
          color: '#0f0',
          border: '2px solid #ff0000',
          boxShadow: '0 0 10px #ff0000aa',
          backdropFilter: 'blur(0px)',          // ไม่เบลอพื้นหลัง
        }
        : {
          background: '#f0f0f0',
          color: '#111',
          border: '2px solid #ccc',
          boxShadow: '0 0 10px #aaa'
        };

      Object.assign(panel.style, style);
    });

    // 🛠️ ตั้งค่าขนาด Panel (ย้ายออกมาให้ใช้ได้ตลอด)
    addTool('🛠️ ตั้งค่าขนาด Panel', () => {
      const w = prompt('📏 ความกว้าง (px)', panel.offsetWidth);
      const h = prompt('📐 ความสูง (px)', panel.offsetHeight);

      if (w && h && !isNaN(w) && !isNaN(h)) {
        panel.style.width = w + 'px';
        panel.style.height = h + 'px';

        // ✨ Save ไว้เลย
        localStorage.setItem('sharkPanelSize', JSON.stringify({ w, h }));
        alert('✅ บันทึกเรียบร้อย!');
      } else {
        alert('🤔 ใส่เลขให้ถูกน้า');
      }
    });

    // โหลดขนาดที่บันทึกไว้ (ถ้ามี)
    (function(){
      const savedSize = localStorage.getItem('sharkPanelSize');
      if (savedSize) {
        const { w, h } = JSON.parse(savedSize);
        panel.style.width = w + 'px';
        panel.style.height = h + 'px';
      }
    })();

    addTool('🔓 ปลดล็อคฟอร์ม', () => {
      document.querySelectorAll('input, textarea, select, button').forEach(el => {
        ['disabled', 'readonly'].forEach(attr => el.removeAttribute(attr));
        ['onkeydown', 'onkeyup', 'onkeypress'].forEach(evt => {
          if (el.hasAttribute(evt)) el.removeAttribute(evt);
          el.setAttribute('maxlength', 100000);
          el.style.pointerEvents = 'auto';
          el.style.opacity = 1;
        });
        alert('✅ ปลดล็อคทั้งหมดเรียบร้อย');
      });
      

      let themeIndex = 0;

      addTool('เปลี่ยนธีมเว็บ', () => {
        themeIndex = (themeIndex + 1) % 3;

        // หมายเหตุ: เคยมีชุดธีมในตัวแปร `themes` แต่เลิกใช้แล้วเพื่อให้โค้ดกระชับขึ้น

        // โหลด CSS ธีม ถ้ายังไม่ได้โหลด
        if (!document.getElementById('panel-theme-css')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://sharkkadaw.netlify.app/sharktool/panel-theme.css';
          link.id = 'panel-theme-css';
          document.head.appendChild(link);
        }

        // ลบ class ธีมเดิม
        if (panel.classList) {
          panel.classList.remove('panel-theme-light', 'panel-theme-dark');
        }

        // ใส่ class ธีมใหม่
        if (panel.classList) {
          panel.classList.add(themeIndex === 0 ? 'panel-theme-light' : 'panel-theme-dark');
        }
        // --- มุมล่างขวา resize handle ---

        const resizeHandle = document.createElement('div');
        resizeHandle.title = 'ปรับขนาดแผง';
        resizeHandle.style.cssText = `
      position:absolute; right:2px; bottom:2px; width:18px; height:18px;
      background:#ff0000; opacity:0.7; border-radius:4px; cursor:se-resize;
      z-index:1001;
    `;
        if (panel.appendChild) {
          panel.appendChild(resizeHandle);
        }

        let resizing = false;
        if (resizeHandle.addEventListener) {
          resizeHandle.addEventListener('mousedown', e => { resizing = true; e.preventDefault(); });
          document.addEventListener('mousemove', e => {
            if (resizing) {
              panel.style.width = e.clientX - panel.getBoundingClientRect().left + 'px';
              panel.style.height = e.clientY - panel.getBoundingClientRect().top + 'px';
            }
          });
          document.addEventListener('mouseup', () => resizing = false);
          resizeHandle.addEventListener('touchstart', e => { resizing = true; e.preventDefault(); });
          document.addEventListener('touchmove', e => {
            if (resizing && e.touches && e.touches[0]) {
              const t = e.touches[0];
              panel.style.width = t.clientX - panel.getBoundingClientRect().left + 'px';
              panel.style.height = t.clientY - panel.getBoundingClientRect().top + 'px';
            }
          });
          document.addEventListener('touchend', () => resizing = false);
        }
      });
      // ปุ่มดูคุกกี้
      addTool('ดูคุกกี้', () => {
        alert(document.cookie || 'ไม่มีคุกกี้');
      });

    });

    document.body.appendChild(panel);
  })();