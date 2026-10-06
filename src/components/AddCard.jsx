import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { THAI_MONTHS, toBuddhistYear, toKey, buildMonthGrid, addMonths } from '../Date';

export const MEMBERS = [
  { id: 'natchaya', name: 'Natchaya Yada', initial: 'N', bg: 'bg-[#FFD765]' },
  { id: 'chayaporn', name: 'Chayaporn Somsiri', initial: 'C', bg: 'bg-[#6BF56B]' },
];

export const PRIORITIES = {
  urgent: 'งานด่วน',
  normal: 'งานไม่ด่วน',
};

// แปลง 2026-07-23 เป็น 23/07/69 (พ.ศ. 2 หลักท้าย)
export function formatDueDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${String(Number(y) + 543).slice(-2)}`;
}

const CHIPS = [
  { id: 'due', label: 'วันกำหนดส่ง' },
  { id: 'priority', label: 'ความสำคัญของงาน' },
  { id: 'subtasks', label: 'เพิ่มลิสต์งานย่อย' },
  { id: 'assignees', label: 'ผู้รับผิดชอบ' },
];

const WEEK_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// เวลาให้เลือกทุก 30 นาที
const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const h = String(Math.floor(i / 2)).padStart(2, '0');
  const m = i % 2 === 0 ? '00' : '30';
  return `${h}:${m}`;
});


export function DatesDialog({ initial, startDate, onClose, onSave })  {
  const today = new Date(); // วันที่จริงจากเครื่อง
  const base = initial.dueDate ? new Date(`${initial.dueDate}T00:00:00`) : today;

  const [view, setView] = useState({ year: base.getFullYear(), month: base.getMonth() });
  const [dueDate, setDueDate] = useState(initial.dueDate);
  const [dueTime, setDueTime] = useState(initial.dueTime);
  const [hasDue, setHasDue] = useState(initial.hasDue);
  const [errorMsg, setErrorMsg] = useState('');

  const cells = buildMonthGrid(view.year, view.month);
  const goMonth = (delta) => setView((v) => addMonths(v.year, v.month, delta));

  // คลิกวันบนปฏิทิน = เลือกวันครบกำหนด (เลือกวันที่ผ่านมาแล้วไม่ได้)
  const pickDay = (key) => {
    if (!hasDue || key < startDate) return;
    setDueDate(key);
    setErrorMsg('');
  };

  // สลับโหมด: มีวันครบกำหนด / ไม่มีวันครบกำหนด
  const chooseMode = (withDue) => {
    setErrorMsg('');
    setHasDue(withDue);
    if (!withDue) {
      setDueDate('');
      setDueTime('');
    }
  };

  const clearAll = () => {
    setDueDate('');
    setDueTime('');
    setErrorMsg('');
  };

  const handleSave = () => {
    // เลือก "มีวันครบกำหนด" แล้วต้องเลือกวันที่บนปฏิทินก่อนถึงจะบันทึกได้
    if (hasDue && !dueDate) {
      setErrorMsg('กรุณาเลือกวันที่ครบกำหนดบนปฏิทินก่อน');
      return;
    }
    onSave({
      dueDate: hasDue ? dueDate : '',
      dueTime: hasDue ? dueTime : '',
      hasDue,
      confirmed: true,
    });
  };

  const rangeText = hasDue
    ? `${formatDueDate(startDate)} - ${dueDate ? formatDueDate(dueDate) : 'ว/ด/ป ที่ครบกำหนด'}`
    : `${formatDueDate(startDate)} - ไม่มีวันครบกำหนด`;

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/25 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-[300px] bg-white rounded-[10px] shadow-2xl overflow-hidden border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="h-[38px] bg-[#D9D9D9] relative flex items-center justify-center">
          <span className="text-black text-[12px] font-bold">Dates</span>
          <button
            onClick={onClose}
            className="absolute right-[10px] text-white hover:text-gray-600 cursor-pointer transition"
            aria-label="ปิด"
          >
            <X className="w-[18px] h-[18px] stroke-[3]" />
          </button>
        </div>

        <div className="px-[16px] pt-[12px] pb-[14px]">
          {/* เดือน/ปี พ.ศ. + ปุ่มเลื่อนเดือน */}
          <div className="flex items-center justify-between mb-[8px]">
            <button
              onClick={() => goMonth(-1)}
              className="w-[22px] h-[22px] flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded cursor-pointer"
              aria-label="เดือนก่อนหน้า"
            >
              <ChevronLeft className="w-[14px] h-[14px]" />
            </button>
            <span className="text-black text-[12px] font-bold">
              {THAI_MONTHS[view.month]} {toBuddhistYear(view.year)}
            </span>
            <button
              onClick={() => goMonth(1)}
              className="w-[22px] h-[22px] flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded cursor-pointer"
              aria-label="เดือนถัดไป"
            >
              <ChevronRight className="w-[14px] h-[14px]" />
            </button>
          </div>

          {/* ปฏิทิน */}
          <div className="grid grid-cols-7 text-center text-[9px] font-bold text-gray-600 mb-[4px]">
            {WEEK_HEADERS.map((w) => (
              <span key={w}>{w}</span>
            ))}
          </div>
          <div
            className={`grid grid-cols-7 text-center text-[11px] transition ${
              hasDue ? '' : 'opacity-40 pointer-events-none'
            }`}
          >
            {cells.map(({ date, current }) => {
              const key = toKey(date);
              const isPast = key < startDate;
              const isStart = key === startDate;
              const isDue = key === dueDate;
              const inRange = dueDate && key > startDate && key < dueDate;
              return (
                <button
                  key={key}
                  disabled={isPast}
                  onClick={() => pickDay(key)}
                  className={`h-[26px] flex items-center justify-center transition ${
                    isPast
                      ? 'text-gray-300 cursor-not-allowed'
                      : `cursor-pointer ${current ? 'text-gray-800' : 'text-gray-400'} ${
                          inRange ? 'bg-[#E3F0FB]' : 'hover:bg-gray-100'
                        }`
                  } ${isStart ? '!text-[#0B57D0] font-bold' : ''} ${
                    isDue ? '!text-[#0B57D0] font-bold border-b-2 border-[#0B57D0]' : ''
                  }`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          {/* เลือกโหมด: มีวันครบกำหนด / ไม่มีวันครบกำหนด (อยู่ใต้ปฏิทิน) */}
          <div className="flex gap-[8px] mt-[14px]">
            {[
              { value: true, label: 'มีวันครบกำหนด' },
              { value: false, label: 'ไม่มีวันครบกำหนด' },
            ].map((opt) => (
              <button
                key={String(opt.value)}
                onClick={() => chooseMode(opt.value)}
                className={`flex-1 h-[28px] rounded-full text-[11px] font-semibold cursor-pointer transition ${
                  hasDue === opt.value
                    ? 'bg-[#35A9E8] text-white'
                    : 'bg-[#D9D9D9] text-gray-700 hover:bg-[#cccccc]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {errorMsg && <p className="mt-[8px] text-[10px] text-red-500">{errorMsg}</p>}

          {/* ช่วงวันที่ + เวลา */}
          <div className="mt-[10px] flex items-center gap-[8px]">
            <div className="flex-1 min-w-0 h-[22px] bg-[#D9D9D9] rounded-full px-[10px] flex items-center text-[9px] text-gray-700 truncate">
              {rangeText}
            </div>
            <select
              value={dueTime}
              disabled={!hasDue}
              onChange={(e) => setDueTime(e.target.value)}
              className="w-[76px] h-[22px] bg-[#D9D9D9] rounded-full px-[8px] text-[9px] text-gray-600 outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">เวลา</option>
              {TIME_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-[14px] flex items-center justify-between">
            <button
              onClick={clearAll}
              className="text-[11px] text-gray-500 hover:text-gray-800 cursor-pointer"
            >
              ล้างวันที่
            </button>
            <button
              onClick={handleSave}
              className="h-[26px] px-[18px] rounded-full bg-[#35A9E8] hover:bg-[#269bdc] text-white text-[10px] font-semibold cursor-pointer transition"
            >
              เสร็จสิ้น
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ADD CARD MODAL
========================================================= */
export default function AddCard({ columnTitle, onCancel, onSubmit }) {
  const fileInputRef = useRef(null);

  // วันที่สร้างงาน = วันนี้ (ตามเครื่อง) ใช้เป็นวันที่เริ่มเสมอ
  const [createdKey] = useState(() => toKey(new Date()));

  const [title, setTitle] = useState('');
  const [dates, setDates] = useState({
    dueDate: '',
    dueTime: '',
    hasDue: false,
    confirmed: false, // กด "เสร็จสิ้น" ในหน้าต่างวันที่แล้วหรือยัง
  });
  const [priority, setPriority] = useState('');
  const [subtasks, setSubtasks] = useState([]); // { id, text, done }
  const [assignees, setAssignees] = useState([]);
  const [files, setFiles] = useState([]);

  const [openPanel, setOpenPanel] = useState(null); // chip ที่กางอยู่
  const [isDatesOpen, setIsDatesOpen] = useState(false);
  const [subtaskInput, setSubtaskInput] = useState('');

  // กด Esc: ถ้าหน้าต่างวันที่เปิดอยู่ให้ปิดอันนั้นก่อน
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== 'Escape') return;
      if (isDatesOpen) setIsDatesOpen(false);
      else onCancel();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onCancel, isDatesOpen]);

  const hasValue = {
    due: dates.confirmed,
    priority: !!priority,
    subtasks: subtasks.length > 0,
    assignees: assignees.length > 0,
  };

  const chipLabel = (chip) => {
    if (chip.id === 'due' && dates.confirmed && !dates.dueDate) return 'ไม่มีวันครบกำหนด';
    if (chip.id === 'due' && dates.dueDate) {
      return `${formatDueDate(createdKey)} - ${formatDueDate(dates.dueDate)}`;
    }
    if (chip.id === 'priority' && priority) return PRIORITIES[priority];
    if (chip.id === 'subtasks' && subtasks.length > 0) return `งานย่อย (${subtasks.length})`;
    if (chip.id === 'assignees' && assignees.length > 0) return `ผู้รับผิดชอบ (${assignees.length})`;
    return chip.label;
  };

  const handleChipClick = (id) => {
    if (id === 'due') {
      setOpenPanel(null);
      setIsDatesOpen(true);
      return;
    }
    setOpenPanel(openPanel === id ? null : id);
  };

  const addSubtask = () => {
    const text = subtaskInput.trim();
    if (!text) return;
    setSubtasks((prev) => [...prev, { id: Date.now(), text, done: false }]);
    setSubtaskInput('');
  };

  const toggleSubtask = (id) =>
    setSubtasks((prev) => prev.map((s) => (s.id === id ? { ...s, done: !s.done } : s)));

  const removeSubtask = (id) => setSubtasks((prev) => prev.filter((s) => s.id !== id));

  const toggleAssignee = (id) =>
    setAssignees((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));

  const handleFiles = (e) => {
    const names = Array.from(e.target.files || []).map((f) => f.name);
    if (names.length) setFiles((prev) => [...prev, ...names]);
    e.target.value = '';
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit({
      id: `c${Date.now()}`,
      title: title.trim(),
      startDate: createdKey,
      dueDate: dates.dueDate,
      dueTime: dates.dueTime,
      priority,
      subtasks,
      assignees,
      files,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/35 flex items-center justify-center p-4">
      <div className="w-[760px] max-w-full max-h-[calc(100vh-32px)] bg-white rounded-[14px] shadow-2xl overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="bg-[#F0F5FF] px-[28px] h-[93px] flex items-center justify-between shrink-0">
          <h2 className="text-black text-[22px] font-bold">{columnTitle}</h2>
          <div className="flex items-center gap-[20px]">
            <button
              onClick={onCancel}
              className="w-[119px] h-[40px] bg-[#3AA0E5] hover:bg-[#2b92d8] rounded-full text-white text-[14px] font-semibold cursor-pointer transition"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleSubmit}
              disabled={!title.trim()}
              className="w-[119px] h-[40px] bg-[#3AA0E5] hover:bg-[#2b92d8] rounded-full text-white text-[14px] font-semibold cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              เสร็จสิ้น
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="flex flex-1 min-h-0">
          {/* ซ้าย: รายละเอียดการ์ด */}
          <div className="flex-1 min-w-0 p-[28px] overflow-y-auto min-h-[360px]">
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="ตั้งชื่องาน"
              className="w-full h-[38px] bg-[#EBEBEB] rounded-full px-[18px] text-[13px] text-gray-800 outline-none focus:ring-2 focus:ring-[#35A9E8]"
            />

            {/* ปุ่มตัวเลือก */}
            <div className="flex flex-wrap gap-[8px] mt-[18px]">
              {CHIPS.map((chip) => {
                const isOpen = openPanel === chip.id || (chip.id === 'due' && isDatesOpen);
                return (
                  <button
                    key={chip.id}
                    onClick={() => handleChipClick(chip.id)}
                    className={`h-[24px] px-[14px] rounded-full text-[10px] font-bold cursor-pointer transition ${
                      isOpen || hasValue[chip.id]
                        ? 'bg-[#35A9E8] text-white'
                        : 'bg-[#A6D4F2] text-black hover:bg-[#92c8ec]'
                    }`}
                  >
                    {chipLabel(chip)}
                  </button>
                );
              })}
            </div>

            {/* พาเนลของแต่ละตัวเลือก */}
            {openPanel && (
              <div className="mt-[12px] bg-[#F5F9FE] border border-[#DCE9F7] rounded-[12px] p-[12px]">
                {openPanel === 'priority' && (
                  <div className="flex gap-[8px]">
                    {Object.entries(PRIORITIES).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => setPriority(priority === key ? '' : key)}
                        className={`h-[28px] px-[16px] rounded-full text-[12px] cursor-pointer transition ${
                          priority === key
                            ? key === 'urgent'
                              ? 'bg-[#FF6B6B] text-white font-semibold'
                              : 'bg-[#06D6A0] text-gray-800 font-semibold'
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}

                {openPanel === 'subtasks' && (
                  <div className="flex gap-[8px]">
                    <input
                      autoFocus
                      value={subtaskInput}
                      onChange={(e) => setSubtaskInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addSubtask()}
                      placeholder="ชื่องานย่อย"
                      className="flex-1 h-[30px] px-[10px] rounded-[8px] border border-gray-200 bg-white text-[12px] outline-none"
                    />
                    <button
                      onClick={addSubtask}
                      className="h-[30px] px-[14px] rounded-[8px] bg-[#35A9E8] hover:bg-[#269bdc] text-white text-[12px] font-semibold cursor-pointer"
                    >
                      เพิ่ม
                    </button>
                  </div>
                )}

                {openPanel === 'assignees' && (
                  <div className="flex flex-wrap gap-[8px]">
                    {MEMBERS.map((m) => {
                      const on = assignees.includes(m.id);
                      return (
                        <button
                          key={m.id}
                          onClick={() => toggleAssignee(m.id)}
                          className={`h-[32px] pl-[4px] pr-[14px] rounded-full flex items-center gap-[8px] text-[12px] cursor-pointer transition ${
                            on
                              ? 'bg-white ring-2 ring-[#35A9E8] text-gray-900'
                              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <span
                            className={`w-[24px] h-[24px] rounded-full flex items-center justify-center text-[10px] font-bold text-black ${m.bg}`}
                          >
                            {m.initial}
                          </span>
                          {m.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ไฟล์งานทั้งหมด */}
            <h3 className="text-black text-[22px] font-bold mt-[26px] mb-[8px]">ไฟล์งานทั้งหมด</h3>
            <div className="space-y-[8px]">
              {files.map((file, idx) => (
                <div
                  key={`${file}-${idx}`}
                  className="w-full h-[38px] bg-[#D774EE] rounded-full px-[18px] flex items-center justify-between text-white text-[12px] font-medium"
                >
                  <span className="truncate">{file}</span>
                  <button
                    onClick={() => setFiles((prev) => prev.filter((_, i) => i !== idx))}
                    className="text-white/80 hover:text-white cursor-pointer"
                  >
                    <Trash2 className="w-[16px] h-[16px]" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-[38px] bg-[#D9D9D9] hover:bg-[#cccccc] rounded-full flex items-center justify-center text-gray-600 cursor-pointer transition"
              >
                <Plus className="w-[20px] h-[20px]" />
              </button>
              <input ref={fileInputRef} type="file" multiple hidden onChange={handleFiles} />
            </div>
          </div>

          {/* ขวา: ลิสต์งานย่อย */}
          <div className="w-[285px] shrink-0 bg-[#F3F3F3] p-[18px] flex flex-col min-h-0">
            <h3 className="text-black text-[12px] font-bold mb-[10px]">ลิสต์งานย่อย</h3>

            {subtasks.length === 0 ? (
              <p className="text-[12px] text-gray-400 px-[2px]">ยังไม่มีงานย่อย</p>
            ) : (
              <div className="space-y-[8px] overflow-y-auto min-h-0">
                {subtasks.map((s) => (
                  <div
                    key={s.id}
                    className="bg-white rounded-full pl-[12px] pr-[10px] h-[32px] flex items-center gap-[8px]"
                  >
                    <input
                      type="checkbox"
                      checked={s.done}
                      onChange={() => toggleSubtask(s.id)}
                      className="w-[14px] h-[14px] accent-[#35A9E8] cursor-pointer shrink-0"
                    />
                    <span
                      className={`flex-1 min-w-0 truncate text-[12px] ${
                        s.done ? 'line-through text-gray-400' : 'text-gray-800'
                      }`}
                    >
                      {s.text}
                    </span>
                    <button
                      onClick={() => removeSubtask(s.id)}
                      className="text-gray-400 hover:text-gray-700 cursor-pointer shrink-0"
                      aria-label="ลบงานย่อย"
                    >
                      <X className="w-[14px] h-[14px]" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* หน้าต่างเลือกวันกำหนดส่ง */}
      {isDatesOpen && (
        <DatesDialog
          initial={dates}
          startDate={createdKey}
          onClose={() => setIsDatesOpen(false)}
          onSave={(next) => {
            setDates(next);
            setIsDatesOpen(false);
          }}
        />
      )}
    </div>
  );
}