'use client';
import React, { useState, useRef, RefObject } from 'react';
import BookmarkItem from './BookmarkItem';
import OperationPanel from './OperationPanel';

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
    <div className="flex w-full min-h-screen">
      {/* 左侧内容区 */}
      <div className="flex-1 p-5">
        <div className="relative w-full h-[calc(100vh-2.5rem)] bg-gradient-to-br from-blue-50 to-white border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
          {items.map((item) => (
            <BookmarkItem
              key={item.id}
              id={item.id}
              content={item.content}
              position={item.position}
              isEditing={item.isEditing}
              nodeRef={nodeRefs.current[item.id]}
              onDrag={handleDrag}
              onDelete={deleteItem}
              onEdit={startEditing}
              onContentChange={handleContentChange}
            />
          ))}
        </div>
      </div>

      {/* 右侧操作栏 */}
      <OperationPanel onAddBookmark={addNewItem} />
    </div>
  );
}