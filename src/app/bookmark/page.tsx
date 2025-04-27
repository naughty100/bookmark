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
      size: { width: 200, height: 600 } // 设置为 1:3 比例
    };
    setItems([...items, newItem]);
    setNextId(nextId + 1);
  };

  const handleBookmarkConfigChange = (config: Partial<{ size: { width: number; height: number } }>) => {
    if (selectedBookmark) {
      setItems(items.map(item =>
        item.id === selectedBookmark.id
          ? { ...item, ...config }
          : item
      ));
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
      <Background 
        items={items} 
        setItems={setItems} 
        onSelectBookmark={setSelectedBookmark}
      />
      <OperationPanel 
        onAddBookmark={addNewItem} 
        selectedBookmark={selectedBookmark}
        onBookmarkConfigChange={handleBookmarkConfigChange}
        onImageUpload={handleImageUpload}
      />
    </main>
  );
}
