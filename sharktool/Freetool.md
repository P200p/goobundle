# โหลดและติดตั้งkiwi browser android

[กดตรงนี้](https://apkpure.com/kiwi-browser-fast-quiet/com.kiwibrowser.browser)

## คู่มือ SharkTool Loader (ใช้งานง่าย สำหรับมือถือและเดสก์ท็อป)

เอกสารนี้ช่วยให้คุณหรือผู้ใช้ที่ไม่มีพื้นฐาน สามารถเรียกใช้ “แผงโหลดเครื่องมือ” และสลับธีมหน้าเว็บเพื่อถ่ายภาพตัวอย่างได้สะดวก

---

## วิธีใช้งานแบบเร็ว (Bookmarklet / ปุ่มลัด)

คัดลอกโค้ดด้านล่างไปวางเป็น Bookmark/ปุ่มลัด แล้วกดใช้งานบนหน้าเว็บใดก็ได้:

```javascript
javascript:(function(){var s=document.createElement('script');s.src='https://sharkkadaw.netlify.app/sharktool/loader.js';document.body.appendChild(s)})()
```

สิ่งที่จะเกิดขึ้น:

- แผง “SharkTool Loader” จะแสดงที่มุมขวาบน
- เลือกธีมของหน้าเว็บ (System / Light / Dark / Cyber / Pastel / Retro)
- ติ๊กเลือกเครื่องมือ แล้วกด Load เพื่อโหลดสคริปต์ตามรายการ

> หมายเหตุ: ถ้าหน้าเว็บมี CSP เข้ม อาจบล็อกการโหลดสคริปต์จากภายนอก

---

## การตั้งปุ่มลัดบน Kiwi Browser (Android)

1) ติดตั้ง Kiwi Browser

- ดาวน์โหลด: [https://apkpure.com/kiwi-browser-fast-quiet/com.kiwibrowser.browser](https://apkpure.com/kiwi-browser-fast-quiet/com.kiwibrowser.browser)

2) สร้างปุ่มลัด (Bookmarks bar)

- เปิดเมนู ตั้งค่า > เครื่องมือลัด > สร้างปุ่มใหม่
- วางโค้ด Bookmarklet (ด้านบน) ตั้งชื่อ และบันทึก
- กลับไปหน้าเว็บที่ต้องการ กดปุ่มลัดเพื่อเปิดแผง Loader

เคล็ดลับ: วางปุ่มลัดไว้ข้างช่อง URL เพื่อกดใช้งานได้เร็ว

---

## การใช้งานแผง SharkTool Loader

หลังจากแผงเปิดขึ้น:

- เลือกธีมหน้าเว็บจากแถบ “Page Theme” ด้านบน (จำค่าที่เลือกไว้ให้อัตโนมัติ)
- ค้นหาเครื่องมือด้วยช่องค้นหา
- ปุ่ม “เลือกทั้งหมด/ยกเลิกทั้งหมด” เพื่อจัดรายการอย่างรวดเร็ว
- ติ๊กเลือกเครื่องมือที่ต้องการ แล้วกดปุ่ม “Load”
- สถานะการโหลดจะแสดงในส่วน Log ด้านล่าง (สำเร็จ/ผิดพลาด)

เครื่องมือที่รองรับ (ตัวอย่าง):

- Monitor, Theme, Tool X, BurpShark, SharkScan, Dev Panel

---

## เพิ่ม/แก้รายการเครื่องมือ (ผู้ดูแลระบบ)

แผง Loader จะพยายามโหลดรายการจาก `manifest.json` ก่อน:

- URL: `https://sharkkadaw.netlify.app/sharktool/manifest.json`
- แก้ไขรายการได้โดยปรับไฟล์ `sharktool/manifest.json` ในโปรเจค แล้ว deploy ขึ้น Netlify ให้ URL ตรง
- ถ้าดึง manifest ไม่ได้ จะ fallback ไปที่รายการที่ฝังใน `sharktool/loader.js`

ตัวอย่างเอนทรีใน `manifest.json`:

```json
[
  { "id": "monitor",   "name": "Monitor",   "url": "monitor.js" },
  { "id": "theme",     "name": "Theme",     "url": "Theme.js" },
  { "id": "burpshark", "name": "BurpShark", "url": "burpshark.js" }
]
```

ข้อควรระวัง:

- ตัวพิมพ์ใหญ่/เล็กของชื่อไฟล์บน URL ต้องตรง
- ไฟล์ปลายทางต้องอนุญาตให้โหลดจากต้นทาง (อาจติด CSP)

---

## โหมดโลคัลในโปรเจคนี้ (ไม่ผ่าน Netlify)

ฝัง Loader โดยตรงในหน้า HTML (เช่น `index.html`):

```html
<script src="./sharktool/loader.js"></script>
```

เปิดหน้าในเบราว์เซอร์ แผง Loader จะโผล่ทางขวาบนเหมือนกัน

หมายเหตุสำหรับการโฮสต์บน Netlify แบบโฟลเดอร์ย่อย เช่น `/sell/`:
- วางไฟล์ `loader.js` และ `manifest.json` ไว้ในโฟลเดอร์เดียวกัน (เช่น `sell/`)
- วางไฟล์เครื่องมือ (`burpshark.js`, `sharkscan.js`, `tool.js`, ฯลฯ) ไว้โฟลเดอร์เดียวกันด้วย
- ระบบ Loader จะคำนวณ BASE จาก URL ของตัวเองอัตโนมัติ และอ่าน `manifest.json` ที่อยู่พาธเดียวกัน

---

## สคริปต์แบบ “วางครั้งเดียว โหลดหลายไฟล์” (ไม่ใช้ UI)

ถ้าต้องการเพียงโหลดสคริปต์หลายไฟล์เรียงลำดับ โดยไม่ใช้ UI:

```html
<script>
(async function(){
  const tools = [
    'https://sharkkadaw.netlify.app/sharktool/monitor.js',
    'https://sharkkadaw.netlify.app/sharktool/Theme.js',
    'https://sharkkadaw.netlify.app/sharktool/tool-x.js',
    'https://sharkkadaw.netlify.app/sharktool/burpshark.js',
    'https://sharkkadaw.netlify.app/sharktool/sharkscan.js',
    'https://sharkkadaw.netlify.app/sharktool/tool.js'
  ];
  const load = url => new Promise((res, rej) => {
    const s = document.createElement('script'); s.src = url;
    s.onload = () => res(url); s.onerror = () => rej(new Error('Load failed: ' + url));
    document.body.appendChild(s);
  });
  for (const u of tools) { try { await load(u); } catch(e){ console.error(e); } }
})();
</script>
```

---

## Troubleshooting

- __CSP Blocked__: ถ้าหน้าปลายทางบล็อกสคริปต์ภายนอก Loader อาจไม่ทำงาน ให้ใช้หน้าอื่น หรือโฮสต์สคริปต์ให้โดเมนอยู่ใน allowlist ของเว็บนั้น
- __โหลดไม่ขึ้น__: ตรวจสอบ URL และการสะกดชื่อไฟล์ให้ตรง 100%
- __ธีมไม่เปลี่ยนบางจุด__: เว็บนั้นอาจมี CSS ที่เฉพาะเจาะจงมาก ธีมจะครอบคลุม element หลัก แต่บางส่วนอาจไม่ถูก override

---

## ภาคผนวก: โค้ดแบบดั้งเดิม (แก้รูปแบบที่ถูกต้อง)

ตัวอย่างการโหลดสคริปต์ 1 ไฟล์ด้วย `try/catch` ที่ถูกต้อง:

```javascript
(function(){
  try {
    const s = document.createElement('script');
    s.src = 'https://sharkkadaw.netlify.app/sharktool/monitor.js';
    document.body.appendChild(s);
  } catch(e) {
    console.error('Error loading monitor.js', e);
  }
})();
```
