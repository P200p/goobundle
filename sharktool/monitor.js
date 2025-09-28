(function(){
  // SharkTool Monitor (minimal, safe)
  const ID = 'sharktool-monitor-panel';
  if (document.getElementById(ID)) return; // prevent duplicate

  // Styles
  const style = document.createElement('style');
  style.textContent = `
    #${ID}{position:fixed;bottom:20px;right:20px;z-index:2147483647;width:320px;background:#0b1220;color:#e2e8f0;border:1px solid #334155;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.4);font:13px/1.4 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
    #${ID} header{display:flex;align-items:center;justify-content:space-between;padding:8px 10px;border-bottom:1px solid #1f2a44;cursor:move;user-select:none;touch-action:none}
    #${ID} header .ttl{font-weight:700;display:flex;gap:6px;align-items:center}
    #${ID} .body{padding:8px;display:flex;flex-direction:column;gap:6px}
    #${ID} .row{display:flex;gap:8px;align-items:center}
    #${ID} .kv{display:flex;gap:6px;flex-wrap:wrap;color:#93c5fd}
    #${ID} .log{height:140px;overflow:auto;white-space:pre-wrap;background:#0f172a;border:1px dashed #334155;border-radius:8px;padding:6px;color:#93c5fd;-webkit-overflow-scrolling:touch}
    #${ID} button{background:#334155;color:#e2e8f0;border:none;border-radius:8px;padding:6px 10px;cursor:pointer}
  `;
  document.head.appendChild(style);

  // Panel
  const el = document.createElement('div');
  el.id = ID;
  el.innerHTML = `
    <header>
      <div class="ttl">🦈 Monitor</div>
      <div>
        <button id="stm-min">↕</button>
        <button id="stm-close">ปิด</button>
      </div>
    </header>
    <div class="body">
      <div class="kv">
        <div>URL: <b>${location.href}</b></div>
        <div>| Online: <b id="stm-online">${navigator.onLine}</b></div>
        <div>| SW: <b id="stm-sw">…</b></div>
      </div>
      <div class="row">
        <button id="stm-logcap">Log: On</button>
        <button id="stm-clear">ล้าง Log</button>
        <button id="stm-cclr">Clear Console</button>
        <button id="stm-ping">Ping</button>
        <span id="stm-ping-res" style="color:#a7f3d0"></span>
      </div>
      <div id="stm-log" class="log"></div>
    </div>
  `;
  document.body.appendChild(el);

  const logEl = el.querySelector('#stm-log');
  function line(msg){ logEl.textContent += (new Date()).toLocaleTimeString()+" "+msg+"\n"; logEl.scrollTop = logEl.scrollHeight; }

  // Basic info
  line('เริ่มทำงาน Monitor');
  line('UA: ' + navigator.userAgent);

  // Online status
  function updOnline(){ el.querySelector('#stm-online').textContent = navigator.onLine; }
  window.addEventListener('online', updOnline);
  window.addEventListener('offline', updOnline);

  // Service worker status
  (async function(){
    try{
      if ('serviceWorker' in navigator) {
        const r = await navigator.serviceWorker.getRegistrations();
        el.querySelector('#stm-sw').textContent = r.length ? 'registered(' + r.length + ')' : 'none';
      } else {
        el.querySelector('#stm-sw').textContent = 'unsupported';
      }
    }catch(e){ el.querySelector('#stm-sw').textContent = 'error'; }
  })();

  // Ping
  el.querySelector('#stm-ping').onclick = async () => {
    try{
      const t0 = performance.now();
      const r = await fetch(location.href, { method:'HEAD', cache:'no-store' });
      const t1 = performance.now();
      el.querySelector('#stm-ping-res').textContent = `${Math.round(t1-t0)} ms (${r.status})`;
      line('Ping OK ' + Math.round(t1-t0) + ' ms');
    }catch(e){
      el.querySelector('#stm-ping-res').textContent = 'ERR';
      line('Ping ERR ' + e);
    }
  };

  // Clear
  el.querySelector('#stm-clear').onclick = () => { logEl.textContent = ''; };
  // Console clear
  el.querySelector('#stm-cclr').onclick = () => { try{ console.clear(); }catch(_){} logEl.textContent=''; };

  // Minimize/Close
  let minimized = false;
  el.querySelector('#stm-min').onclick = () => {
    minimized = !minimized;
    el.querySelector('.body').style.display = minimized ? 'none' : '';
  };
  el.querySelector('#stm-close').onclick = () => { el.remove(); style.remove(); };
  
  // Drag (mouse + touch)
  (function(){
    const header = el.querySelector('header');
    let dragging=false, startX=0, startY=0, origLeft=0, origTop=0;
    function px(n){ return Math.max(0, n) + 'px'; }
    function start(clientX, clientY){
      dragging=true;
      const rect = el.getBoundingClientRect();
      el.style.left = rect.left + 'px';
      el.style.top  = rect.top  + 'px';
      el.style.right='auto';
      el.style.bottom='auto';
      startX = clientX; startY = clientY; origLeft = rect.left; origTop = rect.top;
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onEnd);
      document.addEventListener('touchmove', onTouchMove, {passive:false});
      document.addEventListener('touchend', onEnd);
    }
    function onMove(e){ if(!dragging) return; e.preventDefault(); const nx = origLeft + (e.clientX - startX); const ny = origTop + (e.clientY - startY); el.style.left = px(nx); el.style.top = px(ny); }
    function onTouchMove(e){ if(!dragging) return; if(e.touches && e.touches[0]){ e.preventDefault(); const t=e.touches[0]; const nx = origLeft + (t.clientX - startX); const ny = origTop + (t.clientY - startY); el.style.left = px(nx); el.style.top = px(ny); } }
    function onEnd(){ dragging=false; document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onEnd); document.removeEventListener('touchmove', onTouchMove); document.removeEventListener('touchend', onEnd); }
    header.addEventListener('mousedown', e=> start(e.clientX, e.clientY));
    header.addEventListener('touchstart', e=>{ const t=e.touches&&e.touches[0]; if(!t) return; start(t.clientX, t.clientY); }, {passive:true});
  })();

  // Capture console into monitor log (forward to original)
  const __orig = { log: console.log, info: console.info, warn: console.warn, error: console.error, debug: console.debug };
  let captureOn = true;
  function toStr(v){ try{ if(typeof v==='string') return v; return JSON.stringify(v); }catch(_){ try{return String(v);}catch(__){return '[Unserializable]';} } }
  function capture(level, args){ if(!captureOn) return; try{ line('['+level+'] ' + Array.from(args).map(toStr).join(' ')); }catch(_){} }
  ['log','info','warn','error','debug'].forEach(function(level){
    try{
      console[level] = function(){
        try { capture(level, arguments); } catch (_){/* noop */}
        return __orig[level].apply(console, arguments);
      };
    }catch(_){}
  });
  // Toggle capture
  const capBtn = el.querySelector('#stm-logcap');
  capBtn.onclick = function(){ captureOn = !captureOn; capBtn.textContent = 'Log: ' + (captureOn ? 'On' : 'Off'); };
  // Error events
  window.addEventListener('error', function(e){ capture('error', [e.message || 'Error', e.filename+':'+e.lineno]); });
  window.addEventListener('unhandledrejection', function(e){ capture('error', ['UnhandledRejection', e.reason]); });

  // Restore console when closing
  const origClose = el.querySelector('#stm-close').onclick;
  el.querySelector('#stm-close').onclick = () => {
    ['log','info','warn','error','debug'].forEach(k=>{ try{ console[k] = __orig[k]; }catch(_){} });
    origClose();
  };
})();
