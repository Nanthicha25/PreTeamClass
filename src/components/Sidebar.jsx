import React from 'react';
import {
  Home,
  ClipboardList,
  Users,
  GraduationCap,
  Archive,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  activeMenu,
  setActiveMenu,
  teachingOpen,
  setTeachingOpen,
  classesOpen,
  setClassesOpen,
  subjects
}) {
  return (
    <>
      {/* Sidebar Backdrop for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`
  h-full z-30
  bg-white border-r border-gray-200
  transition-all duration-300 ease-in-out flex flex-col shrink-0
  ${isSidebarOpen ? 'w-72 shadow-xl md:shadow-none' : 'w-20'}
`}>
        <div className="py-4 flex flex-col space-y-1 overflow-y-auto flex-1">

          {/* หน้าแรก (Home) */}
          <button
            onClick={() => setActiveMenu('home')}
            className={`flex items-center px-4 py-3 mx-2 rounded-xl transition ${activeMenu === 'home' ? 'bg-blue-50 text-blue-600 font-semibold' : 'hover:bg-gray-100 text-gray-700'}`}
          >
            <Home className="w-6 h-6 shrink-0" />
            {isSidebarOpen && <span className="ml-4 text-sm">หน้าแรก</span>}
          </button>

          {/* งานของฉัน (Assignments) */}
          <button
            onClick={() => setActiveMenu('assignments')}
            className={`flex items-center px-4 py-3 mx-2 rounded-xl transition ${activeMenu === 'assignments' ? 'bg-blue-50 text-blue-600 font-semibold' : 'hover:bg-gray-100 text-gray-700'}`}
          >
            <ClipboardList className="w-6 h-6 shrink-0" />
            {isSidebarOpen && <span className="ml-4 text-sm">งานของฉัน</span>}
          </button>

          {/* การสอน (Teaching) */}
          <div>
            <button
              onClick={() => {
                if (!isSidebarOpen) setIsSidebarOpen(true);
                setTeachingOpen(!teachingOpen);
              }}
              className="w-full flex items-center justify-between px-4 py-3 mx-2 rounded-xl hover:bg-gray-100 text-gray-700 transition"
            >
              <div className="flex items-center">
                <Users className="w-6 h-6 shrink-0" />
                {isSidebarOpen && <span className="ml-4 text-sm">การสอน</span>}
              </div>
              {isSidebarOpen && (
                teachingOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
            {isSidebarOpen && teachingOpen && (
              <div className="pl-14 pr-4 py-1 space-y-1 text-sm text-gray-600">
                <div className="py-1.5 hover:text-blue-600 cursor-pointer">วิชาที่กำลังสอน</div>
                <div className="py-1.5 hover:text-blue-600 cursor-pointer">ตรวจงานแล้ว</div>
              </div>
            )}
          </div>

          {/* ชั้นเรียน (Classes) */}
          <div>
            <button
              onClick={() => {
                if (!isSidebarOpen) setIsSidebarOpen(true);
                setClassesOpen(!classesOpen);
              }}
              className="w-full flex items-center justify-between px-4 py-3 mx-2 rounded-xl hover:bg-gray-100 text-gray-700 transition"
            >
              <div className="flex items-center">
                <GraduationCap className="w-6 h-6 shrink-0" />
                {isSidebarOpen && <span className="ml-4 text-sm">ชั้นเรียน</span>}
              </div>
              {isSidebarOpen && (
                classesOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
            {isSidebarOpen && classesOpen && (
              <div className="pl-14 pr-4 py-1 space-y-1 text-sm text-gray-600">
                {subjects.map(sub => (
                  <div key={sub.id} className="py-1.5 hover:text-blue-600 cursor-pointer truncate">{sub.title}</div>
                ))}
              </div>
            )}
          </div>

          {/* ชั้นเรียนที่เก็บ (Archived Classes) */}
          <button
            onClick={() => setActiveMenu('archived')}
            className={`flex items-center px-4 py-3 mx-2 rounded-xl transition ${activeMenu === 'archived' ? 'bg-blue-50 text-blue-600 font-semibold' : 'hover:bg-gray-100 text-gray-700'}`}
          >
            <Archive className="w-6 h-6 shrink-0" />
            {isSidebarOpen && <span className="ml-4 text-sm">ชั้นเรียนที่เก็บ</span>}
          </button>

        </div>
      </aside>
    </>
  );
}