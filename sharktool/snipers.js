(function(){
  // SharkSnipers: CSS selector auto-clicker (safe & minimal)
  const panel = document.createElement('div');
  panel.id = 'shark-snipers-panel';
  panel.style.cssText = [
    'position:fixed',
    'z-index:2147483647',
    'top:20px',
    'right:20px',
    'background:#111',
    'color:#fff',
    'font:14px/1.4 system-ui, -apple-system, Segoe UI, Roboto, Arial',
    'border:1px solid #333',
    'border-radius:8px',
    'box-shadow:0 6px 18px rgba(0,0,0,.4)',
    'width:300px',
    'max-width:90vw',
    'padding:10px',
    'touch-action:none' // allow smooth pointer dragging
  ].join(';');

  panel.innerHTML = '' +
    '<div id=\'ss-header\' style=\'display:flex;justify-content:space-between;align-items:center;gap:8px;margin:-10px -10px 8px -10px;padding:8px 10px;cursor:move;background:#0d0d0d;border-bottom:1px solid #222;border-top-left-radius:8px;border-top-right-radius:8px\'>' +
      '<strong>SharkSnipers</strong>' +
      '<div>' +
        '<button id=\'ss-min\' style=\'margin-right:6px\'>_</button>' +
        '<button id=\'ss-close\'>✕</button>' +
      '</div>' +
    '</div>' +
    '<label style=\'display:block;margin:6px 0 4px\'>CSS Selector</label>' +
    '<input id=\'ss-selector\' type=\'text\' placeholder=\'เช่น .btn.buy-now\' style=\'width:100%;padding:6px;border-radius:4px;border:1px solid #444;background:#1a1a1a;color:#fff\'/>' +
    '<div style=\'display:flex;gap:8px;margin-top:8px;align-items:center;\'>' +
      '<label>Interval (ms)</label>' +
      '<input id=\'ss-interval\' type=\'number\' min=\'50\' value=\'1000\' style=\'width:100px;padding:4px;border-radius:4px;border:1px solid #444;background:#1a1a1a;color:#fff\'/>' +
    '</div>' +
    '<div style=\'display:flex;gap:8px;margin-top:10px;\'>' +
      '<button id=\'ss-start\' style=\'flex:1;background:#16a34a;color:#fff;border:none;border-radius:6px;padding:8px 10px\'>Start</button>' +
      '<button id=\'ss-stop\'  style=\'flex:1;background:#dc2626;color:#fff;border:none;border-radius:6px;padding:8px 10px\' disabled>Stop</button>' +
    '</div>' +
    '<div style=\'margin-top:8px;font-size:12px;color:#ccc\'>' +
      '<span id=\'ss-status\'>พร้อม</span> · คลิกแล้ว: <span id=\'ss-count\'>0</span>' +
    '</div>' +
    '<div style=\'margin-top:6px;font-size:12px;color:#999\'>' +
      'ใช้อย่างระมัดระวัง เคารพกติกาของเว็บไซต์ และข้อกำหนดการใช้งาน' +
    '</div>';

  document.body.appendChild(panel);

  // Drag from anywhere on panel (except interactive controls)
  (function enableDrag(){
    let dragging=false, sx=0, sy=0, sl=0, st=0;
    function onPointerDown(e){
      const el = e.target;
      if (el.closest('button, input, select, textarea, a, label')) return;
      const r=panel.getBoundingClientRect(); sl=r.left; st=r.top; sx=e.clientX; sy=e.clientY; dragging=true;
      panel.style.left = sl + 'px'; panel.style.top = st + 'px'; panel.style.right='auto';
      try{ panel.setPointerCapture(e.pointerId); }catch(_){ }
      e.preventDefault();
    }
    function onPointerMove(e){ if(!dragging) return; const dx=e.clientX-sx, dy=e.clientY-sy; panel.style.left=(sl+dx)+'px'; panel.style.top=(st+dy)+'px'; }
    function onPointerUp(e){ dragging=false; try{ panel.releasePointerCapture(e.pointerId); }catch(_){} }
    panel.addEventListener('pointerdown', onPointerDown, {passive:false});
    window.addEventListener('pointermove', onPointerMove, {passive:true});
    window.addEventListener('pointerup', onPointerUp, {passive:true});
    window.addEventListener('pointercancel', onPointerUp, {passive:true});
  })();

  const $ = (s)=>panel.querySelector(s);
  const selInput = $('#ss-selector');
  const intInput = $('#ss-interval');
  const startBtn = $('#ss-start');
  const stopBtn  = $('#ss-stop');
  const statusEl = $('#ss-status');
  const countEl  = $('#ss-count');

  let timer=null, count=0, minimized=false;
  panel.querySelector('#ss-close').onclick = ()=>{ try{ panel.remove(); }catch(_){} };
  panel.querySelector('#ss-min').onclick = ()=>{ minimized=!minimized; Array.from(panel.children).forEach((ch,i)=>{ if(i>0) ch.style.display = minimized ? 'none' : ''; }); };
  function setStatus(t){ statusEl.textContent=t; }
  function enableRun(r){ startBtn.disabled=r; stopBtn.disabled=!r; }
  function clickOnce(q){ let clicked=0; try{ document.querySelectorAll(q).forEach(n=>{ try{ n.click(); clicked++; }catch(_){} }); }catch(err){ console.warn('SharkSnipers selector error:', err); setStatus('Selector ไม่ถูกต้อง'); } return clicked; }
  startBtn.onclick = ()=>{ const q=(selInput.value||'').trim(); const ms=Math.max(50, parseInt(intInput.value||'1000',10)); if(!q){ setStatus('กรุณาใส่ CSS Selector'); return; } if(timer) clearInterval(timer); count=0; countEl.textContent='0'; enableRun(true); setStatus('กำลังทำงานทุก '+ms+' ms'); timer=setInterval(()=>{ const c=clickOnce(q); if(c>0){ count+=c; countEl.textContent=String(count); } }, ms); };
  stopBtn.onclick = ()=>{ if(timer){ clearInterval(timer); timer=null; } enableRun(false); setStatus('หยุดทำงาน'); };
})();
