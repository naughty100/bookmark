'use client';
import React, { RefObject, useCallback } from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import Image from 'next/image';
import 'react-resizable/css/styles.css';

interface BookmarkItemProps {
  id: number;
  content: string;
  position: { x: number; y: number };
  isEditing: boolean;
  size?: { width: number; height: number };
  imageUrl?: string;
  nodeRef: RefObject<HTMLDivElement>;
  onDrag: (id: number, e: any, data: any) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  onContentChange: (id: number, newContent: string) => void;
  onResize: (id: number, size: { width: number; height: number }) => void;
  onImageUpload: (id: number, imageUrl: string) => void;
}

export default function BookmarkItem({
  id,
  content,
  position,
  isEditing,
  size = { width: 200, height: 200 },
  imageUrl,
  nodeRef,
  onDrag,
  onDelete,
  onEdit,
  onContentChange,
  onResize,
  onImageUpload,
}: BookmarkItemProps) {
  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onImageUpload(id, url);
    }
  }, [id, onImageUpload]);

  const handleResize = (e: any, { size: newSize }: { size: { width: number; height: number } }) => {
    onResize(id, newSize);
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      position={position}
      onDrag={(e, data) => onDrag(id, e, data)}
      bounds="parent"
      handle=".handle"
    >
      <div ref={nodeRef}>
        <ResizableBox
          width={size.width}
          height={size.height}
          onResize={handleResize}
          minConstraints={[100, 100]}
          maxConstraints={[500, 500]}
          resizeHandles={['se']}
          className="group"
        >
          <div className="w-full h-full relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg">
            {/* 拖动手柄区域 */}
            <div className="absolute inset-0 handle cursor-move" />

            {/* 上传图片按钮 */}
            <label className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <span className="text-white bg-black/50 px-3 py-2 rounded-lg">点击上传图片</span>
            </label>

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

            {/* 可选的文本内容 */}
            {content && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="p-2 bg-black/50 text-white rounded pointer-events-auto"
                  onDoubleClick={() => onEdit(id)}
                >
                  {isEditing ? (
                    <input
                      type="text"
                      value={content}
                      onChange={(e) => onContentChange(id, e.target.value)}
                      onBlur={() => onContentChange(id, content)}
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

            {/* 调整大小手柄的样式 */}
            <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity z-20">
              <div className="absolute bottom-1 right-1 w-2 h-2 bg-gray-400 rounded-full" />
            </div>
          </div>
        </ResizableBox>
      </div>
    </Draggable>
  );
}