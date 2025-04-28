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
    shadow?: {
      angle: number;
      distance: number;
      blur: number;
      color: string;
      opacity: number;
    };
  }>) => {
    if (selectedBookmark) {
      setItems(items.map(item =>
        item.id === selectedBookmark.id
          ? { ...item, ...config }
          : item
      ));

      // 更新选中的书签状态，以确保 UI 即时更新
      setSelectedBookmark(prev => prev ? { ...prev, ...config } : prev);
    }
  };

  const handleImageUpload = (file: File) => {
    if (selectedBookmark) {
      const url = URL.createObjectURL(file);
      setItems(items.map(item =>
        item.id === selectedBookmark.id
          ? { ...item, imageUrl: url }
          : item
      ));
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
