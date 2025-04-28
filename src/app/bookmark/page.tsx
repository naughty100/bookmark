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
  const [backgroundConfig, setBackgroundConfig] = useState<{
    size: { width: number; height: number };
    keepAspectRatio: boolean;
    aspectRatio: string;
    customRatio: { width: number; height: number };
    colorType: 'solid' | 'linear-gradient' | 'radial-gradient';
    solidColor: string;
    gradientColors: { color: string; position: number }[];
    gradientAngle: number;
  }>({
    size: { width: 600, height: 800 }, // 设置默认尺寸为 3:4 比例
    keepAspectRatio: true,
    aspectRatio: '3:4',
    customRatio: { width: 3, height: 4 },
    colorType: 'solid',
    solidColor: '#ffffff',
    gradientColors: [
      { color: '#ffffff', position: 0 },
      { color: '#e0e0e0', position: 100 }
    ],
    gradientAngle: 45
  });

  const addNewItem = () => {
    const newItem: DraggableItem = {
      id: nextId,
      content: '',
      position: { 
        x: (backgroundConfig.size.width - 200) / 2, 
        y: (backgroundConfig.size.height - 150) / 2 
      },
      isEditing: false,
      size: { width: 150, height: 450 },
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
    <main className="h-screen overflow-hidden flex">
      {/* 背景板 */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="min-h-[600px] flex items-center justify-center">
          <Background 
            items={items} 
            setItems={setItems} 
            onSelectBookmark={setSelectedBookmark}
            backgroundConfig={backgroundConfig}
          />
        </div>
      </div>
      
      {/* 操作面板 */}
      <OperationPanel 
        onAddBookmark={addNewItem} 
        selectedBookmark={selectedBookmark}
        onBookmarkConfigChange={handleBookmarkConfigChange}
        onImageUpload={handleImageUpload}
        backgroundConfig={backgroundConfig}
        onBackgroundConfigChange={setBackgroundConfig}
      />
    </main>
  );
}
