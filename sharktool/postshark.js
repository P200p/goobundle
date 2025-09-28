// MiniPostman: ส่ง HTTP Request + Auto-fix JSON Header
(function(){
    const panel = document.createElement('div');
    panel.style.cssText = `
      position:fixed; top:20px; right:20px;
      z-index:99999; background:rgba(0,0,0,0.95); color:#fff;
      padding:18px 22px; border-radius:12px; border:2px solid #4caf50;
      box-shadow:0 0 16px #4caf5099; font-family:sans-serif; min-width:320px; max-width:96vw; touch-action:none;
    `;
    panel.innerHTML = `
      <div style="font-size:18px; margin-bottom:10px; color:#4caf50;">MiniPostman</div>
      <input id="urlInput" placeholder="URL" style="width:97%;padding:7px;margin-bottom:7px;border-radius:5px;border:1px solid #666;font-size:15px;"><br>
      <select id="methodSelect" style="width:99%;padding:6px;margin-bottom:7px;border-radius:5px;font-size:15px;">
        <option>GET</option><option>POST</option><option>PUT</option><option>PATCH</option><option>DELETE</option>
      </select><br>
      <textarea id="headersInput" placeholder="Headers (JSON)" style="width:97%;height:48px;resize:vertical;border-radius:5px;padding:7px;font-size:14px;margin-bottom:7px;"></textarea><br>
      <textarea id="bodyInput" placeholder="Body (ถ้ามี)" style="width:97%;height:60px;resize:vertical;border-radius:5px;padding:7px;font-size:14px;margin-bottom:7px;"></textarea><br>
      <button id="sendBtn" style="width:100%; margin-bottom:6px; padding:7px; background:#222; color:#4caf50; border:none; border-radius:6px; cursor:pointer; font-size:16px;">🚀 ส่งคำขอ</button>
      <button id="closeBtn" style="width:100%; padding:6px; background:#b71c1c; color:#fff; border:none; border-radius:6px; cursor:pointer; font-size:15px;">ปิด</button>
      <div id="result" style="margin-top:12px; text-align:left; font-size:13px; color:#fff;"></div>
    `;
    document.body.appendChild(panel);

    // Panel-wide drag (mouse/touch) with pointer capture
    (function enableDrag(){
      let dragging=false, sx=0, sy=0, sl=0, st=0;
      function onPointerDown(e){
        if ((e.target).closest('button, input, select, textarea, a, label')) return;
        const r = panel.getBoundingClientRect(); sl=r.left; st=r.top; sx=e.clientX; sy=e.clientY; dragging=true;
        panel.style.left = sl + 'px'; panel.style.top = st + 'px'; panel.style.right = 'auto';
        try{ panel.setPointerCapture(e.pointerId); }catch(_){}
        e.preventDefault();
      }
      function onPointerMove(e){ if(!dragging) return; const dx=e.clientX-sx, dy=e.clientY-sy; panel.style.left=(sl+dx)+'px'; panel.style.top=(st+dy)+'px'; }
      function onPointerUp(e){ dragging=false; try{ panel.releasePointerCapture(e.pointerId); }catch(_){} }
      panel.addEventListener('pointerdown', onPointerDown, {passive:false});
      window.addEventListener('pointermove', onPointerMove, {passive:true});
      window.addEventListener('pointerup', onPointerUp, {passive:true});
      window.addEventListener('pointercancel', onPointerUp, {passive:true});
    })();
  
    function autoFixJson(str) {
      // พยายามเติมปีกกา/วงเล็บ/quote ให้ครบ
      try { return JSON.parse(str); } catch {}
      let fixed = str.trim()
        .replace(/([,{]\s*)([a-zA-Z0-9_-]+)\s*:/g, '$1"$2":') // key ไม่มี quote
        .replace(/,\s*}/g, '}')
        .replace(/,\s*]/g, ']')
        .replace(/(['"])??([a-zA-Z0-9_-]+)(['"])?:/g, '"$2":') // key quote ผิด
        .replace(/:(\s*)'([^']*)'/g, ': "$2"') // value single quote
        .replace(/:(\s*)\b(true|false|null)\b/g, ': "$2"') // boolean/null เป็น string
        .replace(/\s+/g, ' ');
  
      try { return JSON.parse(fixed); } catch {}
      // เติม } ปิดท้ายถ้าขาด
      if(fixed.lastIndexOf('{') > fixed.lastIndexOf('}')) fixed += '}';
      try { return JSON.parse(fixed); } catch {}
      return {};
    }
  
    document.getElementById('sendBtn').onclick = () => {
      const url = document.getElementById('urlInput').value.trim();
      const method = document.getElementById('methodSelect').value;
      const body = document.getElementById('bodyInput').value;
      let headers = {};
      try {
        headers = autoFixJson(document.getElementById('headersInput').value);
      } catch { alert('Header ไม่ถูกต้องและไม่สามารถแก้ไขได้'); return; }
      fetch(url, {
        method,
        headers,
        body: method !== 'GET' ? body : null
      })
      .then(r => r.text())
      .then(txt => { document.getElementById('result').textContent = txt; })
      .catch(e => document.getElementById('result').textContent = 'เกิดข้อผิดพลาด: '+e);
    };
    document.getElementById('closeBtn').onclick = () => panel.remove();
  })();
  