'use client';
import Draggable from 'react-draggable';
import { useState } from 'react';

interface DraggableItem {
  id: number;
  content: string;
  position: { x: number; y: number };
}

export default function Background() {
  const [items, setItems] = useState<DraggableItem[]>([]);
  const [nextId, setNextId] = useState(1);

  const addNewItem = () => {
    const newItem: DraggableItem = {
      id: nextId,
      content: `Item ${nextId}`,
      position: { x: 0, y: 0 }
    };
    setItems([...items, newItem]);
    setNextId(nextId + 1);
  };

  const handleDrag = (id: number, e: any, data: any) => {
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, position: { x: data.x, y: data.y } }
        : item
    ));
  };

  return (
    <div className="p-5 w-full min-h-screen">
      <div className="relative w-full h-[80vh] bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
        <button 
          onClick={addNewItem} 
          className="absolute top-5 left-5 px-4 py-2 bg-blue-500 text-white border-none rounded cursor-pointer hover:bg-blue-600 z-10"
        >
          添加新元素
        </button>
        {items.map((item) => (
          <Draggable
            key={item.id}
            position={item.position}
            onDrag={(e, data) => handleDrag(item.id, e, data)}
            bounds="parent"
          >
            <div className="p-4 bg-white border border-gray-200 rounded cursor-move select-none shadow-md min-w-[100px] text-center">
              {item.content}
            </div>
          </Draggable>
        ))}
      </div>
    </div>
  );
}