import React, { RefObject } from 'react';
import { DraggableData, DraggableEvent } from 'react-draggable';

// 可拖拽的元素类型
export interface DraggableItem {
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

  // 背景【 background 】配置类型
  export interface BackgroundConfig {
    size: { width: number; height: number };
    keepAspectRatio: boolean;
    aspectRatio: string;
    customRatio: { width: number; height: number };
    colorType: 'solid' | 'linear-gradient' | 'radial-gradient';
    solidColor: string;
    gradientColors: { color: string; position: number }[];
    gradientAngle: number;
  }

  // 文本【 text 】配置类型
  export interface TextConfig {
    id: number;
    text: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    style: {
      fontSize: number;
      fontFamily: string;
      rotate: number;
      direction: 'horizontal' | 'vertical';
      color: string;
      zIndex?: number;
    };
  }

  // 文本框属性配置类型
  export interface TextItemProps {
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
      color?: string;
    };
    selected?: boolean;
    nodeRef: React.RefObject<HTMLDivElement>;
    onDelete: () => void;
    onClick: (e: React.MouseEvent) => void;
    onDrag?: (e: DraggableEvent, data: DraggableData) => void;
    onZIndexChange?: (type: 'up' | 'down') => void;
  }

  // 阴影配置类型
  export interface ShadowConfig {
    angle: number;
    distance: number;
    blur: number;
    color: string;
    opacity: number;
  }
  
  // 书签配置类型
  export interface BookmarkConfig {
    size: { width: number; height: number };
    position?: { x: number; y: number };
    shadow?: ShadowConfig;
  }
  
  // 操作面板属性配置类型
  export interface OperationPanelProps {
    onAddBookmark: () => void;
    selectedBookmark?: {
      id: number;
      content: string;
      size: { width: number; height: number };
      position: { x: number; y: number };
      imageUrl?: string;
      shadow?: ShadowConfig;
    };
    onBookmarkConfigChange: (config: Partial<BookmarkConfig>) => void;
    onImageUpload: (file: File) => void;
    onBackgroundConfigChange: (config: BackgroundConfig) => void;
    onTextConfigChange: (config: Partial<TextConfig>) => void;
    onAddText: () => void;
    backgroundConfig: BackgroundConfig;
    selectedText?: TextConfig;
    items: DraggableItem[];
    texts: TextConfig[];
    onExport?: () => void;
  }

  // 图片裁剪面板属性配置类型
  export interface ImageCropModalProps {
    imageUrl: string;
    aspectRatio?: number;
    onCancel: () => void;
    onCrop: (croppedImage: string) => void;
  }

  // 颜色选择面板属性配置类型
  export interface ColorPanelProps {
    onColorSelect: (color: string) => void;
    selectedColor?: string;
  }

  export interface BookmarkItemProps {
    id: number;
    content: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    isEditing: boolean;
    selected?: boolean;
    imageUrl?: string;
    shadow?: ShadowConfig;
    nodeRef: RefObject<HTMLDivElement>;
    onDrag: (id: number, e: DraggableEvent, data: DraggableData) => void;
    onDelete: (id: number) => void;
    onEdit: (id: number) => void;
    onContentChange: (id: number, newContent: string) => void;
    onSelect: (e: React.MouseEvent) => void;
    onResize?: (id: number, size: { width: number; height: number }) => void;
  }

  // 背景属性类型
  export interface BackgroundProps {
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

  // 添加书签按钮属性
  export interface AddBookmarkButtonProps {
    onClick: () => void;
  }