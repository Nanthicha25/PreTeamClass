import React from 'react';
import {
  ArrowLeft,
  User,
  CalendarDays,
  Flag,
  FileText,
} from 'lucide-react';

export default function SubtaskDetail({
  file,
  onBack,
}) {
  if (!file) return null;

  return (
    <div className="w-full h-full min-h-0 bg-white flex flex-col font-sans">

      {/* TOP BAR */}
      <div className="h-[84px] bg-[#7C6BAF] px-[34px] flex items-center gap-[28px] shrink-0">

        <button
          onClick={onBack}
          className="text-white hover:opacity-80 cursor-pointer"
        >
          <ArrowLeft className="w-[27px] h-[27px] stroke-[3]" />
        </button>

        <div className="text-white text-[18px] font-bold">
          รายละเอียดไฟล์งาน
        </div>

      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto bg-[#F7F8FC] p-[30px]">

        <div className="max-w-[800px] mx-auto bg-white rounded-[22px] shadow-sm p-[30px]">

          {/* ชื่อไฟล์ */}
          <div className="flex items-center gap-[14px] mb-[28px]">

            <div className="w-[52px] h-[52px] rounded-[14px] bg-[#D774EE] flex items-center justify-center">
              <FileText className="w-[25px] h-[25px] text-white" />
            </div>

            <div>
              <h1 className="text-[22px] font-bold">
                {file.name}
              </h1>

              <p className="text-[13px] text-gray-500">
                รายละเอียดงาน
              </p>
            </div>

          </div>

          {/* รายละเอียด */}
          <div className="mb-[25px]">

            <h2 className="text-[16px] font-bold mb-[10px]">
              รายละเอียด
            </h2>

            <div className="bg-[#F5F5F5] rounded-[14px] p-[16px] text-[14px] text-gray-700">
              {file.description || 'ยังไม่มีรายละเอียด'}
            </div>

          </div>

          {/* ผู้รับผิดชอบ */}
          <div className="mb-[20px]">

            <div className="flex items-center gap-[10px] mb-[8px]">
              <User className="w-[18px]" />
              <span className="font-bold text-[14px]">
                ผู้รับผิดชอบ
              </span>
            </div>

            <div className="w-[32px] h-[32px] rounded-full bg-[#FFD765] flex items-center justify-center text-[12px] font-bold">
              {file.assignee || 'N'}
            </div>

          </div>

          {/* วันกำหนดส่ง */}
          <div className="mb-[20px]">

            <div className="flex items-center gap-[10px] mb-[8px]">
              <CalendarDays className="w-[18px]" />

              <span className="font-bold text-[14px]">
                วันกำหนดส่ง
              </span>
            </div>

            <p className="text-[14px] text-gray-600">
              {file.dueDate || 'ยังไม่ได้กำหนด'}
            </p>

          </div>

          {/* ความสำคัญ */}
          <div className="mb-[25px]">

            <div className="flex items-center gap-[10px] mb-[8px]">
              <Flag className="w-[18px]" />

              <span className="font-bold text-[14px]">
                ความสำคัญ
              </span>
            </div>

            <span className="inline-flex px-[14px] py-[6px] rounded-full bg-[#E8F4FD] text-[#35A9E8] text-[12px] font-semibold">
              {file.priority || 'ไม่ได้กำหนด'}
            </span>

          </div>

          {/* ไฟล์แนบ */}
          <div>

            <h2 className="text-[16px] font-bold mb-[10px]">
              ไฟล์แนบ
            </h2>

            <div className="bg-[#F5F5F5] rounded-[14px] p-[14px] flex items-center gap-[10px]">
              <FileText className="w-[18px] text-gray-500" />

              <span className="text-[13px] text-gray-700">
                ยังไม่มีไฟล์แนบ
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}