'use client';
import { useState } from 'react';
import Background from './components/Background';
import OperationPanel from './components/OperationPanel';
import { DraggableItem , BackgroundConfig , TextConfig } from '@/types/bookmark/index.d';

export default function Home() {
  const [items, setItems] = useState<DraggableItem[]>([]);
  const [selectedBookmark, setSelectedBookmark] = useState<DraggableItem>();
  const [selectedTextId, setSelectedTextId] = useState<number | null>(null);
  const [backgroundConfig, setBackgroundConfig] = useState<BackgroundConfig>({
    size: { width: 600, height: 800 },
    keepAspectRatio: true,
    aspectRatio: '3:4',
    customRatio: { width: 16, height: 9 },
    colorType: 'linear-gradient',
    solidColor: '#ffffff',
    gradientColors: [
      { color: '#e0f2fe', position: 0 },
      { color: '#ffffff', position: 100 }
    ],
    gradientAngle: 45
  });

  const [texts, setTexts] = useState<TextConfig[]>([]);

  const handleAddBookmark = () => {
    const newBookmark: DraggableItem = {
      id: Date.now(),
      content: '',
      position: { x: 150, y: 150 },
      size: { width: 150, height: 450 },
      isEditing: false,
      selected: false
    };
    setItems(prevItems => [...prevItems, newBookmark]);
  };

  const handleBookmarkConfigChange = (config: Partial<DraggableItem>) => {
    if (!selectedBookmark) return;

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === selectedBookmark.id
          ? { ...item, ...config }
          : item
      )
    );
  };

  const handleImageUpload = async (file: File) => {
    if (!selectedBookmark) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      handleBookmarkConfigChange({
        imageUrl: reader.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  const handleAddText = () => {
    const newText: TextConfig = {
      id: Date.now(),
      text: '新文本',
      position: { x: 100, y: 100 },
      size: { width: 50, height: 180 },
      style: {
        fontSize: 25,
        fontFamily: 'ChillCalligraphy_ChenFeng',
        rotate: 0,
        direction: 'vertical',
        color: '#333333'
      }
    };
    setTexts(prev => [...prev, newText]);
    setSelectedTextId(newText.id);
  };

  const handleTextConfigChange = (id: number, config: Partial<TextConfig>) => {
    setTexts(prev => prev.map(text =>
      text.id === id ? { ...text, ...config } : text
    ));
  };

  const handleDeleteText = (id: number) => {
    setTexts(prev => prev.filter(text => text.id !== id));
    if (selectedTextId === id) {
      setSelectedTextId(null);
    }
  };

  return (
    <main className="flex min-h-screen bg-gray-100">
      <div className="flex-1 p-8 overflow-auto">
        <Background
          items={items}
          setItems={setItems}
          onSelectBookmark={setSelectedBookmark}
          backgroundConfig={backgroundConfig}
          texts={texts}
          onTextConfigChange={handleTextConfigChange}
          onTextDelete={handleDeleteText}
          onTextSelect={setSelectedTextId}
          selectedTextId={selectedTextId}
        />
      </div>
      <OperationPanel
        onAddBookmark={handleAddBookmark}
        selectedBookmark={selectedBookmark}
        onBookmarkConfigChange={handleBookmarkConfigChange}
        onImageUpload={handleImageUpload}
        onBackgroundConfigChange={setBackgroundConfig}
        onTextConfigChange={(config) => {
          if (selectedTextId) {
            handleTextConfigChange(selectedTextId, config);
          }
        }}
        onAddText={handleAddText}
        backgroundConfig={backgroundConfig}
        selectedText={texts.find(t => t.id === selectedTextId)}
        items={items}
        texts={texts}
      />
    </main>
  );
}
