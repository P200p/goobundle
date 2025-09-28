// วิธีใช้ (มือใหม่):
// 1) คัดลอกบรรทัด IIFE ด้านล่างทั้งบรรทัด
// 2) สร้างบุ๊คมาร์กใหม่ แล้ววางในช่อง URL จากนั้นตั้งชื่อเช่น "SharkTool"
// 3) เปิดหน้าเว็บเป้าหมาย แล้วกดปุ่มบุ๊คมาร์กที่สร้างไว้

// Bookmarklet IIFE (โหลด SharkTool Loader จาก Netlify)
javascript:(function(){
  try {
    var s = document.createElement('script');
    s.src = 'https://sharkkadaw.netlify.app/sharktool/loader.js';
    document.body.appendChild(s);
  } catch(e) {
    console.error('Error loading loader.js', e);
  }
})();
