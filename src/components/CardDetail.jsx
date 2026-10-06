import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { DatesDialog, MEMBERS, PRIORITIES, formatDueDate } from './AddCard';
import { toKey } from '../Date';

const CHIPS = [
  { id: 'due', label: 'วันกำหนดส่ง' },
  { id: 'priority', label: 'ความสำคัญของงาน' },
  { id: 'subtasks', label: 'เพิ่มลิสต์งานย่อย' },
  { id: 'assignees', label: 'ผู้รับผิดชอบ' },
];

// ผู้รับผิดชอบของงานย่อย (รองรับข้อมูลเก่าที่เก็บเป็น assignee คนเดียว)
const getOwners = (s) => s.assignees ?? (s.assignee ? [s.assignee] : []);

const findMember = (id) => MEMBERS.find((m) => m.id === id);

/* =========================================================
   MEMBERS DIALOG (หน้าต่างเลือกผู้รับผิดชอบงานย่อย)
   แสดงเฉพาะคนที่รับผิดชอบงานนี้เท่านั้น
========================================================= */
function MembersDialog({ members, selected, onClose, onSave }) {
  const [draft, setDraft] = useState(selected);

  const toggle = (id) =>
    setDraft((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const handleSave = () => onSave(draft.filter((id) => members.some((m) => m.id === id)));

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/25 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-[372px] max-w-full bg-white rounded-[10px] shadow-2xl overflow-hidden border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="h-[40px] bg-[#D9D9D9] px-[16px] flex items-center justify-between">
          <h3 className="text-black text-[12px] font-bold">สมาชิกในกลุ่ม</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-600 cursor-pointer transition"
            aria-label="ปิด"
          >
            <X className="w-[18px] h-[18px] stroke-[3]" />
          </button>
        </div>

        <div className="px-[18px] pt-[16px] pb-[14px] min-h-[170px] flex flex-col">
          {members.length === 0 ? (
            <p className="text-[12px] text-gray-500 leading-relaxed">
              ยังไม่มีผู้รับผิดชอบงานนี้ กรุณาเลือกผู้รับผิดชอบงานก่อน              จึงจะมอบหมายงานย่อยได้
            </p>
          ) : (
            <div className="space-y-[12px]">
              {members.map((m) => (
                <label key={m.id} className="flex items-center gap-[12px] cursor-pointer">
                  <span
                    className={`w-[24px] h-[24px] rounded-full flex items-center justify-center text-[10px] font-bold text-black shrink-0 ${m.bg}`}
                  >
                    {m.initial}
                  </span>
                  <span className="flex-1 text-[11px] text-gray-800">{m.name}</span>
                  <input
                    type="checkbox"
                    checked={draft.includes(m.id)}
                    onChange={() => toggle(m.id)}
                    className="appearance-none w-[24px] h-[16px] rounded-[3px] bg-[#D9D9D9] checked:bg-[#35A9E8] cursor-pointer shrink-0 transition"
                  />
                </label>
              ))}
            </div>
          )}

          <div className="mt-auto pt-[18px] flex justify-end">
            <button
              onClick={handleSave}
              className="h-[24px] px-[18px] rounded-full bg-[#35A9E8] hover:bg-[#269bdc] text-white text-[10px] font-semibold cursor-pointer transition"
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
   CARD DETAIL MODAL (หน้ารายละเอียดงานที่สร้างแล้ว)
========================================================= */
export default function CardDetail({ columnTitle, card, onCancel, onSave }) {
  const fileInputRef = useRef(null);
  const startDate = card.startDate || toKey(new Date());

  const [title, setTitle] = useState(card.title || '');
  const [dates, setDates] = useState({
    dueDate: card.dueDate || '',
    dueTime: card.dueTime || '',
    hasDue: !!card.dueDate,
    confirmed: !!card.dueDate,
  });
  const [priority, setPriority] = useState(card.priority || '');
  const [subtasks, setSubtasks] = useState(card.subtasks || []); // { id, text, done, assignee }
  const [assignees, setAssignees] = useState(card.assignees || []);
  const [files, setFiles] = useState(card.files || []);
  const [comments, setComments] = useState(card.comments || []);

  const [openPanel, setOpenPanel] = useState(null);
  const [isDatesOpen, setIsDatesOpen] = useState(false);
  const [subtaskInput, setSubtaskInput] = useState('');
  const [commentInput, setCommentInput] = useState('');
  const [memberDialogFor, setMemberDialogFor] = useState(null); // id งานย่อยที่กำลังเลือกผู้รับผิดชอบ

  // กด Esc: ถ้าหน้าต่างวันที่เปิดอยู่ให้ปิดอันนั้นก่อน
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== 'Escape') return;
      if (memberDialogFor) setMemberDialogFor(null);
      else if (isDatesOpen) setIsDatesOpen(false);
      else onCancel();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onCancel, isDatesOpen, memberDialogFor]);

  const hasValue = {
    due: dates.confirmed,
    priority: !!priority,
    subtasks: subtasks.length > 0,
    assignees: assignees.length > 0,
  };

  const chipLabel = (chip) => {
    if (chip.id === 'due' && dates.confirmed && !dates.dueDate) return 'ไม่มีวันครบกำหนด';
    if (chip.id === 'due' && dates.dueDate) {
      return `${formatDueDate(startDate)} - ${formatDueDate(dates.dueDate)}`;
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

  // ---------- งานย่อย ----------
  const addSubtask = () => {
    const text = subtaskInput.trim();
    if (!text) return;
    setSubtasks((prev) => [...prev, { id: Date.now(), text, done: false, assignees: [] }]);
    setSubtaskInput('');
  };

  const toggleSubtask = (id) =>
    setSubtasks((prev) => prev.map((s) => (s.id === id ? { ...s, done: !s.done } : s)));

  const setSubtaskOwners = (id, ids) =>
    setSubtasks((prev) => prev.map((s) => (s.id === id ? { ...s, assignees: ids } : s)));

  const removeSubtask = (id) => setSubtasks((prev) => prev.filter((s) => s.id !== id));

  const doneCount = subtasks.filter((s) => s.done).length;

  // ---------- ผู้รับผิดชอบ / ไฟล์ / ความคิดเห็น ----------
  const toggleAssignee = (id) => {
    const removing = assignees.includes(id);
    setAssignees((prev) => (removing ? prev.filter((a) => a !== id) : [...prev, id]));
    // ถ้าเอาคนออกจากงานหลัก ต้องเอาออกจากงานย่อยทุกอันด้วย
    if (removing) {
      setSubtasks((prev) =>
        prev.map((s) => ({ ...s, assignees: getOwners(s).filter((a) => a !== id) }))
      );
    }
  };

  const handleFiles = (e) => {
    const names = Array.from(e.target.files || []).map((f) => f.name);
    if (names.length) setFiles((prev) => [...prev, ...names]);
    e.target.value = '';
  };

  const addComment = () => {
    const text = commentInput.trim();
    if (!text) return;
    setComments((prev) => [...prev, { id: Date.now(), text }]);
    setCommentInput('');
  };

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      ...card,
      title: title.trim(),
      startDate,
      dueDate: dates.dueDate,
      dueTime: dates.dueTime,
      priority,
      subtasks,
      assignees,
      files,
      comments,
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
              onClick={handleSave}
              disabled={!title.trim()}
              className="w-[119px] h-[40px] bg-[#3AA0E5] hover:bg-[#2b92d8] rounded-full text-white text-[14px] font-semibold cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              เสร็จสิ้น
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="flex flex-1 min-h-0">
          {/* ซ้าย: รายละเอียดงาน */}
          <div className="flex-1 min-w-0 p-[28px] overflow-y-auto min-h-[360px]">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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

            {/* ผู้รับผิดชอบ */}
            {assignees.length > 0 && (
              <div className="mt-[14px]">
                <span className="text-black text-[10px] font-bold block mb-[6px]">ผู้รับผิดชอบ</span>
                <div className="flex items-center gap-[6px]">
                  {assignees.map((id) => {
                    const m = findMember(id);
                    return m ? (
                      <span
                        key={id}
                        title={m.name}
                        className={`w-[26px] h-[26px] rounded-full flex items-center justify-center text-[11px] font-bold text-black ${m.bg}`}
                      >
                        {m.initial}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* ===== หัวข้อที่ 1: ไฟล์งานทั้งหมด ===== */}
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

            {/* ===== หัวข้อที่ 2: ลิสต์งานย่อย ===== */}
            <div className="flex items-end justify-between mt-[28px] mb-[10px]">
              <h3 className="text-black text-[22px] font-bold leading-none">ลิสต์งานย่อย</h3>
              {subtasks.length > 0 && (
                <span className="text-[11px] text-gray-500">
                  เสร็จแล้ว {doneCount}/{subtasks.length}
                </span>
              )}
            </div>

            {subtasks.length === 0 ? (
              <p className="text-[12px] text-gray-400">ยังไม่มีงานย่อย</p>
            ) : (
              <div className="space-y-[14px]">
                {subtasks.map((s) => {
                  const pct = s.done ? 100 : 0;
                  const owners = getOwners(s).map(findMember).filter(Boolean);
                  return (
                    <div key={s.id} className="flex items-start gap-[12px]">
                      <input
                        type="checkbox"
                        checked={s.done}
                        onChange={() => toggleSubtask(s.id)}
                        className="appearance-none w-[24px] h-[16px] rounded-[3px] bg-[#D9D9D9] checked:bg-[#35A9E8] cursor-pointer shrink-0 mt-[1px] transition"
                      />

                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-[12px] truncate ${
                            s.done ? 'line-through text-gray-400' : 'text-gray-900'
                          }`}
                        >
                          {s.text}
                        </div>
                        <div className="flex items-center gap-[8px] mt-[4px]">
                          <span className="w-[28px] text-[9px] text-gray-500">{pct}%</span>
                          <div className="flex-1 h-[4px] bg-[#E3E3E3] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#35A9E8] transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* ผู้รับผิดชอบงานย่อย: วงกลมคนที่เลือก + ปุ่มบวกเปิดหน้าเลือก */}
                      <div className="flex items-center gap-[4px] shrink-0">
                        {owners.map((m) => (
                          <span
                            key={m.id}
                            title={m.name}
                            className={`w-[24px] h-[24px] rounded-full flex items-center justify-center text-[10px] font-bold text-black ${m.bg}`}
                          >
                            {m.initial}
                          </span>
                        ))}
                        <button
                          onClick={() => setMemberDialogFor(s.id)}
                          title="เลือกผู้รับผิดชอบงานย่อย"
                          className="w-[24px] h-[24px] rounded-full border border-dashed border-gray-400 text-gray-500 hover:border-gray-700 hover:text-gray-700 flex items-center justify-center cursor-pointer transition"
                        >
                          <Plus className="w-[13px] h-[13px]" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeSubtask(s.id)}
                        className="h-[20px] px-[12px] rounded-[4px] bg-[#35A9E8] hover:bg-[#269bdc] text-white text-[10px] font-bold shrink-0 cursor-pointer transition"
                      >
                        ลบ
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ขวา: ความคิดเห็นทั้งหมด */}
          <div className="w-[285px] shrink-0 bg-[#F3F3F3] p-[18px] flex flex-col min-h-0">
            <h3 className="text-black text-[12px] font-bold mb-[10px]">ความคิดเห็นทั้งหมด</h3>
            <input
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addComment()}
              placeholder="เขียนความคิดเห็น.."
              className="w-full h-[32px] bg-white rounded-full px-[16px] text-[12px] text-gray-800 outline-none focus:ring-2 focus:ring-[#35A9E8]"
            />
            <div className="mt-[12px] space-y-[8px] overflow-y-auto min-h-0">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-[12px] px-[12px] py-[8px] flex items-start gap-[8px]"
                >
                  <span className="w-[22px] h-[22px] rounded-full bg-[#FFD765] flex items-center justify-center text-[10px] font-bold text-black shrink-0">
                    N
                  </span>
                  <p className="text-[12px] text-gray-800 break-words min-w-0">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* หน้าต่างเลือกผู้รับผิดชอบงานย่อย (เฉพาะคนที่รับผิดชอบงานนี้) */}
      {memberDialogFor &&
        (() => {
          const target = subtasks.find((s) => s.id === memberDialogFor);
          if (!target) return null;
          return (
            <MembersDialog
              members={assignees.map(findMember).filter(Boolean)}
              selected={getOwners(target)}
              onClose={() => setMemberDialogFor(null)}
              onSave={(ids) => {
                setSubtaskOwners(target.id, ids);
                setMemberDialogFor(null);
              }}
            />
          );
        })()}

      {/* หน้าต่างเลือกวันกำหนดส่ง */}
      {isDatesOpen && (
        <DatesDialog
          initial={dates}
          startDate={startDate}
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