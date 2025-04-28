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

interface BackgroundConfig {
  size: { width: number; height: number };
  keepAspectRatio: boolean;
  aspectRatio: string;
  customRatio: { width: number; height: number };
  colorType: 'solid' | 'linear-gradient' | 'radial-gradient';
  solidColor: string;
  gradientColors: { color: string; position: number }[];
  gradientAngle: number;
}

interface TextConfig {
  id: number;
  text: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: {
    fontSize: number;
    fontFamily: string;
    rotate: number;
    direction: 'horizontal' | 'vertical';
  };
}

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
      content: '新书签',
      position: { x: 100, y: 100 },
      size: { width: 100, height: 100 },
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
      text: '文本',
      position: { x: 50, y: 50 },
      size: { width: 300, height: 100 },
      style: {
        fontSize: 24,
        fontFamily: 'inherit',
        rotate: 0,
        direction: 'horizontal'
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
    <main className="flex min-h-screen">
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
      />
    </main>
  );
}
