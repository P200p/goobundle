# SharkTool — คู่มือแยกสำหรับ User และ Dev

---

## สำหรับผู้ใช้ทั่วไป (User Guide)

- วิธีติดตั้งและใช้งาน Loader (Bookmarklet, ปุ่มลัด, ฝังใน HTML)
- การเลือกและโหลดเครื่องมือ
- การเปลี่ยนธีมหน้าเว็บ
- การแก้ปัญหาเบื้องต้น (CSP, โหลดไม่ขึ้น, ธีมไม่เปลี่ยน)
- ตัวอย่างโค้ด Bookmarklet และ Script Loader
- คำแนะนำการใช้งานบน Kiwi Browser/มือถือ/เดสก์ท็อป

**อ่านคู่มือหลักใน Freetool.md**

---

## สำหรับนักพัฒนา/ผู้ดูแลระบบ (Dev Guide)

### 1. โครงสร้างไฟล์หลัก
- `sharktool/loader.js` — สคริปต์หลักสำหรับแสดง UI Loader
- `sharktool/manifest.json` — รายการเครื่องมือ (JSON array)
- `sharktool/*.js` — ไฟล์เครื่องมือแต่ละตัว (เช่น monitor.js, Theme.js, burpshark.js)
- `sharktool/panel-theme.css` — สไตล์ธีมของ Loader

### 2. การเพิ่ม/แก้ไขเครื่องมือ
- เพิ่ม entry ใน `manifest.json` (id, name, url, description)
- วางไฟล์ JS เครื่องมือในโฟลเดอร์ sharktool
- Deploy ให้ URL ตรงกับ manifest
- Loader จะอ่าน manifest อัตโนมัติ (ถ้าโหลดไม่ได้จะ fallback ไป default)

### 3. การปรับแต่ง Loader
- แก้ไข UI/ฟีเจอร์ใน `loader.js`
- ปรับธีมหรือ CSS ใน `panel-theme.css`
- ทดสอบ Loader ทั้งแบบ local และบน Netlify

### 4. การ deploy
- Deploy sharktool ทั้งโฟลเดอร์ขึ้น Netlify หรือโฮสต์อื่น
- ตรวจสอบ path และ URL ให้ตรงกับที่ manifest.json ระบุ
- ถ้า deploy ใน subfolder (เช่น /sell/) ให้ loader.js, manifest.json, *.js อยู่ในโฟลเดอร์เดียวกัน

### 5. ข้อควรระวัง
- ตัวพิมพ์ใหญ่/เล็กของชื่อไฟล์สำคัญมาก (case-sensitive)
- CSP ของเว็บปลายทางอาจบล็อกการโหลดสคริปต์
- อย่า hardcode path ใน loader.js ให้ใช้ relative path หรือคำนวณ BASE อัตโนมัติ
- ทดสอบ fallback กรณี manifest โหลดไม่ได้
- อัปเดตเอกสารทุกครั้งที่เพิ่ม/ลบเครื่องมือ

---

## หมายเหตุ
- User อ่านเฉพาะส่วนต้น (Freetool.md)
- Dev/Agent อ่านไฟล์นี้ก่อนแก้ไขหรือ deploy
- ถ้า agent/AI dev หลง context ให้กลับมาอ่านไฟล์นี้ใหม่
