'use client';
import React from 'react';

interface TextItemProps {
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
  selected?: boolean;
  nodeRef: React.RefObject<HTMLDivElement>;
  onDelete: () => void;
  onClick: (e: React.MouseEvent) => void;
}

export default function TextItem({
  id,
  text,
  position,
  size,
  style,
  selected = false,
  nodeRef,
  onDelete,
  onClick,
}: TextItemProps) {
  const getTextStyle = () => {
    const baseStyle = {
      fontSize: `${style.fontSize}px`,
      fontFamily: style.fontFamily,
      transform: `rotate(${style.rotate}deg)`,
      width: style.direction === 'vertical' ? 'fit-content' : '100%',
      height: style.direction === 'vertical' ? '100%' : 'fit-content',
      writingMode: style.direction === 'vertical' ? 'vertical-rl' : 'horizontal-tb' as any,
      textOrientation: style.direction === 'vertical' ? 'upright' : 'mixed' as any,
    };
    return baseStyle;
  };

  return (
    <div
      ref={nodeRef}
      onClick={onClick}
      className={`absolute select-none ${selected ? 'outline outline-2 outline-blue-500' : ''}`}
      style={{
        width: size.width,
        height: size.height,
        left: position.x,
        top: position.y
      }}
    >
      <div
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
        style={getTextStyle()}
      >
        {text}
        {selected && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="absolute top-0 right-0 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
            title="删除"
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 16 16" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-500"
            >
              <path 
                d="M4 4L12 12M12 4L4 12" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}