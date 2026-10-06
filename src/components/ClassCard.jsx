import React from 'react';
import { MoreVertical } from 'lucide-react';

export default function ClassCard({ subject, onClick }) {
  return (
    <div
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) onClick();
      }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`w-full h-[215px] bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden relative transition hover:shadow-md ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >

      {/* Header */}
      <div
        className={`
          h-[71px]
          px-4
          py-2.5
          bg-gradient-to-r
          ${subject.headerBg}
          text-white
          relative
        `}
      >
        <div className="pr-8">
          <h3 className="text-[18px] leading-6 font-medium truncate">
            {subject.title}
          </h3>

          <p className="text-[13px] leading-4 truncate opacity-90">
            {subject.room}
          </p>

          <p className="text-[13px] leading-4 truncate opacity-90">
            {subject.instructor}
          </p>
        </div>

        {/* Avatar */}
        <div
          className={`
            absolute
            -bottom-4
            right-4
            w-[50px]
            h-[50px]
            rounded-full
            border-2
            border-white
            flex
            items-center
            justify-center
            text-white
            text-[22px]
            font-normal
            shadow-xs
            ${subject.avatarBg || 'bg-purple-500'}
          `}
        >
          {subject.avatar}
        </div>
      </div>

      {/* Body */}
      <div className="h-[144px] px-4 py-4 relative">
        {subject.dueDate ? (
          <p className="text-[13px] leading-relaxed text-gray-700 font-normal">
            {subject.dueDate}
          </p>
        ) : (
          <p className="text-[13px] leading-relaxed text-gray-400">
            ไม่มีกำหนดส่งเร็วๆ นี้
          </p>
        )}

        {/* More button */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="
            absolute
            right-3
            bottom-3
            text-gray-500
            hover:text-gray-900
            p-1
            rounded-full
            transition
            cursor-pointer
          "
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
}