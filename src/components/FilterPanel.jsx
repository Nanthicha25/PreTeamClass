import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  THAI_MONTHS,
  toBuddhistYear,
  toKey,
  buildMonthGrid,
  addMonths,
} from '../Date';
 
const WEEK_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
 
const checkboxClass =
  'appearance-none w-[20px] h-[12px] rounded-[3px] bg-[#D9D9D9] checked:bg-[#7C6BAF] cursor-pointer shrink-0 transition';
 
export default function FilterPanel({ onClose, onChange }) {
  const today = new Date(); // วันที่จริงจากเครื่อง
  const todayKey = toKey(today);
 
  const [members, setMembers] = useState({ natchaya: false, chayaporn: false });
  const [priority, setPriority] = useState({ urgent: false, normal: false });
  const [dueDate, setDueDate] = useState(todayKey); // คีย์วันที่ YYYY-MM-DD
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
 
  const cells = buildMonthGrid(view.year, view.month);
 
  const emit = (next) => onChange && onChange(next);
 
  const toggleMember = (key) => {
    const next = { ...members, [key]: !members[key] };
    setMembers(next);
    emit({ members: next, priority, dueDate });
  };
 
  const togglePriority = (key) => {
    const next = { ...priority, [key]: !priority[key] };
    setPriority(next);
    emit({ members, priority: next, dueDate });
  };
 
  const selectDate = (key) => {
    setDueDate(key);
    emit({ members, priority, dueDate: key });
  };
 
  const goMonth = (delta) => setView((v) => addMonths(v.year, v.month, delta));
 
  return (
    <div className="absolute right-0 mt-2 w-[270px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-120px)] overflow-y-auto bg-white shadow-2xl z-50 border border-gray-100 rounded-[10px]">
      {/* HEADER */}
      <div className="h-[32px] bg-[#D9D9D9] px-[12px] flex items-center justify-between">
        <h3 className="text-black font-bold text-[12px]">ตัวกรอง</h3>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-600 cursor-pointer transition"
          aria-label="ปิด"
        >
          <X className="w-[16px] h-[16px] stroke-[3]" />
        </button>
      </div>
 
      <div className="px-[14px] pt-[10px] pb-[12px]">
        {/* สมาชิก */}
        <span className="text-black font-bold text-[10px] block mb-[6px]">สมาชิก</span>
        <div className="space-y-[8px]">
          <label className="flex items-center gap-[10px] cursor-pointer">
            <input
              type="checkbox"
              className={checkboxClass}
              checked={members.natchaya}
              onChange={() => toggleMember('natchaya')}
            />
            <div className="w-[20px] h-[20px] rounded-full bg-[#FFD765] flex items-center justify-center text-[9px] font-bold text-black">
              N
            </div>
            <span className="text-[10px] text-gray-800">Natchaya Yada</span>
          </label>
          <label className="flex items-center gap-[10px] cursor-pointer">
            <input
              type="checkbox"
              className={checkboxClass}
              checked={members.chayaporn}
              onChange={() => toggleMember('chayaporn')}
            />
            <div className="w-[20px] h-[20px] rounded-full bg-[#6BF56B] flex items-center justify-center text-[9px] font-bold text-black">
              C
            </div>
            <span className="text-[10px] text-gray-800">Chayaporn Somsiri</span>
          </label>
        </div>
 
        <div className="h-[1px] bg-gray-200 my-[10px]" />
 
        {/* ความสำคัญ */}
        <span className="text-black font-bold text-[10px] block mb-[6px]">ความสำคัญ</span>
        <div className="space-y-[8px]">
          <label className="flex items-center gap-[10px] cursor-pointer">
            <input
              type="checkbox"
              className={checkboxClass}
              checked={priority.urgent}
              onChange={() => togglePriority('urgent')}
            />
            <span className="text-[10px] text-gray-800">งานด่วน</span>
          </label>
          <label className="flex items-center gap-[10px] cursor-pointer">
            <input
              type="checkbox"
              className={checkboxClass}
              checked={priority.normal}
              onChange={() => togglePriority('normal')}
            />
            <span className="text-[10px] text-gray-800">งานไม่ด่วน</span>
          </label>
        </div>
 
        <div className="h-[1px] bg-gray-200 my-[10px]" />
 
        {/* วันครบกำหนด + ปฏิทินย่อย */}
        <span className="text-black font-bold text-[10px] block mb-[6px]">วันครบกำหนด</span>
        <div className="w-full">
          {/* เดือน/ปี พ.ศ. + ปุ่มเลื่อนเดือน */}
          <div className="flex items-center justify-between mb-[4px]">
            <span className="text-[10px] font-semibold text-gray-700">
              {THAI_MONTHS[view.month]} {toBuddhistYear(view.year)}
            </span>
            <div className="flex items-center gap-[2px]">
              <button
                onClick={() => goMonth(-1)}
                className="w-[18px] h-[18px] flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded cursor-pointer"
                aria-label="เดือนก่อนหน้า"
              >
                <ChevronLeft className="w-[12px] h-[12px]" />
              </button>
              <button
                onClick={() => goMonth(1)}
                className="w-[18px] h-[18px] flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded cursor-pointer"
                aria-label="เดือนถัดไป"
              >
                <ChevronRight className="w-[12px] h-[12px]" />
              </button>
            </div>
          </div>
 
          <div className="grid grid-cols-7 text-center text-[8px] font-bold text-gray-600 mb-[3px]">
            {WEEK_HEADERS.map((w) => (
              <span key={w}>{w}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 text-center text-[9px]">
            {cells.map(({ date, current }) => {
              const key = toKey(date);
              const isSelected = key === dueDate;
              const isToday = key === todayKey;
              return (
                <button
                  key={key}
                  disabled={!current}
                  onClick={() => selectDate(key)}
                  className={`h-[18px] flex items-center justify-center transition ${
                    current
                      ? 'text-gray-800 cursor-pointer hover:bg-gray-100'
                      : 'text-gray-300 cursor-default'
                  } ${isToday && !isSelected ? '!text-[#0B57D0] font-bold' : ''} ${
                    isSelected ? '!text-[#0B57D0] font-bold border-b-2 border-[#0B57D0]' : ''
                  }`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}