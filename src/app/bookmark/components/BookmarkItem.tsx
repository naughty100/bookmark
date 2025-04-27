'use client';
import React, { RefObject } from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import Image from 'next/image';
import 'react-resizable/css/styles.css';

interface BookmarkItemProps {
  id: number;
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isEditing: boolean;
  selected?: boolean;
  imageUrl?: string;
  nodeRef: RefObject<HTMLDivElement>;
  onDrag: (id: number, e: any, data: any) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  onContentChange: (id: number, newContent: string) => void;
  onSelect: (e: React.MouseEvent) => void;
  onResize?: (id: number, size: { width: number; height: number }) => void;
}

export default function BookmarkItem({
  id,
  content,
  position,
  size,
  isEditing,
  selected,
  imageUrl,
  nodeRef,
  onDrag,
  onDelete,
  onEdit,
  onContentChange,
  onSelect,
  onResize,
}: BookmarkItemProps) {

  const handleResize = (e: React.SyntheticEvent, { size: newSize }: { size: { width: number; height: number } }) => {
    onResize?.(id, newSize);
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      position={position}
      onDrag={(e, data) => onDrag(id, e, data)}
      bounds="parent"
    >
      <div ref={nodeRef} className="absolute">
        <ResizableBox
          width={size.width}
          height={size.height}
          onResize={handleResize}
          minConstraints={[100, 100]}
          maxConstraints={[500, 500]}
          resizeHandles={['se']}
          handle={<div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-30">
            <div className="absolute bottom-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
          </div>}
        >
          <div
            onClick={onSelect}
            className={`group w-full h-full bg-white border rounded-lg cursor-move select-none shadow-lg overflow-hidden
              ${selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`}
          >
            {/* 背景图片 */}
            {imageUrl && (
              <div className="absolute inset-0">
                <Image
                  src={imageUrl}
                  alt="Background"
                  fill
                  className="object-cover"
                  sizes="(max-width: 500px) 100vw, 500px"
                />
              </div>
            )}

            {/* 删除按钮 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
              className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white bg-red-500 hover:bg-red-600 rounded-full z-20"
            >
              ×
            </button>

            {/* 编辑区域 */}
            {content && (
              <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${imageUrl ? 'text-white' : 'text-gray-800'}`}>
                <div
                  className="p-2 bg-black/30 rounded pointer-events-auto"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    onEdit(id);
                  }}
                >
                  {isEditing ? (
                    <input
                      type="text"
                      value={content}
                      onChange={(e) => onContentChange(id, e.target.value)}
                      onBlur={() => onContentChange(id, content)}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-transparent border-none outline-none text-center text-white w-full"
                      autoFocus
                    />
                  ) : (
                    <span className="text-center break-words">
                      {content}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </ResizableBox>
      </div>
    </Draggable>
  );
}