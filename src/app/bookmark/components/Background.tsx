'use client';
import React, { useState, useRef, RefObject } from 'react';
import Draggable from 'react-draggable';

interface DraggableItem {
  id: number;
  content: string;
  position: { x: number; y: number };
  isEditing: boolean;
}

export default function Background() {
  const [items, setItems] = useState<DraggableItem[]>([]);
  const [nextId, setNextId] = useState(1);
  const nodeRefs = useRef<{ [key: number]: RefObject<HTMLDivElement> }>({});

  const addNewItem = () => {
    const newItem: DraggableItem = {
      id: nextId,
      content: `便签 ${nextId}`,
      position: { x: Math.random() * 100, y: Math.random() * 100 },
      isEditing: false,
    };
    nodeRefs.current[nextId] = React.createRef();
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

  const deleteItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const startEditing = (id: number) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, isEditing: true } : item
    ));
  };

  const handleContentChange = (id: number, newContent: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, content: newContent, isEditing: false } : item
    ));
  };

  return (
    <div className="p-5 w-full min-h-screen">
      <div className="relative w-full h-[80vh] bg-gradient-to-br from-blue-50 to-white border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
        <button 
          onClick={addNewItem} 
          className="absolute top-5 left-5 px-4 py-2 bg-blue-500 text-white border-none rounded-lg cursor-pointer hover:bg-blue-600 z-10 shadow-lg"
        >
          添加便签
        </button>
          {items.map((item) => (
            <Draggable
              key={item.id}
              position={item.position}
              onDrag={(e, data) => handleDrag(item.id, e, data)}
              bounds="parent"
              nodeRef={nodeRefs.current[item.id]}
            >
              <div 
                ref={nodeRefs.current[item.id]}
                className="group p-4 bg-white border border-gray-200 rounded-lg cursor-move select-none shadow-lg min-w-[150px] relative hover:scale-102"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteItem(item.id);
                  }}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-red-500 hover:text-red-600"
                >
                  ×
                </button>
                {item.isEditing ? (
                  <input
                    type="text"
                    value={item.content}
                    onChange={(e) => handleContentChange(item.id, e.target.value)}
                    onBlur={() => handleContentChange(item.id, item.content)}
                    className="w-full bg-transparent border-none outline-none text-center"
                    autoFocus
                  />
                ) : (
                  <div 
                    onDoubleClick={() => startEditing(item.id)}
                    className="text-center break-words"
                  >
                    {item.content}
                  </div>
                )}
              </div>
            </Draggable>
          ))}
      </div>
    </div>
  );
}