import React, { useRef, useState, useEffect } from 'react';
import { MousePointer2, Shapes, Type, PenTool, MessageCircleMore } from 'lucide-react';

// เครื่องมือในแถบด้านซ้าย (เรียงตามภาพต้นแบบ)
const TOOLS = [
  { id: 'select', icon: MousePointer2, title: 'เลือก/ย้าย' },
  { id: 'shape', icon: Shapes, title: 'เพิ่มกล่องความคิด' },
  { id: 'text', icon: Type, title: 'ข้อความ' },
  { id: 'draw', icon: PenTool, title: 'วาดเส้น' },
  { id: 'comment', icon: MessageCircleMore, title: 'ความคิดเห็น' },
];

const PLACEHOLDER = {
  shape: 'ความคิด',
  text: 'ข้อความ',
  comment: 'ความคิดเห็น',
};

export default function MindMapView() {
  const canvasRef = useRef(null);
  const dragRef = useRef(null); // { id, offsetX, offsetY }
  const drawingRef = useRef(null); // id ของเส้นที่กำลังวาด

  const [activeTool, setActiveTool] = useState('select');
  const [nodes, setNodes] = useState([]); // { id, type, x, y, text }
  const [strokes, setStrokes] = useState([]); // { id, points: [[x, y], ...] }
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // ลบรายการที่เลือกด้วยปุ่ม Delete / Backspace (ไม่ลบตอนกำลังพิมพ์)
  useEffect(() => {
    const onKeyDown = (e) => {
      if (editingId) return;
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        setNodes((prev) => prev.filter((n) => n.id !== selectedId));
        setStrokes((prev) => prev.filter((s) => s.id !== selectedId));
        setSelectedId(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [editingId, selectedId]);

  const getPoint = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  // ---------- Canvas events ----------
  const handleCanvasPointerDown = (e) => {
    if (e.target.closest('[data-toolbar]') || e.target.closest('[data-node]')) return;
    const { x, y } = getPoint(e);

    if (activeTool === 'draw') {
      const id = `s${Date.now()}`;
      drawingRef.current = id;
      setStrokes((prev) => [...prev, { id, points: [[x, y]] }]);
      canvasRef.current.setPointerCapture(e.pointerId);
      return;
    }

    if (activeTool === 'shape' || activeTool === 'text' || activeTool === 'comment') {
      const id = `n${Date.now()}`;
      setNodes((prev) => [...prev, { id, type: activeTool, x, y, text: '' }]);
      setSelectedId(id);
      setEditingId(id);
      setActiveTool('select');
      return;
    }

    // select: คลิกพื้นที่ว่าง = ยกเลิกการเลือก
    setSelectedId(null);
  };

  const handleCanvasPointerMove = (e) => {
    const { x, y } = getPoint(e);

    if (drawingRef.current) {
      const id = drawingRef.current;
      setStrokes((prev) =>
        prev.map((s) => (s.id === id ? { ...s, points: [...s.points, [x, y]] } : s))
      );
      return;
    }

    if (dragRef.current) {
      const { id, offsetX, offsetY } = dragRef.current;
      setNodes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, x: x - offsetX, y: y - offsetY } : n))
      );
    }
  };

  const handleCanvasPointerUp = () => {
    drawingRef.current = null;
    dragRef.current = null;
  };

  // ---------- Node events ----------
  const handleNodePointerDown = (e, node) => {
    if (activeTool !== 'select' || editingId === node.id) return;
    e.stopPropagation();
    setSelectedId(node.id);
    const { x, y } = getPoint(e);
    dragRef.current = { id: node.id, offsetX: x - node.x, offsetY: y - node.y };
    canvasRef.current.setPointerCapture(e.pointerId);
  };

  const updateText = (id, text) =>
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, text } : n)));

  const finishEditing = (node) => {
    setEditingId(null);
    // ถ้าไม่ได้พิมพ์อะไร ให้ลบรายการทิ้ง
    if (!node.text.trim()) {
      setNodes((prev) => prev.filter((n) => n.id !== node.id));
      setSelectedId(null);
    }
  };

  // ---------- Style ----------
  const nodeStyle = {
    shape: 'bg-[#E8E3F5] border-2 border-[#7C6BAF] rounded-[16px] px-[16px] py-[8px] min-w-[90px] text-center',
    text: 'px-[4px] py-[2px]',
    comment: 'bg-[#FFF3B0] border border-[#E6C84F] rounded-[16px] rounded-bl-[4px] px-[12px] py-[8px] min-w-[90px] shadow-sm',
  };

  const cursorClass =
    activeTool === 'select' ? 'cursor-default' : activeTool === 'text' ? 'cursor-text' : 'cursor-crosshair';

  return (
    <div className="flex-1 min-h-0 bg-white relative overflow-hidden">
      {/* พื้นที่ไวท์บอร์ด */}
      <div
        ref={canvasRef}
        onPointerDown={handleCanvasPointerDown}
        onPointerMove={handleCanvasPointerMove}
        onPointerUp={handleCanvasPointerUp}
        className={`absolute inset-0 touch-none ${cursorClass}`}
      >
        {/* เส้นที่วาดด้วยปากกา */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {strokes.map((s) => (
            <polyline
              key={s.id}
              points={s.points.map((p) => p.join(',')).join(' ')}
              fill="none"
              stroke={selectedId === s.id ? '#35A9E8' : '#7C6BAF'}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </svg>

        {/* กล่องความคิด / ข้อความ / ความคิดเห็น */}
        {nodes.map((node) => {
          const isEditing = editingId === node.id;
          const isSelected = selectedId === node.id;
          return (
            <div
              key={node.id}
              data-node
              onPointerDown={(e) => handleNodePointerDown(e, node)}
              onDoubleClick={() => {
                setEditingId(node.id);
                setSelectedId(node.id);
              }}
              style={{ left: node.x, top: node.y }}
              className={`absolute text-[14px] text-gray-800 select-none ${
                activeTool === 'select' ? 'cursor-move' : ''
              } ${nodeStyle[node.type]} ${isSelected ? 'ring-2 ring-[#35A9E8] ring-offset-2' : ''}`}
            >
              {isEditing ? (
                <input
                  autoFocus
                  value={node.text}
                  placeholder={PLACEHOLDER[node.type]}
                  onChange={(e) => updateText(node.id, e.target.value)}
                  onBlur={() => finishEditing(node)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === 'Escape') e.currentTarget.blur();
                  }}
                  className="bg-transparent outline-none text-[14px] text-gray-800 w-[140px] select-text"
                />
              ) : (
                <span>{node.text}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* แถบเครื่องมือลอยด้านซ้าย */}
      <div
        data-toolbar
        className="absolute left-[32px] top-[96px] w-[84px] bg-[#BDB4D8] rounded-[18px] py-[22px] flex flex-col items-center gap-[10px] z-10"
      >
        {TOOLS.map(({ id, icon: Icon, title }) => {
          const isActive = activeTool === id;
          return (
            <button
              key={id}
              title={title}
              onClick={() => setActiveTool(id)}
              className={`w-[38px] h-[38px] rounded-full flex items-center justify-center cursor-pointer transition ${
                isActive ? 'bg-[#E3E8FB] text-[#2B4EE6]' : 'bg-white text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon
                className={`w-[20px] h-[20px] stroke-[1.8] ${isActive ? 'fill-[#2B4EE6]' : ''}`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}