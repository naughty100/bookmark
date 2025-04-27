'use client';
import React from 'react';
import AddBookmarkButton from './AddBookmarkButton';

interface OperationPanelProps {
  onAddBookmark: () => void;
}

export default function OperationPanel({ onAddBookmark }: OperationPanelProps) {
  return (
    <div className="w-64 bg-gray-50 p-4 border-l border-gray-200 flex flex-col">
      <h2 className="text-lg font-semibold mb-4">操作面板</h2>
      <div className="flex flex-col gap-3">
        <AddBookmarkButton onClick={onAddBookmark} />
        {/* 这里可以添加更多操作按钮 */}
      </div>
    </div>
  );
}