import React, { useState } from 'react';
import {
  MoreVertical,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  ArrowDownAZ,
  ArrowUpAZ,
} from 'lucide-react';

const ACCENT = 'text-[#0AA2FF]';
const ACCENT_BG = 'bg-[#0AA2FF]';

const TABS = [
  { key: 'forum', label: 'ฟอรัม' },
  { key: 'classwork', label: 'งานในชั้นเรียน' },
  { key: 'people', label: 'บุคคล' },
];


const CLASSWORK = [
  { id: 'w1', title: 'งาน', subtitle: 'งานเดี่ยว', soon: 'วันเสาร์ - 23:59', due: '25 ก.ค. 23:59', topic: 'ไม่มีหัวข้อ' },
  { id: 'w2', title: 'โปรเจค', subtitle: 'งานกลุ่ม 2 คน', soon: 'วันเสาร์ - 23:59', due: '25 ก.ค. 23:59', topic: 'ไม่มีหัวข้อ' },
];

const STUDENTS = [{ id: 's1', name: 'ชื่อนักศึกษา', initial: 'P', bg: 'bg-purple-500' },
  { id: 's1', name: 'ชื่อนักศึกษา', initial: 'N', bg: 'bg-blue-500' },
  { id: 's1', name: 'ชื่อนักศึกษา', initial: 'A', bg: 'bg-pink-500' }
];


function PostCard({ post, instructor, avatar, avatarBg }) {
  const [comments, setComments] = useState(post.comments || []);
  const [isCommenting, setIsCommenting] = useState(false);
  const [draft, setDraft] = useState('');

  const submitComment = () => {
    const text = draft.trim();
    if (!text) return;
    setComments((prev) => [...prev, { id: `c${Date.now()}`, author: STUDENTS[0].name, text }]);
    setDraft('');
    setIsCommenting(false);
  };

  return (
    <div className="bg-[#F1F6FD] rounded-2xl overflow-hidden">
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-[48px] h-[48px] rounded-full flex items-center justify-center text-white text-[24px] ${avatarBg}`}
            >
              {avatar}
            </div>
            <div className="leading-tight">
              <p className="text-[17px] font-medium text-gray-900">{instructor}</p>
              <p className="text-[13px] text-gray-500">{post.date}</p>
            </div>
          </div>
          <button className="p-1 text-gray-700 hover:text-black rounded-full cursor-pointer" title="ตัวเลือก">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
        <p className="mt-4 text-[17px] text-gray-900 break-words">{post.text}</p>
      </div>

      {comments.length > 0 && (
        <div className="px-5 pb-3 space-y-2 border-t border-gray-300/70 pt-3">
          {comments.map((c) => (
            <div key={c.id} className="text-[14px]">
              <span className="font-medium text-gray-900">{c.author}</span>
              <span className="text-gray-700"> {c.text}</span>
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-gray-300/70 px-5 py-3">
        {isCommenting ? (
          <div className="flex items-center gap-2">
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submitComment();
                if (e.key === 'Escape') setIsCommenting(false);
              }}
              placeholder="เพิ่มความคิดเห็น..."
              className="flex-1 h-[38px] px-4 rounded-full bg-white border border-gray-200 text-[14px] outline-none focus:border-[#0AA2FF]"
            />
            <button
              onClick={submitComment}
              className={`h-[38px] px-4 rounded-full ${ACCENT_BG} text-white text-[13px] font-semibold cursor-pointer hover:opacity-90`}
            >
              ส่ง
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsCommenting(true)}
            className={`flex items-center gap-2 ${ACCENT} text-[17px] font-medium cursor-pointer hover:opacity-80`}
          >
            <MessageSquare className="w-[26px] h-[26px]" />
            เพิ่มความคิดเห็น
          </button>
        )}
      </div>
    </div>
  );
}

/* =========================
   แท็บ 1: ฟอรัม
========================= */
function ForumTab({ subject, onSeeAll }) {
  const posts = [
    { id: 'p1', date: '20 ก.ค.', text: 'ทดลองประกาศข่าวสารต่างๆ', comments: [] },
  ];

  return (
    <div className="max-w-[1000px] mx-auto px-6 py-8">
      {/* แบนเนอร์ */}
      <div
        className={`h-[200px] rounded-3xl bg-gradient-to-r ${subject.headerBg} text-white px-10 py-8 flex flex-col`}
      >
        <div className="!m-0 !text-[48px] !leading-[1.3] !font-light !text-white break-words">
          {subject.title}
        </div>
        <p className="!m-0 !text-[22px] !font-semibold !text-white">{subject.room}</p>
      </div>

      <div className="mt-8 flex flex-col md:flex-row gap-5 items-start">
        {/* เร็วๆ นี้ */}
        <div className="w-full md:w-[200px] shrink-0 border-2 border-[#CBE8FB] rounded-2xl p-4">
          <h3 className="text-[20px] font-bold text-black mb-2">เร็วๆ นี้</h3>
          <div className="space-y-1">
            {CLASSWORK.map((w) => (
              <p key={w.id} className="text-[12px] font-semibold text-gray-700">
                {w.soon} - {w.title}
              </p>
            ))}
          </div>
          <div className="flex justify-end mt-2">
            <button
              onClick={onSeeAll}
              className={`${ACCENT} text-[13px] font-semibold hover:underline cursor-pointer`}
            >
              ดูทั้งหมด
            </button>
          </div>
        </div>

        {/* ประกาศ */}
        <div className="flex-1 min-w-0 w-full space-y-4">
          {posts.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              instructor={subject.instructor}
              avatar={subject.avatar}
              avatarBg={subject.avatarBg || 'bg-blue-500'}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================
   แท็บ 2: งานในชั้นเรียน
========================= */
function ClassworkTab() {
  const topics = ['ไม่มีหัวข้อ'];
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [isTopicOpen, setIsTopicOpen] = useState(false);
  const [collapsed, setCollapsed] = useState({}); // { [topic]: true }

  const visibleTopics = selectedTopic === 'all' ? topics : topics.filter((t) => t === selectedTopic);

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8">
      {/* ตัวกรองหัวข้อ */}
      <div className="relative w-[310px] max-w-full">
        <button
          onClick={() => setIsTopicOpen((v) => !v)}
          className="w-full h-[68px] px-6 rounded-2xl border-2 border-[#CBE8FB] bg-white flex items-center justify-between text-[22px] text-gray-900 cursor-pointer hover:bg-gray-50"
        >
          <span>{selectedTopic === 'all' ? 'หัวข้อทั้งหมด' : selectedTopic}</span>
          <ChevronDown className={`w-6 h-6 text-[#1E2D4A] transition ${isTopicOpen ? 'rotate-180' : ''}`} />
        </button>

        {isTopicOpen && (
          <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-1 z-20">
            {['all', ...topics].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setSelectedTopic(t);
                  setIsTopicOpen(false);
                }}
                className={`w-full text-left px-6 py-3 text-[16px] hover:bg-gray-100 cursor-pointer ${
                  selectedTopic === t ? `font-bold ${ACCENT}` : 'text-gray-700'
                }`}
              >
                {t === 'all' ? 'หัวข้อทั้งหมด' : t}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* กลุ่มงานตามหัวข้อ */}
      {visibleTopics.map((topic) => {
        const items = CLASSWORK.filter((w) => w.topic === topic);
        const isCollapsed = collapsed[topic];
        return (
          <div key={topic} className="mt-8">
            <button
              onClick={() => setCollapsed((prev) => ({ ...prev, [topic]: !prev[topic] }))}
              className="w-full flex items-center justify-between pb-2 border-b border-gray-500 cursor-pointer"
            >
              <h2 className="text-[26px] text-gray-900">{topic}</h2>
              {isCollapsed ? (
                <ChevronDown className="w-6 h-6 text-[#1E2D4A]" />
              ) : (
                <ChevronUp className="w-6 h-6 text-[#1E2D4A]" />
              )}
            </button>

            {!isCollapsed &&
              items.map((w) => (
                <div
                  key={w.id}
                  className="flex items-center gap-3 py-2 border-b border-gray-400 hover:bg-gray-50 transition"
                >
                  <div className="w-[40px] h-[40px] rounded-full bg-[#1E2D4A] flex items-center justify-center shrink-0">
                    <ClipboardList className="w-[22px] h-[22px] text-white" />
                  </div>
                  <div className="flex-1 min-w-0 leading-tight">
                    <p className="text-[24px] text-gray-900 truncate">{w.title}</p>
                    <p className="text-[13px] text-gray-700">{w.subtitle}</p>
                  </div>
                  <p className="text-[20px] text-gray-900 whitespace-nowrap">ครบกำหนด {w.due}</p>
                  <button className="p-1 text-[#1E2D4A] hover:text-black rounded-full cursor-pointer" title="ตัวเลือก">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              ))}
          </div>
        );
      })}
    </div>
  );
}

/* =========================
   แท็บ 3: บุคคล
========================= */
function PeopleTab({ subject }) {
  const [sortAsc, setSortAsc] = useState(true);

  const students = [...STUDENTS].sort((a, b) =>
    sortAsc ? a.name.localeCompare(b.name, 'th') : b.name.localeCompare(a.name, 'th')
  );

  return (
    <div className="max-w-[760px] mx-auto px-6 py-8">
      {/* อาจารย์ */}
      <h2 className="text-[34px] text-gray-900 pb-1 border-b border-gray-500">อาจารย์</h2>
      <div className="flex items-center gap-4 py-3 border-b border-gray-500">
        <div
          className={`w-[40px] h-[40px] rounded-full flex items-center justify-center text-white text-[22px] ${
            subject.avatarBg || 'bg-blue-500'
          }`}
        >
          {subject.avatar}
        </div>
        <span className="text-[18px] text-gray-900">{subject.instructor}</span>
      </div>

      {/* นักเรียน */}
      <div className="mt-12">
        <div className="flex items-end justify-between pb-1 border-b border-gray-500">
          <div className="flex items-center gap-2">
            <h2 className="text-[34px] text-gray-900">นักเรียน</h2>
            <button
              onClick={() => setSortAsc((v) => !v)}
              className="text-[#1E2D4A] hover:text-black cursor-pointer"
              title={sortAsc ? 'เรียง ก-ฮ' : 'เรียง ฮ-ก'}
            >
              {sortAsc ? <ArrowDownAZ className="w-7 h-7" /> : <ArrowUpAZ className="w-7 h-7" />}
            </button>
          </div>
          <span className="text-[15px] text-gray-900 mb-1">นักเรียน {students.length} คน</span>
        </div>

        {students.map((s) => (
          <div key={s.id} className="flex items-center gap-4 py-3">
            <div
              className={`w-[34px] h-[34px] rounded-full flex items-center justify-center text-white text-[18px] ${s.bg}`}
            >
              {s.initial}
            </div>
            <span className="text-[15px] text-gray-900">{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}


export default function ClassDetailView({ subject }) {
  const [activeTab, setActiveTab] = useState('forum');

  return (
    <div className="w-full min-h-full bg-white">
      {/* แถบแท็บ */}
      <div className="border-b border-gray-200 bg-white px-8 sticky top-0 z-10">
        <div className="flex gap-[40px]">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative py-4 text-[17px] cursor-pointer transition ${
                  isActive ? `font-bold ${ACCENT}` : 'text-gray-900 hover:text-gray-600'
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className={`absolute left-0 right-0 bottom-[6px] h-[4px] rounded-full ${ACCENT_BG}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === 'forum' && <ForumTab subject={subject} onSeeAll={() => setActiveTab('classwork')} />}
      {activeTab === 'classwork' && <ClassworkTab />}
      {activeTab === 'people' && <PeopleTab subject={subject} />}
    </div>
  );
}