// MiniBurp: Request Converter (Mobile & PC)
(function(){
    const panel = document.createElement('div');
    panel.style.cssText = `
      position:fixed; top:20px; right:20px;
      z-index:99999; background:rgba(0,0,0,0.96); color:#fff;
      padding:16px 12px; border-radius:10px; border:2px solid #00bcd4;
      box-shadow:0 0 14px #00bcd488; font-family:sans-serif; min-width:320px; max-width:96vw; touch-action:none;
    `;
    panel.innerHTML = `
      <div style="font-size:17px; margin-bottom:10px; color:#00e5ff;">MiniBurp - ตัวแปลง Request</div>
      <textarea id="inputArea" placeholder="วาง Payload, Response หรือ HAR JSON ที่นี่..." style="width:98%;height:90px;resize:vertical;border-radius:6px;padding:7px;font-size:14px;"></textarea><br>
      <button id="convertBtn" style="margin:9px 0 7px 0; padding:8px 18px; border-radius:6px; border:none; background:#0097a7; color:#fff; font-size:15px;">แปลงเป็น Request</button>
      <button id="closeBtn" style="margin-left:10px; padding:8px 18px; border-radius:6px; border:none; background:#b71c1c; color:#fff; font-size:15px;">ปิด</button>
      <textarea id="outputArea" placeholder="Request ที่แปลงแล้วจะแสดงตรงนี้..." style="width:98%;height:90px;resize:vertical;border-radius:6px;padding:7px;font-size:14px;margin-top:7px;"></textarea>
      <div style="margin-top:6px;">
        <button id="copyBtn" style="padding:6px 18px; border-radius:6px; border:none; background:#43a047; color:#fff; font-size:14px;">คัดลอก Request</button>
      </div>
      <div id="msg" style="margin-top:7px; color:#ffeb3b; font-size:13px;"></div>
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
  
    // HAR/Raw/Response to Request Parser
    function parseInput(input) {
      // 1. HAR JSON
      try {
        const har = JSON.parse(input);
        if(har && har.log && har.log.entries && har.log.entries.length) {
          const entry = har.log.entries[0];
          const req = entry.request;
          let out = `${req.method} ${req.url} HTTP/1.1\n`;
          req.headers.forEach(h=>{ out += `${h.name}: ${h.value}\n`; });
          out += '\n';
          if(req.postData && req.postData.text) out += req.postData.text;
          return out.trim();
        }
      } catch {}
      // 2. Raw HTTP Request
      if(/^([A-Z]+)\s+\S+\s+HTTP/i.test(input)) {
        // --- Auto-format ---
        let lines = input.replace(/\r/g,'').split('\n');
        let reqLine = lines[0].replace(/\s+/g,' ').trim();
        let headers = [];
        let bodyIdx = lines.findIndex(l=>/^\s*$/.test(l));
        let body = bodyIdx>=0 ? lines.slice(bodyIdx+1).join('\n').trim() : '';
        let headerLines = bodyIdx>=0 ? lines.slice(1,bodyIdx) : lines.slice(1);
        let hasHost = false, hasUA = false;
        headerLines.forEach(h=>{
          if(/^host:/i.test(h)) hasHost=true;
          if(/^user-agent:/i.test(h)) hasUA=true;
          if(h.trim()) headers.push(h.replace(/\s+/g,' ').trim());
        });
        if(!hasHost) headers.unshift('Host: example.com');
        if(!hasUA) headers.push('User-Agent: MiniBurp/1.0');
        let out = reqLine+'\n'+headers.join('\n')+'\n\n'+body;
        return out.trim();
      }
      // 3. Response (พยายามดึง request line+headers)
      if(/HTTP\/\d\.\d\s+\d+/.test(input)) {
        const lines = input.split(/\r?\n/);
        let idx = lines.findIndex(l=>/^\s*$/.test(l));
        if(idx > 0) {
          return lines.slice(0,idx).join('\n');
        }
      }
      return '// ไม่สามารถแปลงข้อมูลนี้เป็น HTTP request ได้';
    }
  
    document.getElementById('convertBtn').onclick = () => {
      const input = document.getElementById('inputArea').value.trim();
      if(!input) {
        document.getElementById('msg').textContent = 'กรุณาวางข้อมูลก่อน';
        return;
      }
      const req = parseInput(input);
      document.getElementById('outputArea').value = req;
      document.getElementById('msg').textContent = req.startsWith('//') ? 'ข้อมูลไม่ถูกต้องหรือไม่รองรับ' : 'แปลงสำเร็จ!';
    };
  
    document.getElementById('closeBtn').onclick = () => panel.remove();
  
    document.getElementById('copyBtn').onclick = () => {
      const txt = document.getElementById('outputArea').value;
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(txt).then(()=>{
          document.getElementById('msg').textContent = 'คัดลอกแล้ว!';
        }).catch(()=>{
          fallbackCopy(txt);
        });
      } else {
        fallbackCopy(txt);
      }
    };

    function fallbackCopy(text) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.top = '-1000px';
      document.body.appendChild(ta);
      ta.focus(); ta.select();
      try {
        const ok = document.execCommand('copy');
        document.getElementById('msg').textContent = ok ? 'คัดลอกแล้ว!' : 'คัดลอกไม่สำเร็จ';
      } catch(e) {
        document.getElementById('msg').textContent = 'คัดลอกไม่สำเร็จ: ' + e;
      }
      document.body.removeChild(ta);
    }
  
  })();