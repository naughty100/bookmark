'use client';
import React, { useState } from 'react';
import AddBookmarkButton from './AddBookmarkButton';
import Image from 'next/image';

interface BookmarkConfig {
  size: { width: number; height: number };
  aspectRatio: string;
  keepAspectRatio: boolean;
}

interface OperationPanelProps {
  onAddBookmark: () => void;
  selectedBookmark?: {
    id: number;
    content: string;
    size: { width: number; height: number };
    imageUrl?: string;
  };
  onBookmarkConfigChange: (config: Partial<BookmarkConfig>) => void;
  onImageUpload: (file: File) => void;
}

const tabs = [
  { id: 'bookmarks', label: '书签' },
  { id: 'settings', label: '设置' }
];

export default function OperationPanel({ 
  onAddBookmark, 
  selectedBookmark,
  onBookmarkConfigChange,
  onImageUpload 
}: OperationPanelProps) {
  const [activeTab, setActiveTab] = useState('bookmarks');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);

  const handleSizeChange = (dimension: 'width' | 'height', value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      if (keepAspectRatio && selectedBookmark) {
        const [ratioWidth, ratioHeight] = aspectRatio.split(':').map(Number);
        if (dimension === 'width') {
          onBookmarkConfigChange({
            size: {
              width: numValue,
              height: Math.round(numValue * (ratioHeight / ratioWidth))
            }
          });
        } else {
          onBookmarkConfigChange({
            size: {
              width: Math.round(numValue * (ratioWidth / ratioHeight)),
              height: numValue
            }
          });
        }
      } else {
        onBookmarkConfigChange({
          size: {
            ...(selectedBookmark?.size || { width: 200, height: 200 }),
            [dimension]: numValue
          }
        });
      }
    }
  };

  const handleAspectRatioChange = (newRatio: string) => {
    setAspectRatio(newRatio);
    if (keepAspectRatio && selectedBookmark) {
      const [ratioWidth, ratioHeight] = newRatio.split(':').map(Number);
      const newWidth = selectedBookmark.size.width;
      onBookmarkConfigChange({
        size: {
          width: newWidth,
          height: Math.round(newWidth * (ratioHeight / ratioWidth))
        }
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div className="w-80 bg-gray-50 p-4 border-l border-gray-200 flex flex-col h-screen">
      {/* Tabs */}
      <div className="flex mb-4 border-b border-gray-200">
        {tabs.map(tab => (
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
        <div className="flex flex-col gap-4">
          <AddBookmarkButton onClick={onAddBookmark} />
          
          {/* Bookmark Configuration */}
          {selectedBookmark ? (
            <div className="mt-4 space-y-4">
              <h3 className="font-medium text-gray-900">书签配置</h3>
              
              {/* Size Controls */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">尺寸</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500">宽度</label>
                    <input
                      type="number"
                      min="100"
                      max="500"
                      value={selectedBookmark.size.width}
                      onChange={(e) => handleSizeChange('width', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">高度</label>
                    <input
                      type="number"
                      min="100"
                      max="500"
                      value={selectedBookmark.size.height}
                      onChange={(e) => handleSizeChange('height', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Aspect Ratio */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">长宽比</label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={keepAspectRatio}
                      onChange={(e) => setKeepAspectRatio(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-500">锁定比例</span>
                  </label>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['1:1', '4:3', '16:9'].map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => handleAspectRatioChange(ratio)}
                      className={`px-3 py-1 text-sm rounded-md ${
                        aspectRatio === ratio
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">背景图片</label>
                <div className="mt-1 flex items-center space-x-2">
                  <label className="flex-1">
                    <div className="px-4 py-2 bg-white border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 text-center text-sm text-gray-700">
                      选择图片
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </label>
                  {selectedBookmark.imageUrl && (
                    <div className="relative w-10 h-10 border rounded overflow-hidden">
                      <Image
                        src={selectedBookmark.imageUrl}
                        alt="预览"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-4">选择一个书签来配置</p>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="p-4">
          <p className="text-sm text-gray-500">设置面板内容</p>
        </div>
      )}
    </div>
  );
}