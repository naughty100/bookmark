'use client';
import React, { useState } from 'react';
import AddBookmarkButton from './AddBookmarkButton';
import BookmarkOp from './Operation/bookmarkOp';
import Settings from './Operation/settings';
import BackgroundOp from './Operation/backgroundOp';

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
  onBackgroundConfigChange: (config: BackgroundConfig) => void;
  backgroundConfig: BackgroundConfig;
}

export default function OperationPanel({ 
  onAddBookmark, 
  selectedBookmark,
  onBookmarkConfigChange,
  onImageUpload,
  onBackgroundConfigChange,
  backgroundConfig
}: OperationPanelProps) {
  const [activeTab, setActiveTab] = useState('bookmarks');

  const tabs = [
    { id: 'bookmarks', label: '书签' },
    { id: 'background', label: '背景' },
    { id: 'settings', label: '设置' }
  ];

  return (
    <div className="w-80 h-screen bg-white border-l border-gray-200 flex flex-col">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'bookmarks' && (
        <div className="p-4 flex flex-col gap-4 flex-1 overflow-y-auto">
          <AddBookmarkButton onClick={onAddBookmark} />
          {selectedBookmark && (
            <BookmarkOp 
              selectedBookmark={selectedBookmark}
              onBookmarkConfigChange={onBookmarkConfigChange}
              onImageUpload={onImageUpload}
            />
          )}
        </div>
      )}

      {activeTab === 'background' && (
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <BackgroundOp 
              config={backgroundConfig}
              onConfigChange={onBackgroundConfigChange}
            />
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <Settings />
          </div>
        </div>
      )}
    </div>
  );
}