import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ClassCard from './components/ClassCard';
import AssignmentsView from './components/AssignmentsView';
import ClassDetailView from './components/Classdetailview';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [teachingOpen, setTeachingOpen] = useState(false);
  const [classesOpen, setClassesOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('home');
  const [selectedSubject, setSelectedSubject] = useState(null); // รายวิชาที่กดเข้าไปดู

  // เปลี่ยนเมนูจาก Sidebar แล้วให้ออกจากหน้ารายวิชาด้วย
  const handleSelectMenu = (menu) => {
    setSelectedSubject(null);
    setActiveMenu(menu);
  };

  const [subjects] = useState([
    {
      id: 1,
      title: 'Subject2',
      room: 'ห้อง',
      instructor: 'ชื่ออาจารย์',
      dueDate: 'ครบกำหนด วันเสาร์ 23:59 - ทดลอง',
      avatar: 'P',
      avatarBg: 'bg-purple-600',
      headerBg: 'from-blue-400 to-teal-400'
    },
    {
      id: 2,
      title: 'Subject1',
      room: 'ห้อง',
      instructor: 'ชื่ออาจารย์',
      dueDate: '',
      avatar: 'N',
      avatarBg: 'bg-blue-500',
      headerBg: 'from-purple-500 to-pink-500'
    }
  ]);

  return (
    // 1. ล็อกความสูงหน้าจอเต็มพอดี และซ่อน scrollbar นอกกรอบ
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50 font-sans text-gray-800">
      
      {/* 2. Navbar อยู่บนสุดตลอดเวลา */}
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* 3. ส่วนด้านล่างแบ่งเป็น Sidebar และ เนื้อหา */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar */}
        <Sidebar 
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          activeMenu={activeMenu}
          setActiveMenu={handleSelectMenu}
          teachingOpen={teachingOpen}
          setTeachingOpen={setTeachingOpen}
          classesOpen={classesOpen}
          setClassesOpen={setClassesOpen}
          subjects={subjects}
        />

        {/* 4. Main Content (ให้ Scroll เฉพาะส่วนนี้ ส่วน Navbar และ Sidebar จะนิ่งอยู่กับที่) */}
        <main className="flex-1 overflow-y-auto bg-white">
          {activeMenu === 'home' && selectedSubject && (
            <ClassDetailView subject={selectedSubject} />
          )}

          {activeMenu === 'home' && !selectedSubject && (
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {subjects.map((sub) => (
                  <ClassCard key={sub.id} subject={sub} onClick={() => setSelectedSubject(sub)} />
                ))}
              </div>
            </div>
          )}

          {activeMenu === 'assignments' && (
            <AssignmentsView />
          )}

          {activeMenu !== 'home' && activeMenu !== 'assignments' && (
            <div className="max-w-7xl mx-auto text-center py-20 text-gray-400">
              <h2 className="text-xl font-medium">หน้านี้กำลังอยู่ในระหว่างพัฒนา</h2>
            </div>
          )}
        </main>
      </div>

    </div>
  );
}