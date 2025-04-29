'use client';
import React from 'react';
import Draggable from 'react-draggable';
import { TextItemProps } from '@/types/bookmark/index.d';

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
  onDrag,
  onZIndexChange
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
      color: style.color || 'inherit',
    };
    return baseStyle;
  };

  return (
    <Draggable
      position={position}
      onDrag={onDrag}
      nodeRef={nodeRef}
    >
      <div
        ref={nodeRef}
        onClick={onClick}
        className={`select-none cursor-move ${selected ? 'outline outline-2 outline-blue-500' : ''}`}
        style={{
          width: size.width,
          height: size.height,
          zIndex: style.zIndex || 0,
          position: 'absolute',
          touchAction: 'none'
        }}
      >
        <div
          className="relative w-full h-full flex items-center justify-center overflow-hidden"
          style={getTextStyle()}
        >
          {text}
          {selected && (
            <>
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
              <div className="absolute top-0 left-0 flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onZIndexChange?.('up');
                  }}
                  className="p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                  title="上移一层"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-gray-500"
                  >
                    <path
                      d="M12 20V4M12 4L6 10M12 4L18 10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onZIndexChange?.('down');
                  }}
                  className="p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                  title="下移一层"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-gray-500"
                  >
                    <path
                      d="M12 4V20M12 20L6 14M12 20L18 14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Draggable>
  );
}