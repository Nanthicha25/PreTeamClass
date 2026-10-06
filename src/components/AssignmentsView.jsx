import React, { useState } from 'react';
import { Users, Plus, X, Trash2 } from 'lucide-react';
import TrelloBoardView from './TrelloBoardView'; // นำเข้าหน้า Trello ที่แยกไว้

export default function AssignmentsView() {
  const [activeTab, setActiveTab] = useState('pending');
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // State สำหรับเก็บงานที่ถูกเลือกเพื่อเปิดหน้า Trello
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [files, setFiles] = useState(['ไฟล์งานที่ 1']);

  const pendingAssignments = [
    { id: 1, title: 'ชื่องาน : Software Testing', dueDate: 'วันครบกำหนด 23/07/69', bg: 'bg-[#FF6B6B] text-white' },
  ];

  const submittedAssignments = [
    { id: 5, title: 'ชื่องาน : Computer Network (ส่งแล้ว)', dueDate: 'ส่งเมื่อ 20/07/69', bg: 'bg-[#06D6A0] text-gray-800' },
  ];

  const currentList = activeTab === 'pending' ? pendingAssignments : submittedAssignments;

  if (selectedAssignment) {
  return (
    <div className="h-full">
      <TrelloBoardView
        assignment={selectedAssignment}
        onBack={() => setSelectedAssignment(null)}
      />
    </div>
  );
}

  // หน้าหลักรายการงาน
  return (
    <div className="w-full min-h-screen bg-white pb-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 pt-6">
        <div className="bg-[#EBF3FF] border border-blue-100 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">งานของฉัน</h1>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsJoinModalOpen(true)}
                className="p-2 bg-white hover:bg-gray-100 rounded-full transition text-gray-700 shadow-xs cursor-pointer border border-blue-100"
                title="เข้าร่วมกลุ่ม"
              >
                <Users className="w-6 h-6" />
              </button>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="p-2 bg-white hover:bg-gray-100 rounded-full transition text-gray-700 shadow-xs cursor-pointer border border-blue-100"
                title="สร้างงานใหม่"
              >
                <Plus className="w-7 h-7" />
              </button>
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition cursor-pointer shadow-xs ${
                activeTab === 'pending'
                  ? 'bg-[#1D63FF] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-blue-100'
              }`}
            >
              งานที่ยังไม่ได้ส่ง
            </button>
            <button
              onClick={() => setActiveTab('submitted')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition cursor-pointer shadow-xs ${
                activeTab === 'submitted'
                  ? 'bg-[#1D63FF] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-blue-100'
              }`}
            >
              งานที่ส่งแล้ว
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-6">
        <div className="space-y-4">
          {currentList.length > 0 ? (
            currentList.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedAssignment(item)}
                className={`${item.bg} rounded-full py-4 px-8 flex items-center justify-between shadow-xs hover:shadow-md transition cursor-pointer w-full`}
              >
                <span className="font-medium text-lg">{item.title}</span>
                {item.dueDate && (
                  <span className="text-sm opacity-90 font-light">{item.dueDate}</span>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-400">ไม่มีรายการงานในหมวดหมู่นี้</div>
          )}
        </div>
      </div>

      {/* Modal: เข้าร่วมกลุ่ม */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 bg-black/35 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">เข้าร่วมกลุ่ม</h3>
              <button
                onClick={() => setIsJoinModalOpen(false)}
                className="text-[#3B82F6] hover:bg-blue-50 p-1.5 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-5">
              <input
                type="text"
                placeholder="รหัสเข้าร่วม"
                className="w-full bg-[#F1F3F5] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-400 outline-none text-gray-700"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    alert('เข้าร่วมกลุ่มสำเร็จ!');
                    setIsJoinModalOpen(false);
                  }}
                  className="bg-[#38BDF8] hover:bg-[#0EA5E9] text-white font-medium px-6 py-2 rounded-xl text-sm transition shadow-xs cursor-pointer"
                >
                  เข้าร่วม
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: สร้างงานใหม่ */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/35 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <input
                type="text"
                placeholder="ชื่องาน"
                value={assignmentTitle}
                onChange={(e) => setAssignmentTitle(e.target.value)}
                className="bg-[#F1F3F5] border-none rounded-xl px-4 py-2.5 text-sm w-3/4 focus:ring-2 focus:ring-blue-400 outline-none font-medium text-gray-800"
              />
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-[#3B82F6] hover:bg-blue-50 p-1.5 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <button className="bg-[#E2EEFE] text-[#1D63FF] hover:bg-blue-200 text-xs font-semibold px-4 py-2 rounded-full transition shadow-xs cursor-pointer">
                วันกำหนดส่ง
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <h4 className="text-sm font-semibold text-gray-700">ไฟล์งานทั้งหมด</h4>
              {files.map((file, index) => (
                <div key={index} className="bg-[#D946EF] text-white rounded-xl py-3 px-4 flex items-center justify-between shadow-xs">
                  <span className="text-sm font-medium">{file}</span>
                  <button 
                    onClick={() => setFiles(files.filter((_, i) => i !== index))}
                    className="hover:bg-fuchsia-600 p-1 rounded transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              <button 
                onClick={() => setFiles([...files, `ไฟล์งานที่ ${files.length + 1}`])}
                className="w-full bg-[#F1F3F5] hover:bg-gray-200 text-gray-600 rounded-xl py-3 flex items-center justify-center transition shadow-xs cursor-pointer"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  alert('สร้างงานเรียบร้อยแล้ว!');
                  setIsCreateModalOpen(false);
                }}
                className="bg-[#38BDF8] hover:bg-[#0EA5E9] text-white font-medium px-6 py-2 rounded-xl text-sm transition shadow-xs cursor-pointer"
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