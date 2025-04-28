'use client';
import React from 'react';

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
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-500">X (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={Math.round(config.position.x)}
              onChange={(e) =>
                onConfigChange({
                  position: { ...config.position, x: parseInt(e.target.value) }
                })
              }
              className="w-full px-2 py-1 text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500">Y (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={Math.round(config.position.y)}
              onChange={(e) =>
                onConfigChange({
                  position: { ...config.position, y: parseInt(e.target.value) }
                })
              }
              className="w-full px-2 py-1 text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          大小
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-500">宽度 (px)</label>
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
              className="w-full px-2 py-1 text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500">高度 (px)</label>
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
              className="w-full px-2 py-1 text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}