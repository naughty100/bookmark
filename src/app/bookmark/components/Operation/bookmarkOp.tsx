'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import ImageCropModal from '../ImageCropModal';

interface ShadowConfig {
  angle: number;
  distance: number;
  blur: number;
  color: string;
  opacity: number;
}

interface BookmarkConfig {
  size?: { width: number; height: number };
  position?: { x: number; y: number };
  shadow?: ShadowConfig;
}

interface BookmarkOpProps {
  selectedBookmark?: {
    id: number;
    content: string;
    size: { width: number; height: number };
    position: { x: number; y: number };
    shadow?: ShadowConfig;
    imageUrl?: string;
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

export default function BookmarkOp({ 
  selectedBookmark, 
  onBookmarkConfigChange,
  onImageUpload 
}: BookmarkOpProps) {
  const [shadow, setShadow] = useState<ShadowConfig>({
    angle: 46,
    distance: 10,
    blur: 17,
    color: '#333333',
    opacity: 0.46
  });
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState('1:3');
  const [customRatio, setCustomRatio] = useState({ width: 1, height: 3 });
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);

  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    if (selectedBookmark) {
      onBookmarkConfigChange({
        position: {
          ...selectedBookmark.position,
          [axis]: value
        }
      });
    }
  };

  const handleSizeChange = (dimension: 'width' | 'height', value: number) => {
    if (value > 0 && selectedBookmark) {
      if (keepAspectRatio) {
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
            width: dimension === 'width' ? value : selectedBookmark.size.width,
            height: dimension === 'height' ? value : selectedBookmark.size.height
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

  const handleShadowChange = (key: keyof ShadowConfig, value: number | string) => {
    const newShadow = { ...shadow, [key]: value };
    setShadow(newShadow);
    onBookmarkConfigChange({ shadow: newShadow });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setSelectedImage(reader.result);
          setCropModalOpen(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    setCropModalOpen(false);
    setSelectedImage(null);
    
    // Convert base64 to file
    const dataUrlToFile = (dataUrl: string): File => {
      const arr = dataUrl.split(',');
      const mime = arr[0].match(/:(.*?);/)?.[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], 'cropped-image.png', { type: mime });
    };
    
    onImageUpload(dataUrlToFile(croppedImage));
  };

  if (!selectedBookmark) return null;

  return (
    <div className="space-y-4">
      {/* Position Controls */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">位置</label>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs text-gray-500">X: {selectedBookmark.position.x}px</label>
              <input
                type="number"
                value={selectedBookmark.position.x}
                onChange={(e) => handlePositionChange('x', parseInt(e.target.value))}
                className="w-16 text-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="relative mt-2">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 bg-gray-200 rounded"></div>
              <input
                type="range"
                min="0"
                max={1000}
                value={selectedBookmark.position.x}
                onChange={(e) => handlePositionChange('x', parseInt(e.target.value))}
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
                  [&::-webkit-slider-thumb]:hover:scale-110"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs text-gray-500">Y: {selectedBookmark.position.y}px</label>
              <input
                type="number"
                value={selectedBookmark.position.y}
                onChange={(e) => handlePositionChange('y', parseInt(e.target.value))}
                className="w-16 text-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="relative mt-2">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 bg-gray-200 rounded"></div>
              <input
                type="range"
                min="0"
                max={1000}
                value={selectedBookmark.position.y}
                onChange={(e) => handlePositionChange('y', parseInt(e.target.value))}
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
                  [&::-webkit-slider-thumb]:hover:scale-110"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Aspect Ratio Controls */}
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
                  [&::-webkit-slider-thumb]:hover:scale-110"
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
                  [&::-webkit-slider-thumb]:hover:scale-110"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">图片</label>
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

      {/* Crop Modal */}
      {cropModalOpen && selectedImage && (
        <ImageCropModal
          imageUrl={selectedImage}
          aspectRatio={aspectRatio === 'custom' 
            ? customRatio.width / customRatio.height
            : Number(aspectRatio.split(':')[0]) / Number(aspectRatio.split(':')[1])
          }
          onCancel={() => {
            setCropModalOpen(false);
            setSelectedImage(null);
          }}
          onCrop={handleCropComplete}
        />
      )}
    </div>
  );
}