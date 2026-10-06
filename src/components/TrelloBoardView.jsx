import React, { useState } from 'react';
import CalendarView from './CalendarView';
import FilterPanel from './FilterPanel';
import MindMapView from './MindmapView';
import AddCard, { MEMBERS, PRIORITIES, formatDueDate } from './AddCard';
import CardDetail from './CardDetail';
import {
  ArrowLeft,
  Filter,
  Share2,
  Plus,
  ChevronDown,
  X,
  Trash2,
  Copy,
  ChevronLeft,
  ChevronRight,
  MousePointer,
  GitBranch,
  Type,
  PenTool,
  MessageSquare,
} from 'lucide-react';

export default function TrelloBoardView({ assignment, onBack }) {
  const [columns, setColumns] = useState([
    {
      id: 'todo',
      title: 'สิ่งที่ต้องทำ',
      cards: Array.from({ length: 7 }, (_, i) => ({ id: `t${i}`, title: 'Test' })),
    },
    { id: 'doing', title: 'กำลังทำ', cards: [{ id: 'd1', title: 'Test' }] },
    { id: 'done', title: 'เสร็จ', cards: [{ id: 'f1', title: 'Test' }] },
  ]);

  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareTab, setShareTab] = useState('members'); // 'members' | 'requests'
  const [groupMembers, setGroupMembers] = useState([
    { id: 'm1', name: 'Natchaya Yada', initial: 'N', bg: 'bg-[#FFD765]', text: 'text-black' },
    { id: 'm2', name: 'Chayaporn Somsiri', initial: 'C', bg: 'bg-[#52C41A]', text: 'text-white' },
  ]);
  const [joinRequests, setJoinRequests] = useState([
    { id: 'r1', name: 'Sudarat Junda', initial: 'S', bg: 'bg-[#FFD765]', text: 'text-black' },
    { id: 'r2', name: 'Viriya Chotasorn', initial: 'V', bg: 'bg-[#FFD765]', text: 'text-black' },
  ]);
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  const [currentView, setCurrentView] = useState('แผนผังงาน'); // ค่าเริ่มต้น
  const [files, setFiles] = useState(['ไฟล์งานที่ 1']);

  const [addCardColumnId, setAddCardColumnId] = useState(null);
  const handleSubmitCard = (card) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === addCardColumnId ? { ...col, cards: [...col.cards, card] } : col
      )
    );
    setAddCardColumnId(null);
  };

  const [openCard, setOpenCard] = useState(null); // { columnId, cardId }
  const openColumn = columns.find((c) => c.id === openCard?.columnId);
  const openCardData = openColumn?.cards.find((c) => c.id === openCard?.cardId);

  const handleSaveCard = (updated) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === openCard.columnId
          ? { ...col, cards: col.cards.map((c) => (c.id === updated.id ? updated : c)) }
          : col
      )
    );
    setOpenCard(null);
  };

  // ===== ลากการ์ดเพื่อย้ายสถานะ (HTML5 Drag & Drop) =====
  const [dragging, setDragging] = useState(null); // { cardId, fromColumnId }
  const [dragOver, setDragOver] = useState(null); // { columnId, cardId|null }

  const moveCard = (fromColId, toColId, cardId, beforeCardId = null) => {
    if (cardId === beforeCardId) return;
    setColumns((prev) => {
      const card = prev.find((c) => c.id === fromColId)?.cards.find((c) => c.id === cardId);
      if (!card) return prev;
      return prev
        .map((col) =>
          col.id === fromColId ? { ...col, cards: col.cards.filter((c) => c.id !== cardId) } : col
        )
        .map((col) => {
          if (col.id !== toColId) return col;
          const cards = [...col.cards];
          const idx = beforeCardId ? cards.findIndex((c) => c.id === beforeCardId) : -1;
          if (idx === -1) cards.push(card);
          else cards.splice(idx, 0, card);
          return { ...col, cards };
        });
    });
  };

  const endDrag = () => {
    setDragging(null);
    setDragOver(null);
  };

  const handleDrop = (e, toColId, beforeCardId = null) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragging) moveCard(dragging.fromColumnId, toColId, dragging.cardId, beforeCardId);
    endDrag();
  };

  const handleAcceptRequest = (req) => {
    setGroupMembers((prev) => [...prev, req]);
    setJoinRequests((prev) => prev.filter((r) => r.id !== req.id));
  };

  const handleRejectRequest = (id) => {
    setJoinRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAddFile = () => {
    const fileName = prompt('กรอกชื่อไฟล์งานที่ต้องการเพิ่ม:');
    if (!fileName) return;
    setFiles((prev) => [...prev, fileName]);
  };

  const handleDeleteFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('ASDF31');
    alert('คัดลอกรหัสกลุ่มเรียบร้อยแล้ว!');
  };

  return (
    <div className="w-full h-full min-h-0 bg-white font-sans select-none flex flex-col relative overflow-hidden">

      {/* =========================
          TOP BAR
      ========================= */}
      <div className="h-[84px] bg-[#7C6BAF] px-[34px] flex items-center justify-between shrink-0">

        {/* Left side */}
        <div className="flex items-center gap-[28px]">
          <button
            onClick={onBack}
            className="text-white flex items-center justify-center hover:opacity-80 transition cursor-pointer"
            title="ย้อนกลับ"
          >
            <ArrowLeft className="w-[27px] h-[27px] stroke-[3]" />
          </button>

          <div className="w-[306px] h-[40px] bg-white rounded-full flex items-center px-[16px] shadow-sm">
            <span className="text-[#777777] text-[14px]">
              {assignment
                ? assignment.title.replace('ชื่องาน : ', '')
                : 'Software Testing'}
            </span>
          </div>

          {/* ปุ่ม Dropdown มุมมอง */}
          <div className="relative">
            <button
              onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)}
              className="flex items-center gap-[8px] text-white cursor-pointer hover:opacity-80"
            >
              <div className="flex items-end gap-[2px] h-[18px]">
                <span className="w-[3px] h-[13px] bg-white rounded-full" />
                <span className="w-[3px] h-[18px] bg-white rounded-full" />
                <span className="w-[3px] h-[10px] bg-white rounded-full" />
              </div>
              <ChevronDown className="w-[20px] h-[20px] stroke-[2]" />
            </button>

            {/* Dropdown เมนูเลือกมุมมอง 3 รายการ */}
            {isViewDropdownOpen && (
              <div className="absolute left-0 mt-2 w-[150px] bg-white rounded-[12px] shadow-xl py-1 z-50 border border-gray-100">
                <button
                  onClick={() => {
                    setCurrentView('แผนผังงาน');
                    setIsViewDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-[13px] hover:bg-gray-100 cursor-pointer ${currentView === 'แผนผังงาน' ? 'font-bold text-[#7C6BAF] bg-[#E8F4FD] border-l-4 border-[#35A9E8]' : 'text-gray-700'
                    }`}
                >
                  แผนผังงาน
                </button>
                <button
                  onClick={() => {
                    setCurrentView('ปฏิทิน');
                    setIsViewDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-[13px] hover:bg-gray-100 cursor-pointer ${currentView === 'ปฏิทิน' ? 'font-bold text-[#7C6BAF] bg-[#E8F4FD] border-l-4 border-[#35A9E8]' : 'text-gray-700'
                    }`}
                >
                  ปฏิทิน
                </button>
                <button
                  onClick={() => {
                    setCurrentView('แผนที่ความคิด');
                    setIsViewDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-[13px] hover:bg-gray-100 cursor-pointer ${currentView === 'แผนที่ความคิด' ? 'font-bold text-[#7C6BAF] bg-[#E8F4FD] border-l-4 border-[#35A9E8]' : 'text-gray-700'
                    }`}
                >
                  แผนที่ความคิด
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-[11px]">
          <div className="w-[47px] h-[47px] rounded-full bg-[#FFD765] flex items-center justify-center text-[14px] font-semibold text-black shadow-sm">
            N
          </div>

          {/* ปุ่ม Filter */}
          <div className="relative">
            <button
              onClick={() => setIsFilterModalOpen(!isFilterModalOpen)}
              className="h-[44px] px-[16px] bg-white rounded-[16px] flex items-center gap-[8px] text-[#333333] text-[14px] shadow-sm cursor-pointer hover:bg-gray-50 transition"
            >
              <Filter className="w-[23px] h-[23px] stroke-[1.8]" />
              <span>Filter</span>
            </button>

            {isFilterModalOpen && (
              <FilterPanel onClose={() => setIsFilterModalOpen(false)} />
            )}
          </div>

          {/* ปุ่มแชร์ */}
          <button
            onClick={() => {
              setShareTab('members');
              setIsShareModalOpen(true);
            }}
            className="h-[44px] w-[119px] bg-[#35A9E8] hover:bg-[#269bdc] rounded-[12px] flex items-center justify-center gap-[10px] text-white text-[14px] font-semibold cursor-pointer transition shadow-sm"
          >
            <Share2 className="w-[22px] h-[22px] stroke-[1.8]" />
            <span>แชร์</span>
          </button>
        </div>
      </div>



      {currentView === 'ปฏิทิน' ? (
        <CalendarView />
      ) : currentView === 'แผนที่ความคิด' ? (
        <MindMapView />
      ) : (

        <div className="flex-1 min-h-0 bg-white p-[16px] flex gap-[16px]">

          {/* SIDEBAR */}
          <div className="w-[213px] bg-[#BDB4D8] rounded-[32px] px-[14px] py-[20px] flex flex-col justify-between shrink-0 overflow-y-auto">
            <div>
              <div className="px-[12px] flex flex-col items-center text-center">
                <h3 className="text-black text-[12px] font-bold mb-[12px] leading-[1.3]">
                  ข้อมูลรายละเอียดภายในกลุ่ม
                </h3>
                <button
                  onClick={() => setIsGroupModalOpen(true)}
                  className="h-[37px] px-[20px] bg-white rounded-full text-black text-[13px] font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  ข้อมูลกลุ่ม
                </button>
              </div>

              <div className="mt-[31px]">
                <h3 className="px-[12px] text-black text-[13px] font-bold mb-[7px]">
                  งานที่เสร็จสิ้น
                </h3>
                <div className="w-full h-[70px] bg-white rounded-[12px] px-[4px] pt-[8px]">
                  <div className="px-[8px] text-[#888888] text-[11px] mb-[10px]">
                    แนบไฟล์งานที่เสร็จสิ้น
                  </div>
                  <button
                    onClick={() => alert('แนบไฟล์งานสำเร็จ')}
                    className="w-full h-[22px] bg-[#D9D9D9] rounded-full flex items-center justify-center text-[#777777] hover:bg-[#cccccc] cursor-pointer"
                  >
                    <Plus className="w-[15px] h-[15px]" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <p className="text-[10px] text-[#666666] text-center whitespace-nowrap mb-[10px]">
                สถานะการส่งงาน : ยังไม่ได้ส่งงาน
              </p>
              <button
                onClick={() => alert('ส่งงานเรียบร้อยแล้ว!')}
                className="w-[119px] h-[40px] bg-[#35A9E8] hover:bg-[#269bdc] rounded-full text-white text-[13px] font-semibold cursor-pointer transition shadow-md"
              >
                ส่งงาน
              </button>
            </div>
          </div>

          {/* BOARD AREA */}
          <div className="flex-1 min-w-0 rounded-[22px] bg-gradient-to-b from-[#9687C2] via-[#8FB0D5] to-[#8BE8F5] overflow-x-scroll overflow-y-hidden">
            <div className="w-max min-w-full h-full p-[16px]">
              <div className="flex gap-[14px] items-start h-full">
                {columns.map((col) => (
                  <div
                    key={col.id}
                    onDragOver={(e) => {
                      if (!dragging) return;
                      e.preventDefault();
                      setDragOver({ columnId: col.id, cardId: null });
                    }}
                    onDrop={(e) => handleDrop(e, col.id)}
                    className={`w-[178px] max-h-full bg-white rounded-[8px] px-[11px] py-[12px] shrink-0 flex flex-col transition ${
                      dragging && dragOver?.columnId === col.id ? 'ring-2 ring-[#35A9E8]' : ''
                    }`}
                  >
                    <h4 className="text-black text-[13px] font-bold mb-[14px] shrink-0">
                      {col.title}
                    </h4>

                    {/* ส่วนการ์ด: เลื่อนได้เมื่อยาวเกิน */}
                    <div className="space-y-[7px] mb-[8px] flex-1 min-h-0 overflow-y-auto pr-1 [scrollbar-width:thin]">
                      {col.cards.map((card) => (
                        <div
                          key={card.id}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.effectAllowed = 'move';
                            e.dataTransfer.setData('text/plain', card.id); // จำเป็นสำหรับ Firefox
                            setDragging({ cardId: card.id, fromColumnId: col.id });
                          }}
                          onDragEnd={endDrag}
                          onDragOver={(e) => {
                            if (!dragging) return;
                            e.preventDefault();
                            e.stopPropagation();
                            setDragOver({ columnId: col.id, cardId: card.id });
                          }}
                          onDrop={(e) => handleDrop(e, col.id, card.id)}
                          onClick={() => setOpenCard({ columnId: col.id, cardId: card.id })}
                          className={`bg-[#F5F5F5] border border-[#E5E5E5] hover:border-[#35A9E8] rounded-[8px] p-[8px] text-[11px] text-gray-700 cursor-grab active:cursor-grabbing transition ${
                            dragging?.cardId === card.id ? 'opacity-40' : ''
                          } ${
                            dragging && dragOver?.cardId === card.id && dragging.cardId !== card.id
                              ? 'border-t-[3px] border-t-[#35A9E8]'
                              : ''
                          }`}
                        >
                          <div className="break-words">{card.title}</div>

                          {(card.priority || card.dueDate || card.assignees?.length > 0 || card.subtasks?.length > 0) && (
                            <div className="flex flex-wrap items-center gap-[4px] mt-[6px]">
                              {card.priority && (
                                <span
                                  className={`px-[6px] py-[1px] rounded-full text-[9px] font-semibold ${card.priority === 'urgent' ? 'bg-[#FF6B6B] text-white' : 'bg-[#06D6A0] text-gray-800'
                                    }`}
                                >
                                  {PRIORITIES[card.priority]}
                                </span>
                              )}
                              {card.dueDate && (
                                <span className="px-[6px] py-[1px] rounded-full bg-[#E8F4FD] text-[#35A9E8] text-[9px] font-semibold">
                                  {formatDueDate(card.dueDate)}
                                </span>
                              )}
                              {card.subtasks?.length > 0 && (
                                <span className="px-[6px] py-[1px] rounded-full bg-[#EDE9F7] text-[#7C6BAF] text-[9px] font-semibold">
                                  งานย่อย {card.subtasks.filter((s) => s.done).length}/{card.subtasks.length}
                                </span>
                              )}
                              {card.assignees?.map((id) => {
                                const m = MEMBERS.find((x) => x.id === id);
                                return m ? (
                                  <span
                                    key={id}
                                    className={`w-[16px] h-[16px] rounded-full flex items-center justify-center text-[8px] font-bold text-black ${m.bg}`}
                                  >
                                    {m.initial}
                                  </span>
                                ) : null;
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setAddCardColumnId(col.id)}
                      className="w-full shrink-0 flex items-center gap-[5px] text-[#B7B7B7] text-[10px] cursor-pointer hover:text-[#777777]"
                    >
                      <Plus className="w-[11px] h-[11px]" />
                      <span>เพิ่มการ์ด</span>
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => alert('เพิ่มลิสต์รายการอื่น ๆ')}
                  className="w-[190px] h-[47px] bg-white/40 hover:bg-white/50 rounded-[22px] shrink-0 text-white text-[13px] font-semibold flex items-center justify-center cursor-pointer transition"
                >
                  + เพิ่มลิสต์รายการอื่น ๆ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {addCardColumnId && (
        <AddCard
          columnTitle={columns.find((c) => c.id === addCardColumnId)?.title}
          onCancel={() => setAddCardColumnId(null)}
          onSubmit={handleSubmitCard}
        />
      )}

      {openCardData && (
        <CardDetail
          columnTitle={openColumn.title}
          card={openCardData}
          onCancel={() => setOpenCard(null)}
          onSave={handleSaveCard}
        />
      )}

      {/* =========================================
          GROUP INFO MODAL
      ========================================= */}
      {isGroupModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-[700px] bg-white rounded-[24px] shadow-2xl p-[32px] relative flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="w-[380px] h-[46px] bg-[#EAEAEA] rounded-[16px] px-[16px] flex items-center text-gray-500 text-[14px]">
               Software Testing
              </div>
              <button
                onClick={() => setIsGroupModalOpen(false)}
                className="w-[46px] h-[46px] rounded-full bg-[#35A9E8] hover:bg-[#269bdc] text-white flex items-center justify-center cursor-pointer transition shadow-md"
              >
                <X className="w-[24px] h-[24px] stroke-[2.5]" />
              </button>
            </div>

            <div className="mb-6">
              <span className="text-black font-bold text-[14px] block mb-2">Members</span>
              <div className="flex items-center gap-2">
                <div className="w-[34px] h-[34px] rounded-full bg-[#FFD765] flex items-center justify-center text-[12px] font-semibold text-black">N</div>
                <div className="w-[34px] h-[34px] rounded-full bg-[#52C41A] flex items-center justify-center text-[12px] font-semibold text-white">C</div>
                <button
                  onClick={() => alert('เพิ่มสมาชิก')}
                  className="w-[34px] h-[34px] rounded-full bg-[#EAEAEA] hover:bg-[#dcdcdc] flex items-center justify-center text-gray-600 cursor-pointer"
                >
                  <Plus className="w-[18px] h-[18px]" />
                </button>
              </div>
            </div>

            <div className="mb-8">
              <button
                onClick={() => alert('ตั้งค่าวันกำหนดส่ง')}
                className="h-[34px] px-[18px] bg-[#35A9E8] hover:bg-[#269bdc] rounded-full text-white text-[13px] font-semibold cursor-pointer shadow-sm transition"
              >
                วันกำหนดส่ง
              </button>
            </div>

            <div className="mb-8">
              <h3 className="text-black font-bold text-[16px] mb-3">ไฟล์งานทั้งหมด</h3>
              <div className="space-y-3">
                {files.map((file, idx) => (
                  <div
                    key={idx}
                    className="w-full h-[48px] bg-[#D774EE] rounded-[16px] px-[20px] flex items-center justify-between text-white font-medium text-[14px] shadow-sm"
                  >
                    <span>{file}</span>
                    <button
                      onClick={() => handleDeleteFile(idx)}
                      className="text-white/80 hover:text-white cursor-pointer"
                    >
                      <Trash2 className="w-[20px] h-[20px]" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleAddFile}
                  className="w-full h-[48px] bg-[#D9D9D9] hover:bg-[#cccccc] rounded-[16px] flex items-center justify-center text-gray-600 cursor-pointer transition"
                >
                  <Plus className="w-[22px] h-[22px]" />
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setIsGroupModalOpen(false)}
                className="w-[110px] h-[40px] bg-[#35A9E8] hover:bg-[#269bdc] rounded-full text-white text-[14px] font-semibold cursor-pointer transition shadow-md"
              >
                เสร็จสิ้น
              </button>
            </div>
          </div>
        </div>
      )}


      {/* =========================================
          SHARE MODAL
      ========================================= */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-[500px] bg-white rounded-[24px] shadow-2xl p-[28px] relative flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-black font-bold text-[16px]">เชิญสมาชิกเข้ากลุ่ม</h3>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer transition"
              >
                <X className="w-[20px] h-[20px]" />
              </button>
            </div>

            <div className="mb-4">
              <span className="text-gray-700 text-[13px] block mb-1">รหัสกลุ่ม</span>
              <div className="w-full h-[46px] bg-[#F4F4F4] rounded-[12px] px-[16px] flex items-center justify-between text-black font-bold text-[16px] tracking-wider">
                <span>ASDF31</span>
                <button
                  onClick={handleCopyCode}
                  className="text-gray-500 hover:text-[#35A9E8] flex items-center gap-1 text-[12px] font-normal cursor-pointer transition"
                >
                  <Copy className="w-[16px] h-[16px]" />
                  <span>คัดลอกลิงก์</span>
                </button>
              </div>
              <p className="text-gray-400 text-[11px] mt-1">ใครก็ตามที่มีลิงก์นี้ สามารถเข้าร่วมเป็นสมาชิกได้</p>
            </div>

            <div className="mb-6">
              {/* แท็บสลับ สมาชิกกลุ่ม / คำขอเข้ากลุ่ม */}
              <div className="flex gap-[24px] border-b border-gray-200 mb-3">
                {[
                  { key: 'members', label: 'สมาชิกกลุ่ม' },
                  { key: 'requests', label: 'คำขอเข้ากลุ่ม', count: joinRequests.length },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setShareTab(tab.key)}
                    className={`pb-2 -mb-px text-[13px] font-semibold flex items-center gap-[6px] cursor-pointer transition border-b-2 ${
                      shareTab === tab.key
                        ? 'text-black border-[#35A9E8]'
                        : 'text-gray-400 border-transparent hover:text-gray-600'
                    }`}
                  >
                    {tab.label}
                    {tab.count > 0 && (
                      <span className="min-w-[18px] h-[18px] px-[5px] rounded-full bg-[#FF6B6B] text-white text-[10px] flex items-center justify-center">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {shareTab === 'members' ? (
                <div className="space-y-3">
                  {groupMembers.map((m) => (
                    <div key={m.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-[30px] h-[30px] rounded-full ${m.bg} flex items-center justify-center text-[11px] font-semibold ${m.text}`}>
                          {m.initial}
                        </div>
                        <span className="text-[13px] text-gray-800">{m.name}</span>
                      </div>
                      <select className="bg-gray-100 text-gray-700 text-[12px] px-2 py-1 rounded-[8px] outline-none cursor-pointer">
                        <option>สมาชิก</option>
                        <option>แอดมิน</option>
                      </select>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {joinRequests.length === 0 && (
                    <p className="text-gray-400 text-[12px] text-center py-4">ไม่มีคำขอเข้ากลุ่ม</p>
                  )}
                  {joinRequests.map((r) => (
                    <div key={r.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-[30px] h-[30px] rounded-full ${r.bg} flex items-center justify-center text-[11px] font-semibold ${r.text}`}>
                          {r.initial}
                        </div>
                        <span className="text-[13px] text-gray-800">{r.name}</span>
                      </div>
                      <div className="flex items-center gap-[6px]">
                        <button
                          onClick={() => handleAcceptRequest(r)}
                          className="px-[10px] py-[3px] rounded-[4px] border border-gray-200 bg-[#FBF5F5] hover:bg-[#E8F4FD] text-[11px] text-black cursor-pointer transition"
                        >
                          ตอบรับ
                        </button>
                        <button
                          onClick={() => handleRejectRequest(r.id)}
                          className="px-[10px] py-[3px] rounded-[4px] border border-gray-200 bg-[#FBF5F5] hover:bg-[#FFE3E3] text-[11px] text-black cursor-pointer transition"
                        >
                          ปฏิเสธ
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="w-[100px] h-[38px] bg-[#35A9E8] hover:bg-[#269bdc] rounded-full text-white text-[13px] font-semibold cursor-pointer transition shadow-sm"
              >
                เสร็จสิ้น
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}