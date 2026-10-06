import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  FileText,
  ClipboardList,
} from 'lucide-react';

export default function AssignmentDetail({
  assignment,
  onBack,
  onOpenFile,
}) {
  const [files] = useState([
    {
      id: 1,
      name: 'Worklist1',
      description: 'งานทดสอบระบบ Login',
      assignee: 'N',
      dueDate: '10/10/2026',
      priority: 'ปานกลาง',
    },
    {
      id: 2,
      name: 'Worklist2',
      description: 'งานทดสอบระบบ Register',
      assignee: 'C',
      dueDate: '12/10/2026',
      priority: 'สูง',
    },
  ]);

  const [subFiles] = useState([
    {
      id: 1,
      name: 'Task 1',
      parent: 'Worklist1',
    },
    {
      id: 2,
      name: 'Task 2',
      parent: 'Worklist1',
    },
    {
      id: 3,
      name: 'Task 3',
      parent: 'Worklist2',
    },
  ]);

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

        <div className="w-[306px] h-[40px] bg-white rounded-full px-[16px] flex items-center">
          <span className="text-[#777] text-[14px]">
            {assignment?.title?.replace('ชื่องาน : ', '') || 'Software Testing'}
          </span>
        </div>

      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto bg-[#F7F8FC] p-[30px]">

        <div className="max-w-[900px] mx-auto">

          {/* ข้อมูลรายละเอียดงาน */}
          <section className="bg-white rounded-[20px] p-[25px] shadow-sm mb-[24px]">

            <h2 className="text-[20px] font-bold mb-[18px]">
              ข้อมูลรายละเอียดงาน
            </h2>

            <div className="bg-[#EAEAEA] rounded-[14px] px-[18px] py-[14px] mb-[18px]">
              <span className="text-[16px] font-semibold">
                {assignment?.title?.replace('ชื่องาน : ', '') || 'Work1'}
              </span>
            </div>

            <div>
              <p className="text-[13px] font-bold mb-[8px]">
                ผู้รับผิดชอบ
              </p>

              <div className="w-[32px] h-[32px] rounded-full bg-[#FFD765] flex items-center justify-center text-[12px] font-bold">
                N
              </div>
            </div>

          </section>

          {/* ไฟล์งานทั้งหมด */}
          <section className="bg-white rounded-[20px] p-[25px] shadow-sm mb-[24px]">

            <div className="flex items-center gap-[10px] mb-[18px]">
              <FileText className="w-[22px] h-[22px] text-[#7C6BAF]" />

              <h2 className="text-[20px] font-bold">
                ไฟล์งานทั้งหมด
              </h2>
            </div>

            <div className="space-y-[10px]">

              {files.map((file) => (
                <button
                  key={file.id}
                  onClick={() => onOpenFile(file)}
                  className="w-full min-h-[58px] bg-[#F5F5F5] hover:bg-[#EEEEEE] rounded-[14px] px-[18px] flex items-center justify-between cursor-pointer transition"
                >

                  <div className="flex items-center gap-[12px]">

                    <div className="w-[36px] h-[36px] rounded-full bg-[#D774EE] flex items-center justify-center">
                      <FileText className="w-[18px] h-[18px] text-white" />
                    </div>

                    <div className="text-left">
                      <p className="text-[14px] font-semibold">
                        {file.name}
                      </p>

                      <p className="text-[11px] text-gray-500">
                        {file.description}
                      </p>
                    </div>

                  </div>

                  <ChevronRight className="w-[20px] h-[20px] text-gray-400" />

                </button>
              ))}

            </div>

          </section>

          {/* ไฟล์ลิสต์ย่อย */}
          <section className="bg-white rounded-[20px] p-[25px] shadow-sm">

            <div className="flex items-center gap-[10px] mb-[18px]">

              <ClipboardList className="w-[22px] h-[22px] text-[#35A9E8]" />

              <h2 className="text-[20px] font-bold">
                ไฟล์ลิสต์ย่อย
              </h2>

            </div>

            <div className="space-y-[10px]">

              {subFiles.map((file) => (
                <button
                  key={file.id}
                  onClick={() => onOpenFile(file)}
                  className="w-full min-h-[54px] bg-[#F5F5F5] hover:bg-[#EEEEEE] rounded-[14px] px-[18px] flex items-center justify-between cursor-pointer transition"
                >

                  <div className="text-left">

                    <p className="text-[14px] font-semibold">
                      {file.name}
                    </p>

                    <p className="text-[11px] text-gray-500">
                      อยู่ใน {file.parent}
                    </p>

                  </div>

                  <ChevronRight className="w-[20px] h-[20px] text-gray-400" />

                </button>
              ))}

            </div>

          </section>

        </div>

      </div>

    </div>
  );
}