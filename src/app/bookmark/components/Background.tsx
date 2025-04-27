'use client';
import React, { useRef, RefObject, useEffect } from 'react';
import BookmarkItem from './BookmarkItem';

interface DraggableItem {
  id: number;
  content: string;
  position: { x: number; y: number };
  isEditing: boolean;
}

interface BackgroundProps {
  items: DraggableItem[];
  setItems: React.Dispatch<React.SetStateAction<DraggableItem[]>>;
}

export default function Background({ items, setItems }: BackgroundProps) {
  const nodeRefs = useRef<{ [key: number]: RefObject<HTMLDivElement> }>({});

  // Initialize or clean up refs when items change
  useEffect(() => {
    // Remove refs for items that no longer exist
    Object.keys(nodeRefs.current).forEach(key => {
      const numKey = parseInt(key);
      if (!items.find(item => item.id === numKey)) {
        delete nodeRefs.current[numKey];
      }
    });

    // Add refs for new items
    items.forEach(item => {
      if (!nodeRefs.current[item.id]) {
        nodeRefs.current[item.id] = React.createRef<HTMLDivElement>();
      }
    });
  }, [items]);

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
    <div className="flex-1">
      <div className="relative w-full h-[calc(100vh-2.5rem)] bg-gradient-to-br from-blue-50 to-white border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
        {items.map((item) => (
          <BookmarkItem
            key={item.id}
            id={item.id}
            content={item.content}
            position={item.position}
            isEditing={item.isEditing}
            nodeRef={nodeRefs.current[item.id] || React.createRef()}
            onDrag={handleDrag}
            onDelete={deleteItem}
            onEdit={startEditing}
            onContentChange={handleContentChange}
          />
        ))}
      </div>
    </div>
  );
}