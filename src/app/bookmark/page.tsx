'use client';
import { useState } from 'react';
import Background from './components/Background';
import OperationPanel from './components/OperationPanel';

interface DraggableItem {
  id: number;
  content: string;
  position: { x: number; y: number };
  isEditing: boolean;
  size: { width: number; height: number };
  imageUrl?: string;
  selected?: boolean;
  shadow?: {
    angle: number;
    distance: number;
    blur: number;
    color: string;
    opacity: number;
  };
}

export default function Home() {
  const [items, setItems] = useState<DraggableItem[]>([]);
  const [nextId, setNextId] = useState(1);
  const [selectedBookmark, setSelectedBookmark] = useState<DraggableItem>();

  const addNewItem = () => {
    const newItem: DraggableItem = {
      id: nextId,
      content: '',
      position: { x: Math.random() * 500, y: Math.random() * 300 },
      isEditing: false,
      size: { width: 200, height: 600 },
      shadow: {
        angle: 46,
        distance: 10,
        blur: 17,
        color: '#333333',
        opacity: 0.47
      }
    };
    setItems([...items, newItem]);
    setNextId(nextId + 1);
  };

  const handleBookmarkConfigChange = (config: Partial<{
    size: { width: number; height: number };
    position: { x: number; y: number };
    shadow?: {
      angle: number;
      distance: number;
      blur: number;
      color: string;
      opacity: number;
    };
  }>) => {
    if (selectedBookmark) {
      const newItems = items.map(item =>
        item.id === selectedBookmark.id
          ? {
              ...item,
              ...(config.size && { size: config.size }),
              ...(config.position && { position: config.position }),
              ...(config.shadow && { shadow: config.shadow })
            }
          : item
      );

      setItems(newItems);
      setSelectedBookmark(newItems.find(item => item.id === selectedBookmark.id));
    }
  };

  const handleImageUpload = (file: File) => {
    if (selectedBookmark) {
      const url = URL.createObjectURL(file);
      const newItems = items.map(item =>
        item.id === selectedBookmark.id
          ? { ...item, imageUrl: url }
          : item
      );

      setItems(newItems);
      setSelectedBookmark(newItems.find(item => item.id === selectedBookmark.id));
    }
  };
  
  return (
    <main className="min-h-screen flex">
      {/* 背景板 */}
      <Background 
        items={items} 
        setItems={setItems} 
        onSelectBookmark={setSelectedBookmark}
      />
      
      {/* 颜色面板 */}
      {/* todo */}

      {/* 操作面板 */}
      <OperationPanel 
        onAddBookmark={addNewItem} 
        selectedBookmark={selectedBookmark}
        onBookmarkConfigChange={handleBookmarkConfigChange}
        onImageUpload={handleImageUpload}
      />
    </main>
  );
}
