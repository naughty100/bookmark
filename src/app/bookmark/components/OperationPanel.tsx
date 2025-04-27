'use client';
import React, { useState, useEffect, useCallback } from 'react';
import AddBookmarkButton from './AddBookmarkButton';
import Image from 'next/image';

interface ShadowConfig {
  angle: number;
  distance: number;
  blur: number;
  color: string;
  opacity: number;
}

interface BookmarkConfig {
  size: { width: number; height: number };
  aspectRatio: string;
  keepAspectRatio: boolean;
  shadow?: ShadowConfig;
}

interface OperationPanelProps {
  onAddBookmark: () => void;
  selectedBookmark?: {
    id: number;
    content: string;
    size: { width: number; height: number };
    imageUrl?: string;
    shadow?: ShadowConfig;
  };
  onBookmarkConfigChange: (config: Partial<BookmarkConfig>) => void;
  onImageUpload: (file: File) => void;
}

const predefinedRatios = [
  { label: '1:3', value: '1:3' },
  { label: '1:1', value: '1:1' },
  { label: '4:3', value: '4:3' },
  { label: '16:9', value: '16:9' },
  { label: '自定义', value: 'custom' }
];

export default function OperationPanel({ 
  onAddBookmark, 
  selectedBookmark,
  onBookmarkConfigChange,
  onImageUpload 
}: OperationPanelProps) {
  const [activeTab, setActiveTab] = useState('bookmarks');
  const [aspectRatio, setAspectRatio] = useState('1:3');
  const [customRatio, setCustomRatio] = useState({ width: 1, height: 3 });
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [shadow, setShadow] = useState<ShadowConfig>({
    angle: 135,
    distance: 5,
    blur: 10,
    color: '#000000',
    opacity: 0.2
  });

  useEffect(() => {
    if (selectedBookmark?.shadow) {
      setShadow(selectedBookmark.shadow);
    }
  }, [selectedBookmark?.shadow]);

  const handleSizeChange = (dimension: 'width' | 'height', value: number) => {
    if (value > 0) {
      if (keepAspectRatio && selectedBookmark) {
        let ratioWidth, ratioHeight;
        if (aspectRatio === 'custom') {
          ratioWidth = customRatio.width;
          ratioHeight = customRatio.height;
        } else {
          [ratioWidth, ratioHeight] = aspectRatio.split(':').map(Number);
        }

        if (dimension === 'width') {
          onBookmarkConfigChange({
            size: {
              width: value,
              height: Math.round(value * (ratioHeight / ratioWidth))
            }
          });
        } else {
          onBookmarkConfigChange({
            size: {
              width: Math.round(value * (ratioWidth / ratioHeight)),
              height: value
            }
          });
        }
      } else {
        onBookmarkConfigChange({
          size: {
            ...(selectedBookmark?.size || { width: 200, height: 200 }),
            [dimension]: value
          }
        });
      }
    }
  };

  const handleAspectRatioChange = (newRatio: string) => {
    setAspectRatio(newRatio);
    if (keepAspectRatio && selectedBookmark) {
      let ratioWidth, ratioHeight;
      if (newRatio === 'custom') {
        ratioWidth = customRatio.width;
        ratioHeight = customRatio.height;
      } else {
        [ratioWidth, ratioHeight] = newRatio.split(':').map(Number);
      }

      const newWidth = selectedBookmark.size.width;
      onBookmarkConfigChange({
        size: {
          width: newWidth,
          height: Math.round(newWidth * (ratioHeight / ratioWidth))
        }
      });
    }
  };

  const handleCustomRatioChange = (dimension: 'width' | 'height', value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      setCustomRatio(prev => {
        const newRatio = { ...prev, [dimension]: numValue };
        if (keepAspectRatio && selectedBookmark) {
          const newWidth = selectedBookmark.size.width;
          onBookmarkConfigChange({
            size: {
              width: newWidth,
              height: Math.round(newWidth * (newRatio.height / newRatio.width))
            }
          });
        }
        return newRatio;
      });
    }
  };

  const handleShadowChange = useCallback((key: keyof ShadowConfig, value: number | string) => {
    const newShadow = { ...shadow, [key]: value };
    setShadow(newShadow);
    onBookmarkConfigChange({ shadow: newShadow });
  }, [shadow, onBookmarkConfigChange]);

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
          
          {/* Bookmark Configuration */}
          {selectedBookmark ? (
            <div className="mt-4 space-y-4">
              <h3 className="font-medium text-gray-900">书签配置</h3>
              
              {/* Size Controls */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">尺寸</label>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-xs text-gray-500">宽度: {selectedBookmark.size.width}px</label>
                      <input
                        type="number"
                        min="100"
                        max="500"
                        value={selectedBookmark.size.width}
                        onChange={(e) => handleSizeChange('width', parseInt(e.target.value))}
                        className="w-16 text-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="relative mt-2">
                      <div className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 bg-gray-200 rounded"></div>
                      <div 
                        className="absolute top-1/2 left-0 h-0.5 -translate-y-1/2 bg-blue-600 rounded" 
                        style={{ width: `${((selectedBookmark.size.width - 100) / 400) * 100}%` }}
                      ></div>
                      <input
                        type="range"
                        min="100"
                        max="500"
                        value={selectedBookmark.size.width}
                        onChange={(e) => handleSizeChange('width', parseInt(e.target.value))}
                        className="relative w-full h-2 appearance-none bg-transparent cursor-pointer
                          [&::-webkit-slider-thumb]:appearance-none
                          [&::-webkit-slider-thumb]:w-4
                          [&::-webkit-slider-thumb]:h-4
                          [&::-webkit-slider-thumb]:rounded-full
                          [&::-webkit-slider-thumb]:bg-blue-600
                          [&::-webkit-slider-thumb]:border-2
                          [&::-webkit-slider-thumb]:border-white
                          [&::-webkit-slider-thumb]:shadow-md
                          [&::-webkit-slider-thumb]:cursor-pointer
                          [&::-webkit-slider-thumb]:transition-all
                          [&::-webkit-slider-thumb]:hover:scale-110
                          
                          [&::-moz-range-thumb]:appearance-none
                          [&::-moz-range-thumb]:w-4
                          [&::-moz-range-thumb]:h-4
                          [&::-moz-range-thumb]:rounded-full
                          [&::-moz-range-thumb]:bg-blue-600
                          [&::-moz-range-thumb]:border-2
                          [&::-moz-range-thumb]:border-white
                          [&::-moz-range-thumb]:shadow-md
                          [&::-moz-range-thumb]:cursor-pointer
                          [&::-moz-range-thumb]:transition-all
                          [&::-moz-range-thumb]:hover:scale-110
                          
                          [&::-moz-range-progress]:h-0.5
                          [&::-moz-range-progress]:bg-blue-600
                          [&::-moz-range-progress]:rounded
                          
                          [&::-moz-range-track]:h-0.5
                          [&::-moz-range-track]:bg-gray-200
                          [&::-moz-range-track]:rounded"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-xs text-gray-500">高度: {selectedBookmark.size.height}px</label>
                      <input
                        type="number"
                        min="100"
                        max="500"
                        value={selectedBookmark.size.height}
                        onChange={(e) => handleSizeChange('height', parseInt(e.target.value))}
                        className="w-16 text-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="relative mt-2">
                      <div className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 bg-gray-200 rounded"></div>
                      <div 
                        className="absolute top-1/2 left-0 h-0.5 -translate-y-1/2 bg-blue-600 rounded" 
                        style={{ width: `${((selectedBookmark.size.height - 100) / 400) * 100}%` }}
                      ></div>
                      <input
                        type="range"
                        min="100"
                        max="500"
                        value={selectedBookmark.size.height}
                        onChange={(e) => handleSizeChange('height', parseInt(e.target.value))}
                        className="relative w-full h-2 appearance-none bg-transparent cursor-pointer
                          [&::-webkit-slider-thumb]:appearance-none
                          [&::-webkit-slider-thumb]:w-4
                          [&::-webkit-slider-thumb]:h-4
                          [&::-webkit-slider-thumb]:rounded-full
                          [&::-webkit-slider-thumb]:bg-blue-600
                          [&::-webkit-slider-thumb]:border-2
                          [&::-webkit-slider-thumb]:border-white
                          [&::-webkit-slider-thumb]:shadow-md
                          [&::-webkit-slider-thumb]:cursor-pointer
                          [&::-webkit-slider-thumb]:transition-all
                          [&::-webkit-slider-thumb]:hover:scale-110
                          
                          [&::-moz-range-thumb]:appearance-none
                          [&::-moz-range-thumb]:w-4
                          [&::-moz-range-thumb]:h-4
                          [&::-moz-range-thumb]:rounded-full
                          [&::-moz-range-thumb]:bg-blue-600
                          [&::-moz-range-thumb]:border-2
                          [&::-moz-range-thumb]:border-white
                          [&::-moz-range-thumb]:shadow-md
                          [&::-moz-range-thumb]:cursor-pointer
                          [&::-moz-range-thumb]:transition-all
                          [&::-moz-range-thumb]:hover:scale-110
                          
                          [&::-moz-range-progress]:h-0.5
                          [&::-moz-range-progress]:bg-blue-600
                          [&::-moz-range-progress]:rounded
                          
                          [&::-moz-range-track]:h-0.5
                          [&::-moz-range-track]:bg-gray-200
                          [&::-moz-range-track]:rounded"
                      />
                    </div>
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
                  {predefinedRatios.map((ratio) => (
                    <button
                      key={ratio.value}
                      onClick={() => handleAspectRatioChange(ratio.value)}
                      className={`px-3 py-1 text-sm rounded-md ${
                        aspectRatio === ratio.value
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {ratio.label}
                    </button>
                  ))}
                </div>
                {aspectRatio === 'custom' && (
                  <div className="flex gap-2 items-center mt-2">
                    <input
                      type="number"
                      min="1"
                      value={customRatio.width}
                      onChange={(e) => handleCustomRatioChange('width', e.target.value)}
                      className="w-16 text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-gray-500">:</span>
                    <input
                      type="number"
                      min="1"
                      value={customRatio.height}
                      onChange={(e) => handleCustomRatioChange('height', e.target.value)}
                      className="w-16 text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>

              {/* Shadow Controls */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">阴影</label>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-xs text-gray-500">角度: {shadow.angle}°</label>
                      <input
                        type="number"
                        min="0"
                        max="360"
                        value={shadow.angle}
                        onChange={(e) => handleShadowChange('angle', parseInt(e.target.value))}
                        className="w-16 text-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={shadow.angle}
                      onChange={(e) => handleShadowChange('angle', parseInt(e.target.value))}
                      className="mt-1 w-full"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-xs text-gray-500">距离: {shadow.distance}px</label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={shadow.distance}
                        onChange={(e) => handleShadowChange('distance', parseInt(e.target.value))}
                        className="w-16 text-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={shadow.distance}
                      onChange={(e) => handleShadowChange('distance', parseInt(e.target.value))}
                      className="mt-1 w-full"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-xs text-gray-500">模糊: {shadow.blur}px</label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={shadow.blur}
                        onChange={(e) => handleShadowChange('blur', parseInt(e.target.value))}
                        className="w-16 text-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={shadow.blur}
                      onChange={(e) => handleShadowChange('blur', parseInt(e.target.value))}
                      className="mt-1 w-full"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-xs text-gray-500">颜色</label>
                      <input
                        type="color"
                        value={shadow.color}
                        onChange={(e) => handleShadowChange('color', e.target.value)}
                        className="w-8 h-8 p-0 border-0"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-xs text-gray-500">不透明度: {Math.round(shadow.opacity * 100)}%</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={Math.round(shadow.opacity * 100)}
                        onChange={(e) => handleShadowChange('opacity', parseInt(e.target.value) / 100)}
                        className="w-16 text-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={Math.round(shadow.opacity * 100)}
                      onChange={(e) => handleShadowChange('opacity', parseInt(e.target.value) / 100)}
                      className="mt-1 w-full"
                    />
                  </div>
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