import React, { useState } from 'react';
import {
  THAI_MONTHS,
  THAI_MONTHS_SHORT,
  toBuddhistYear,
  toKey,
  buildMonthGrid,
  addMonths,
} from '../Date';
 
const WEEKDAYS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์'];
 
// งานในปฏิทิน: คีย์เป็นวันที่แบบ YYYY-MM-DD (ปี ค.ศ.)
// 2026-07-23 = 23 ก.ค. 2569 (ตรงกับ "วันครบกำหนด 23/07/69" ใน AssignmentsView)
const DEFAULT_TASKS = {
  '2026-07-23': [{ id: 1, title: 'Work1' }],
};
 
function ArrowTriangle({ direction = 'left', onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-[34px] h-[34px] flex items-center justify-center cursor-pointer hover:opacity-70 transition"
      aria-label={direction === 'left' ? 'เดือนก่อนหน้า' : 'เดือนถัดไป'}
    >
      <svg width="34" height="34" viewBox="0 0 34 34">
        <path
          d={direction === 'left' ? 'M26 3 L26 31 L6 17 Z' : 'M8 3 L8 31 L28 17 Z'}
          fill="#D9D9D9"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
 
export default function CalendarView({ tasks = DEFAULT_TASKS }) {
  const today = new Date(); // วันที่จริงจากเครื่อง
  const todayKey = toKey(today);
 
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selectedKey, setSelectedKey] = useState(todayKey);
 
  const cells = buildMonthGrid(view.year, view.month);
 
  const goMonth = (delta) => setView((v) => addMonths(v.year, v.month, delta));
  const goToday = () => {
    setView({ year: today.getFullYear(), month: today.getMonth() });
    setSelectedKey(todayKey);
  };
 
  const isViewingToday =
    view.year === today.getFullYear() && view.month === today.getMonth();
 
  return (
    <div className="flex-1 min-h-0 bg-white flex flex-col items-center px-[24px] pt-[10px] pb-[16px]">
      {/* สไตล์ scrollbar ของตารางปฏิทิน */}
      <style>{`
        .cal-scroll::-webkit-scrollbar { width: 14px; }
        .cal-scroll::-webkit-scrollbar-track { background: #9283C0; }
        .cal-scroll::-webkit-scrollbar-thumb {
          background: #E6E1F2;
          border-radius: 999px;
          border: 3px solid #9283C0;
        }
      `}</style>
 
      {/* HEADER: เดือน / ปี (พ.ศ.) */}
      <div className="flex items-center gap-[28px] mb-[10px] shrink-0">
        <ArrowTriangle direction="left" onClick={() => goMonth(-1)} />
        <h2 className="text-black text-[32px] font-bold leading-none tracking-tight min-w-[260px] text-center">
          {THAI_MONTHS[view.month]} {toBuddhistYear(view.year)}
        </h2>
        <ArrowTriangle direction="right" onClick={() => goMonth(1)} />
        {!isViewingToday && (
          <button
            onClick={goToday}
            className="h-[28px] px-[14px] rounded-full bg-[#35A9E8] hover:bg-[#269bdc] text-white text-[12px] font-semibold cursor-pointer transition"
          >
            วันนี้
          </button>
        )}
      </div>
 
      {/* กรอบ gradient */}
      <div className="w-full max-w-[1000px] flex-1 min-h-0 rounded-[28px] p-[14px] bg-gradient-to-b from-[#9687C2] via-[#8FB0D5] to-[#8BE8F5]">
        {/* ตารางปฏิทิน (เลื่อนในกรอบ) */}
        <div className="cal-scroll h-full overflow-y-auto bg-white">
          <div className="grid grid-cols-7">
            {cells.map(({ date, current }, idx) => {
              const key = toKey(date);
              const dayNum = date.getDate();
              const isFirstRow = idx < 7;
              const isSelected = key === selectedKey;
              const isToday = key === todayKey;
              const dayTasks = tasks[key];
 
              // วันที่ 1 ของเดือนใดก็ตามให้แสดงชื่อเดือนย่อกำกับ เช่น "1 ต.ค."
              const label = dayNum === 1 ? `1 ${THAI_MONTHS_SHORT[date.getMonth()]}` : dayNum;
 
              return (
                <div
                  key={key}
                  onClick={() => setSelectedKey(key)}
                  className="min-h-[96px] border-r border-b border-[#E9EBF0] px-[6px] pt-[6px] flex flex-col items-center cursor-pointer hover:bg-gray-50 transition"
                >
                  {isFirstRow && (
                    <span className="text-[11px] font-bold text-gray-600 leading-none mb-[3px]">
                      {WEEKDAYS[idx]}
                    </span>
                  )}
 
                  <span
                    className={`text-[12px] font-medium leading-none flex items-center justify-center ${
                      isSelected
                        ? 'min-w-[24px] h-[24px] px-[4px] rounded-full bg-[#0B57D0] text-white'
                        : `h-[18px] ${
                            isToday
                              ? 'text-[#0B57D0] font-bold'
                              : current
                              ? 'text-gray-700'
                              : 'text-gray-400'
                          }`
                    }`}
                  >
                    {label}
                  </span>
 
                  {dayTasks &&
                    dayTasks.map((t) => (
                      <button
                        key={t.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`เปิดงาน: ${t.title}`);
                        }}
                        className="mt-[6px] w-full max-w-[120px] h-[20px] bg-[#FFB3D1] border border-[#E5202E] rounded-full px-[8px] flex items-center justify-between text-black text-[10px] font-bold cursor-pointer hover:brightness-95 transition"
                      >
                        <span>{t.title}</span>
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2">
                          <rect x="1" y="1" width="10" height="10" />
                          <path d="M4 4 L4 8 M4 4 L8 4 M4 4 L9 9" />
                        </svg>
                      </button>
                    ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}