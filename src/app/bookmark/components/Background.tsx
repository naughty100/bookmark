'use client';
import React, { useRef, RefObject } from 'react';
import BookmarkItem from './BookmarkItem';

interface DraggableItem {
  id: number;
  content: string;
  position: { x: number; y: number };
  isEditing: boolean;
  size: { width: number; height: number };
  imageUrl?: string;
  selected?: boolean;
}

interface BackgroundProps {
  items: DraggableItem[];
  setItems: React.Dispatch<React.SetStateAction<DraggableItem[]>>;
  onSelectBookmark: (bookmark: DraggableItem | undefined) => void;
}

export default function Background({ items, setItems, onSelectBookmark }: BackgroundProps) {
  const nodeRefs = useRef<{ [key: number]: RefObject<HTMLDivElement> }>({});

  const handleDrag = (id: number, e: any, data: any) => {
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, position: { x: data.x, y: data.y } }
        : item
    ));
  };

  const deleteItem = (id: number) => {
    setItems(prevItems => {
      const itemToDelete = prevItems.find(item => item.id === id);
      if (itemToDelete?.selected) {
        onSelectBookmark(undefined);
      }
      return prevItems.filter(item => item.id !== id);
    });
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

  const handleSelect = (id: number) => {
    const newItems = items.map(item => ({
      ...item,
      selected: item.id === id
    }));
    setItems(newItems);
    const selectedItem = newItems.find(item => item.id === id);
    onSelectBookmark(selectedItem);
  };

  return (
    <div className="flex-1">
      <div 
        className="relative w-full h-[calc(100vh-2.5rem)] bg-gradient-to-br from-blue-50 to-white border-2 border-dashed border-gray-300 rounded-lg overflow-hidden"
        onClick={() => onSelectBookmark(undefined)}
      >
        {items.map((item) => (
          <BookmarkItem
            key={item.id}
            id={item.id}
            content={item.content}
            position={item.position}
            size={item.size}
            isEditing={item.isEditing}
            selected={item.selected}
            imageUrl={item.imageUrl}
            nodeRef={nodeRefs.current[item.id] || (nodeRefs.current[item.id] = React.createRef())}
            onDrag={handleDrag}
            onDelete={deleteItem}
            onEdit={startEditing}
            onContentChange={handleContentChange}
            onSelect={(e) => {
              e.stopPropagation();
              handleSelect(item.id);
            }}
          />
        ))}
      </div>
    </div>
  );
}