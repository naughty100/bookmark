'use client';
import React from 'react';
import ColorPanel from '../ColorPanel';

interface TextConfig {
  id: number;
  text: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: {
    fontSize: number;
    fontFamily: string;
    rotate: number;
    direction: 'horizontal' | 'vertical';
    color: string;  // 添加颜色属性
  };
}

interface TextOpProps {
  config: TextConfig;
  onConfigChange: (config: Partial<TextConfig>) => void;
}

const fonts = [
  { label: '默认字体', value: 'inherit' },
  { label: '晨风体', value: 'ChillCalligraphy_ChenFeng' },
  { label: '秋鸿体', value: 'ChillCalligraphy_QiuHong' },
  { label: '志莽行书', value: 'ZhongQiZhiMang' },
  { label: '鸿雷拙书', value: 'HongLeiZhuoShu' },
];

export default function TextOp({ config, onConfigChange }: TextOpProps) {
  const handleStyleChange = (key: keyof TextConfig['style'], value: any) => {
    onConfigChange({
      style: {
        ...config.style,
        [key]: value
      }
    });
  };

  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    onConfigChange({
      position: {
        ...config.position,
        [axis]: value
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* 文本内容 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          文本内容
        </label>
        <input
          type="text"
          value={config.text}
          onChange={(e) => onConfigChange({ text: e.target.value })}
          className="w-full px-3 py-2 text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* 文字颜色 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">文字颜色</label>
        <ColorPanel
          selectedColor={config.style.color}
          onColorSelect={(color) => handleStyleChange('color', color)}
        />
      </div>

      {/* 文本方向 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          排列方式
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => handleStyleChange('direction', 'horizontal')}
            className={`flex-1 px-3 py-1 text-sm rounded-md ${
              config.style.direction === 'horizontal'
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            横排
          </button>
          <button
            onClick={() => handleStyleChange('direction', 'vertical')}
            className={`flex-1 px-3 py-1 text-sm rounded-md ${
              config.style.direction === 'vertical'
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            竖排
          </button>
        </div>
      </div>

      {/* 字体选择 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          字体
        </label>
        <select
          value={config.style.fontFamily}
          onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {fonts.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
      </div>

      {/* 字号设置 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          字号: {config.style.fontSize}px
        </label>
        <input
          type="range"
          min="12"
          max="72"
          value={config.style.fontSize}
          onChange={(e) => handleStyleChange('fontSize', parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      {/* 旋转角度 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          旋转: {config.style.rotate}°
        </label>
        <input
          type="range"
          min="-180"
          max="180"
          value={config.style.rotate}
          onChange={(e) => handleStyleChange('rotate', parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      {/* 位置和大小设置 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          位置
        </label>
        <div className="space-y-2">
          <div className="flex flex-col">
            <label className="block text-xs text-gray-500">X: {config.position.x}px</label>
            <input
              type="range"
              min="0"
              max="1000"
              value={config.position.x}
              onChange={(e) => handlePositionChange('x', parseInt(e.target.value))}
              className="w-full mt-1"
            />
          </div>
          <div className="flex flex-col">
            <label className="block text-xs text-gray-500">Y: {config.position.y}px</label>
            <input
              type="range"
              min="0"
              max="1000"
              value={config.position.y}
              onChange={(e) => handlePositionChange('y', parseInt(e.target.value))}
              className="w-full mt-1"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          大小
        </label>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs text-gray-500">宽度: {config.size.width}px</label>
              <input
                type="number"
                min="50"
                max="1000"
                value={config.size.width}
                onChange={(e) =>
                  onConfigChange({
                    size: { ...config.size, width: parseInt(e.target.value) }
                  })
                }
                className="w-16 text-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="relative mt-2">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 bg-gray-200 rounded"></div>
              <div 
                className="absolute top-1/2 left-0 h-0.5 -translate-y-1/2 bg-blue-600 rounded" 
                style={{ width: `${((config.size.width - 50) / 950) * 100}%` }}
              ></div>
              <input
                type="range"
                min="50"
                max="1000"
                value={config.size.width}
                onChange={(e) =>
                  onConfigChange({
                    size: { ...config.size, width: parseInt(e.target.value) }
                  })
                }
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
              <label className="block text-xs text-gray-500">高度: {config.size.height}px</label>
              <input
                type="number"
                min="50"
                max="1000"
                value={config.size.height}
                onChange={(e) =>
                  onConfigChange({
                    size: { ...config.size, height: parseInt(e.target.value) }
                  })
                }
                className="w-16 text-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="relative mt-2">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 bg-gray-200 rounded"></div>
              <div 
                className="absolute top-1/2 left-0 h-0.5 -translate-y-1/2 bg-blue-600 rounded" 
                style={{ width: `${((config.size.height - 50) / 950) * 100}%` }}
              ></div>
              <input
                type="range"
                min="50"
                max="1000"
                value={config.size.height}
                onChange={(e) =>
                  onConfigChange({
                    size: { ...config.size, height: parseInt(e.target.value) }
                  })
                }
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
    </div>
  );
}