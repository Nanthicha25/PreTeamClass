// ตัวช่วยเรื่องวันที่ ใช้ร่วมกันระหว่าง CalendarView และ FilterPanel
// ใช้วันที่จริงจากเครื่อง (new Date()) และแสดงปีเป็น พ.ศ.
 
export const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
];
 
export const THAI_MONTHS_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
];
 
export const toBuddhistYear = (year) => year + 543;
 
// สร้างคีย์วันที่แบบ YYYY-MM-DD (ปี ค.ศ., ตามเวลาท้องถิ่นของเครื่อง)
export function toKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
 
// สร้างช่องวันที่ทั้งหมดของเดือน (เริ่มต้นสัปดาห์ที่วันอาทิตย์)
// จำนวนแถวปรับตามเดือนจริง (4 ถึง 6 แถว)
export function buildMonthGrid(year, month) {
  const startOffset = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weeks = Math.ceil((startOffset + daysInMonth) / 7);
 
  const cells = [];
  for (let i = 0; i < weeks * 7; i++) {
    const date = new Date(year, month, 1 - startOffset + i);
    cells.push({ date, current: date.getMonth() === month });
  }
  return cells;
}
 
// เลื่อนเดือนไปข้างหน้า/ถอยหลัง (ข้ามปีให้อัตโนมัติ)
export function addMonths(year, month, delta) {
  const d = new Date(year, month + delta, 1);
  return { year: d.getFullYear(), month: d.getMonth() };
}
 