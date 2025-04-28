'use client';
import React, { useRef } from 'react';
import BookmarkItem from './BookmarkItem';
import TextItem from './TextItem';

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
    zIndex?: number;
    color: string;
  };
}

interface BackgroundProps {
  items: DraggableItem[];
  setItems: React.Dispatch<React.SetStateAction<DraggableItem[]>>;
  onSelectBookmark: (bookmark: DraggableItem | undefined) => void;
  backgroundConfig?: BackgroundConfig;
  texts: TextConfig[];
  onTextConfigChange: (id: number, config: Partial<TextConfig>) => void;
  onTextDelete: (id: number) => void;
  onTextSelect: (id: number | null) => void;
  selectedTextId: number | null;
}

export default function Background({
  items,
  setItems,
  onSelectBookmark,
  backgroundConfig,
  texts,
  onTextConfigChange,
  onTextDelete,
  onTextSelect,
  selectedTextId
}: BackgroundProps) {
  const nodeRefs = useRef<{ [key: number]: React.RefObject<HTMLDivElement> }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<{ [key: number]: React.RefObject<HTMLDivElement> }>({});

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

  const handleSelect = (id: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    const newItems = items.map(item => ({
      ...item,
      selected: item.id === id
    }));
    setItems(newItems);
    const selectedItem = newItems.find(item => item.id === id);
    onSelectBookmark(selectedItem);
  };

  const handleResize = (id: number, newSize: { width: number; height: number }) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, size: newSize } : item
    ));
  };

  const getBackgroundStyle = () => {
    if (!backgroundConfig) {
      return 'bg-gradient-to-br from-blue-50 to-white';
    }

    const { colorType, solidColor, gradientColors, gradientAngle } = backgroundConfig;

    if (colorType === 'solid') {
      return solidColor;
    }

    const sortedColors = [...gradientColors].sort((a, b) => a.position - b.position);
    const colorStops = sortedColors.map(gc => `${gc.color} ${gc.position}%`).join(', ');

    if (colorType === 'linear-gradient') {
      return `linear-gradient(${gradientAngle}deg, ${colorStops})`;
    } else if (colorType === 'radial-gradient') {
      return `radial-gradient(circle at center, ${colorStops})`;
    }

    return 'bg-gradient-to-br from-blue-50 to-white';
  };

  const handleTextDrag = (id: number, e: any, data: any) => {
    if (!containerRef.current) return;
    onTextConfigChange(id, {
      position: {
        x: data.x,
        y: data.y
      }
    });
  };

  const handleTextClick = (id: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    onTextSelect(id);
  };

  const handleBackgroundClick = () => {
    onTextSelect(null);
  };

  const handleTextZIndexChange = (id: number, type: 'up' | 'down') => {
    const currentText = texts.find(t => t.id === id);
    if (!currentText) return;

    const currentZIndex = currentText.style.zIndex || 0;
    const newZIndex = type === 'up' ? currentZIndex + 1 : Math.max(0, currentZIndex - 1);

    onTextConfigChange(id, {
      style: {
        ...currentText.style,
        zIndex: newZIndex
      }
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative bg-white shadow-lg overflow-hidden"
      onClick={handleBackgroundClick}
      style={{
        width: backgroundConfig?.size.width || '100%',
        height: backgroundConfig?.size.height || '100%',
        background: getBackgroundStyle(),
        minWidth: '300px',
        minHeight: '200px',
        margin: '0 auto'
      }}
    >
      {items.map((item) => {
        if (!nodeRefs.current[item.id]) {
          nodeRefs.current[item.id] = React.createRef();
        }

        return (
          <BookmarkItem
            key={item.id}
            id={item.id}
            content={item.content}
            position={item.position}
            size={item.size}
            isEditing={item.isEditing}
            selected={item.selected}
            imageUrl={item.imageUrl}
            shadow={item.shadow}
            nodeRef={nodeRefs.current[item.id]}
            onDrag={handleDrag}
            onDelete={deleteItem}
            onEdit={startEditing}
            onContentChange={handleContentChange}
            onSelect={handleSelect(item.id)}
            onResize={handleResize}
          />
        );
      })}
      {texts.map(text => {
        if (!textRefs.current[text.id]) {
          textRefs.current[text.id] = React.createRef();
        }

        return (
          <TextItem
            key={text.id}
            id={text.id}
            text={text.text}
            position={text.position}
            size={text.size}
            style={text.style}
            selected={selectedTextId === text.id}
            nodeRef={textRefs.current[text.id]}
            onDrag={(e, data) => handleTextDrag(text.id, e, data)}
            onDelete={() => onTextDelete(text.id)}
            onClick={handleTextClick(text.id)}
            onZIndexChange={(type) => handleTextZIndexChange(text.id, type)}
          />
        );
      })}
    </div>
  );
}