import React from 'react';
import { Menu, Plus } from 'lucide-react';

export default function Navbar({ onToggleSidebar }) {
  return (
    <header className="bg-white border-b border-gray-200 h-18 flex items-center justify-between px-6 sm:px-8 z-20 shadow-xs">
      <div className="flex items-center space-x-6">
        <button 
          onClick={onToggleSidebar}
          className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-700 transition cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-2xl sm:text-3xl font-black tracking-wider text-gray-900">
          TEAMCLASS
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <button 
          className="w-11 h-11 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-700 transition cursor-pointer"
          title="เพิ่ม"
        >
          <Plus className="w-6 h-6" />
        </button>
        <div className="w-11 h-11 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shadow-sm">
          N
        </div>
      </div>
    </header>
  );
}