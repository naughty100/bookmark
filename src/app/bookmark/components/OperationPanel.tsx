'use client';
import React, { useState } from 'react';
import AddBookmarkButton from './AddBookmarkButton';
import BookmarkOp from './Operation/bookmarkOp';
import Settings from './Operation/settings';

interface ShadowConfig {
  angle: number;
  distance: number;
  blur: number;
  color: string;
  opacity: number;
}

interface BookmarkConfig {
  size: { width: number; height: number };
  position?: { x: number; y: number };
  shadow?: ShadowConfig;
}

interface OperationPanelProps {
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
}

export default function OperationPanel({ 
  onAddBookmark, 
  selectedBookmark,
  onBookmarkConfigChange,
  onImageUpload 
}: OperationPanelProps) {
  const [activeTab, setActiveTab] = useState('bookmarks');

  return (
    <div className="w-80 bg-gray-50 p-4 border-l border-gray-200 flex flex-col h-screen">
      {/* Tabs */}
      <div className="flex mb-4 border-b border-gray-200">
        {[
          { id: 'bookmarks', label: '书签' },
          { id: 'settings', label: '设置' }
        ].map(tab => (
          <button
            key={tab.id}
            className={`px-4 py-2 -mb-px ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'bookmarks' && (
        <div className="flex flex-col gap-4 overflow-y-auto">
          <AddBookmarkButton onClick={onAddBookmark} />
          
          {selectedBookmark ? (
            <div className="mt-4 space-y-4">
              <h3 className="font-medium text-gray-900">书签配置</h3>
              <BookmarkOp 
                selectedBookmark={selectedBookmark}
                onBookmarkConfigChange={onBookmarkConfigChange}
                onImageUpload={onImageUpload}
              />
            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-4">选择一个书签来配置</p>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="p-4">
          <Settings />
        </div>
      )}
    </div>
  );
}