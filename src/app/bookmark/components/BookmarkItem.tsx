'use client';
import React, { RefObject } from 'react';
import Draggable from 'react-draggable';

interface BookmarkItemProps {
  id: number;
  content: string;
  position: { x: number; y: number };
  isEditing: boolean;
  nodeRef: RefObject<HTMLDivElement>;
  onDrag: (id: number, e: any, data: any) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  onContentChange: (id: number, newContent: string) => void;
}

export default function BookmarkItem({
  id,
  content,
  position,
  isEditing,
  nodeRef,
  onDrag,
  onDelete,
  onEdit,
  onContentChange,
}: BookmarkItemProps) {
  return (
    <Draggable
      position={position}
      onDrag={(e, data) => onDrag(id, e, data)}
      bounds="parent"
      nodeRef={nodeRef}
    >
      <div 
        ref={nodeRef}
        className="group p-4 bg-white border border-gray-200 rounded-lg cursor-move select-none shadow-lg min-w-[150px] relative hover:scale-102"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-red-500 hover:text-red-600"
        >
          ×
        </button>
        {isEditing ? (
          <input
            type="text"
            value={content}
            onChange={(e) => onContentChange(id, e.target.value)}
            onBlur={() => onContentChange(id, content)}
            className="w-full bg-transparent border-none outline-none text-center"
            autoFocus
          />
        ) : (
          <div 
            onDoubleClick={() => onEdit(id)}
            className="text-center break-words"
          >
            {content}
          </div>
        )}
      </div>
    </Draggable>
  );
}