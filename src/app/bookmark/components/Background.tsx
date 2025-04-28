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

interface BackgroundProps {
  items: DraggableItem[];
  setItems: React.Dispatch<React.SetStateAction<DraggableItem[]>>;
  onSelectBookmark: (bookmark: DraggableItem | undefined) => void;
  backgroundConfig?: BackgroundConfig;
}

export default function Background({ 
  items, 
  setItems, 
  onSelectBookmark,
  backgroundConfig 
}: BackgroundProps) {
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

  return (
    <div 
      className="relative bg-white shadow-lg overflow-hidden"
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
    </div>
  );
}