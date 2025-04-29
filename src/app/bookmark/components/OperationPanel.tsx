'use client';
import React, { useState } from 'react';
import AddBookmarkButton from './AddBookmarkButton';
import BookmarkOp from './Operation/bookmarkOp';
import Settings from './Operation/settings';
import BackgroundOp from './Operation/backgroundOp';
import TextOp from './Operation/textOp';
import { OperationPanelProps } from '@/types/bookmark/index.d';

export default function OperationPanel({ 
  onAddBookmark, 
  selectedBookmark,
  onBookmarkConfigChange,
  onImageUpload,
  onBackgroundConfigChange,
  onTextConfigChange,
  onAddText,
  backgroundConfig,
  selectedText
}: OperationPanelProps) {
  const [activeTab, setActiveTab] = useState('bookmarks');

  const tabs = [
    { id: 'bookmarks', label: '书签' },
    { id: 'background', label: '背景' },
    { id: 'text', label: '文本' },
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

      {activeTab === 'text' && (
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 flex flex-col gap-4">
            <button
              onClick={onAddText}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              新增文本
            </button>
            {selectedText ? (
              <TextOp 
                config={selectedText}
                onConfigChange={onTextConfigChange}
              />
            ) : (
              <p className="text-sm text-gray-500 text-center mt-4">
                请选择或新增一个文本
              </p>
            )}
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