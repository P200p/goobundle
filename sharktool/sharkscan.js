// FireCompass Automated Recon + Red Teaming (Lab Debug Tools)
(function(){
    const panel = document.createElement('div');
    panel.style.cssText = `
      position:fixed; top:120px; left:50%; transform:translateX(-50%);
      z-index:99999; background:rgba(0,0,0,0.92); color:#fff;
      padding:18px 22px; border-radius:12px; border:2px solid #2196f3;
      box-shadow:0 0 16px #2196f399; font-family:sans-serif; min-width:290px; text-align:center;
    `;
    panel.innerHTML = `
      <div style="font-size:19px; margin-bottom:12px; color:#03a9f4;">
        เครื่องมือดีบักเบื้องต้น (Lab)
      </div>
      <button id="pingBtn" style="margin:6px 0; width:90%; padding:8px; border-radius:6px; border:none; background:#263238; color:#fff; font-size:15px;">Ping เว็บไซต์</button><br>
      <button id="whoisBtn" style="margin:6px 0; width:90%; padding:8px; border-radius:6px; border:none; background:#263238; color:#fff; font-size:15px;">Whois Lookup</button><br>
      <button id="dnsBtn" style="margin:6px 0; width:90%; padding:8px; border-radius:6px; border:none; background:#263238; color:#fff; font-size:15px;">DNS Lookup</button><br>
      <button id="httpBtn" style="margin:6px 0; width:90%; padding:8px; border-radius:6px; border:none; background:#263238; color:#fff; font-size:15px;">HTTP Headers</button><br>
      <button id="closeBtn" style="margin:10px 0 0 0; width:90%; padding:8px; border-radius:6px; border:none; background:#b71c1c; color:#fff; font-size:15px;">ปิดหน้าต่าง</button>
      <div id="result" style="margin-top:12px; text-align:left; font-size:13px; color:#fff;"></div>
    `;
    document.body.appendChild(panel);
  
    // ฟังก์ชันดึงข้อมูลจาก API ฟรี (เช่น api.hackertarget.com)
    function fetchTool(url, cb) {
      fetch(url).then(r=>r.text()).then(cb)
        .catch(()=>cb('เกิดข้อผิดพลาดหรือโดนบล็อก CORS'));
    }
  
    // Ping
    document.getElementById('pingBtn').onclick = () => {
      const target = prompt('ใส่โดเมนหรือ IP ที่ต้องการ Ping:');
      if(target) {
        document.getElementById('result').textContent = 'กำลัง Ping...';
        fetchTool('https://api.hackertarget.com/nping/?q='+encodeURIComponent(target), res=>{
          document.getElementById('result').textContent = res;
        });
      }
    };
  
    // Whois
    document.getElementById('whoisBtn').onclick = () => {
      const target = prompt('ใส่โดเมนที่ต้องการ Whois:');
      if(target) {
        document.getElementById('result').textContent = 'กำลังค้นหา Whois...';
        fetchTool('https://api.hackertarget.com/whois/?q='+encodeURIComponent(target), res=>{
          document.getElementById('result').textContent = res;
        });
      }
    };
  
    // DNS Lookup
    document.getElementById('dnsBtn').onclick = () => {
      const target = prompt('ใส่โดเมนที่ต้องการ DNS Lookup:');
      if(target) {
        document.getElementById('result').textContent = 'กำลังค้นหา DNS...';
        fetchTool('https://api.hackertarget.com/dnslookup/?q='+encodeURIComponent(target), res=>{
          document.getElementById('result').textContent = res;
        });
      }
    };
  
    // HTTP Headers
    document.getElementById('httpBtn').onclick = () => {
      const target = prompt('ใส่ URL ที่ต้องการดู HTTP Headers:');
      if(target) {
        document.getElementById('result').textContent = 'กำลังดึง HTTP Headers...';
        fetchTool('https://api.hackertarget.com/httpheaders/?q='+encodeURIComponent(target), res=>{
          document.getElementById('result').textContent = res;
        });
      }
    };
  
    // ปิดหน้าต่าง
    document.getElementById('closeBtn').onclick = () => panel.remove();
  })();
