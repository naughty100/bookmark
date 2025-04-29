'use client';
import React from 'react';
import ColorPanel from '../ColorPanel';
import { BackgroundConfig } from '@/types/bookmark/index.d';

interface BackgroundOpProps {
  config: BackgroundConfig;
  onConfigChange: (config: BackgroundConfig) => void;
}

const predefinedRatios = [
  { label: '3:4', value: '3:4' },
  { label: '1:1', value: '1:1' },
  { label: '6:19', value: '6:19' },
  { label: '9:16', value: '9:16' },
  { label: '4:3', value: '4:3' },
  { label: '自定义', value: 'custom' }
];

export default function BackgroundOp({ config, onConfigChange }: BackgroundOpProps) {
  const handleSizeChange = (dimension: 'width' | 'height', value: number) => {
    if (value > 0) {
      if (config.keepAspectRatio) {
        let ratioWidth, ratioHeight;
        if (config.aspectRatio === 'custom') {
          ratioWidth = config.customRatio.width;
          ratioHeight = config.customRatio.height;
        } else {
          [ratioWidth, ratioHeight] = config.aspectRatio.split(':').map(Number);
        }

        if (dimension === 'width') {
          onConfigChange({
            ...config,
            size: {
              width: value,
              height: Math.round(value * (ratioHeight / ratioWidth))
            }
          });
        } else {
          onConfigChange({
            ...config,
            size: {
              width: Math.round(value * (ratioWidth / ratioHeight)),
              height: value
            }
          });
        }
      } else {
        onConfigChange({
          ...config,
          size: {
            ...config.size,
            [dimension]: value
          }
        });
      }
    }
  };

  const handleAspectRatioChange = (newRatio: string) => {
    const updatedConfig = { ...config, aspectRatio: newRatio };
    if (config.keepAspectRatio) {
      let ratioWidth, ratioHeight;
      if (newRatio === 'custom') {
        ratioWidth = config.customRatio.width;
        ratioHeight = config.customRatio.height;
      } else {
        [ratioWidth, ratioHeight] = newRatio.split(':').map(Number);
      }

      const newWidth = config.size.width;
      updatedConfig.size = {
        width: newWidth,
        height: Math.round(newWidth * (ratioHeight / ratioWidth))
      };
    }
    onConfigChange(updatedConfig);
  };

  const handleCustomRatioChange = (dimension: 'width' | 'height', value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      const updatedConfig = {
        ...config,
        customRatio: {
          ...config.customRatio,
          [dimension]: numValue
        }
      };

      if (config.keepAspectRatio && config.aspectRatio === 'custom') {
        const newWidth = config.size.width;
        updatedConfig.size = {
          width: newWidth,
          height: Math.round(newWidth * (updatedConfig.customRatio.height / updatedConfig.customRatio.width))
        };
      }

      onConfigChange(updatedConfig);
    }
  };

  const handleGradientColorChange = (index: number, color: string) => {
    onConfigChange({
      ...config,
      gradientColors: config.gradientColors.map((gc, i) =>
        i === index ? { ...gc, color } : gc
      )
    });
  };

  const handleGradientPositionChange = (index: number, position: number) => {
    if (position >= 0 && position <= 100) {
      onConfigChange({
        ...config,
        gradientColors: config.gradientColors.map((gc, i) =>
          i === index ? { ...gc, position } : gc
        )
      });
    }
  };

  const addGradientColor = () => {
    if (config.gradientColors.length < 5) {
      // 计算新颜色的位置，保证均匀分布
      const totalColors = config.gradientColors.length;
      const newPosition = totalColors === 0 ? 50 : 
                         totalColors === 1 ? 100 : 
                         Math.round((totalColors) * 100 / (totalColors + 1));
      
      onConfigChange({
        ...config,
        gradientColors: [
          ...config.gradientColors,
          {
            color: '#000000',
            position: newPosition
          }
        ]
      });
    }
  };

  const removeGradientColor = (index: number) => {
    if (config.gradientColors.length > 2) {
      onConfigChange({
        ...config,
        gradientColors: config.gradientColors.filter((_, i) => i !== index)
      });
    }
  };

  const getGradientStyle = () => {
    const sortedColors = [...config.gradientColors].sort((a, b) => a.position - b.position);
    const colorStops = sortedColors.map(gc => `${gc.color} ${gc.position}%`).join(', ');
    
    if (config.colorType === 'linear-gradient') {
      return `linear-gradient(${config.gradientAngle}deg, ${colorStops})`;
    } else if (config.colorType === 'radial-gradient') {
      return `radial-gradient(circle at center, ${colorStops})`;
    }
    return config.solidColor;
  };

  return (
    <div className="space-y-4">
      {/* Size Controls */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">尺寸</label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.keepAspectRatio}
              onChange={(e) => onConfigChange({ ...config, keepAspectRatio: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-500">锁定比例</span>
          </label>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs text-gray-500">宽度: {config.size.width}px</label>
              <input
                type="number"
                min="1"
                max="3000"
                value={config.size.width}
                onChange={(e) => handleSizeChange('width', parseInt(e.target.value))}
                className="w-10 text-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <input
              type="range"
              min="100"
              max="3000"
              value={config.size.width}
              onChange={(e) => handleSizeChange('width', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs text-gray-500">高度: {config.size.height}px</label>
              <input
                type="number"
                min="1"
                max="3000"
                value={config.size.height}
                onChange={(e) => handleSizeChange('height', parseInt(e.target.value))}
                className="w-10 text-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <input
              type="range"
              min="100"
              max="3000"
              value={config.size.height}
              onChange={(e) => handleSizeChange('height', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Aspect Ratio Controls */}
      {config.keepAspectRatio && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">长宽比</label>
          <div className="grid grid-cols-3 gap-2">
            {predefinedRatios.map((ratio) => (
              <button
                key={ratio.value}
                onClick={() => handleAspectRatioChange(ratio.value)}
                className={`px-3 py-1 text-sm rounded-md ${
                  config.aspectRatio === ratio.value
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {ratio.label}
              </button>
            ))}
          </div>
          {config.aspectRatio === 'custom' && (
            <div className="flex gap-2 items-center mt-2">
              <input
                type="number"
                min="1"
                value={config.customRatio.width}
                onChange={(e) => handleCustomRatioChange('width', e.target.value)}
                className="w-16 text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="text-gray-500">:</span>
              <input
                type="number"
                min="1"
                value={config.customRatio.height}
                onChange={(e) => handleCustomRatioChange('height', e.target.value)}
                className="w-16 text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      )}

      {/* Color Type Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">背景颜色</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'solid', label: '纯色' },
            { id: 'linear-gradient', label: '线性渐变' },
            { id: 'radial-gradient', label: '径向渐变' }
          ].map(type => (
            <button
              key={type.id}
              onClick={() => onConfigChange({ ...config, colorType: type.id as 'solid' | 'linear-gradient' | 'radial-gradient' })}
              className={`px-3 py-1 text-sm rounded-md ${
                config.colorType === type.id
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      {config.colorType === 'solid' ? (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">选择颜色</label>
          <ColorPanel
            selectedColor={config.solidColor}
            onColorSelect={(color) => onConfigChange({ ...config, solidColor: color })}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Gradient Colors */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">渐变颜色</label>
              {config.gradientColors.length < 5 && (
                <button
                  onClick={addGradientColor}
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  添加颜色
                </button>
              )}
            </div>
            {config.gradientColors.map((gc, index) => (
              <div key={index} className="space-y-2 bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">颜色 {index + 1}</span>
                  {config.gradientColors.length > 2 && (
                    <button
                      onClick={() => removeGradientColor(index)}
                      className="text-red-500 hover:text-red-600 p-1"
                      title="删除此颜色"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                
                {/* 颜色选择 */}
                <div className="w-full">
                  <ColorPanel
                    selectedColor={gc.color}
                    onColorSelect={(color) => handleGradientColorChange(index, color)}
                  />
                </div>

                {/* 位置控制 */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs text-gray-500">位置: {gc.position}%</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={gc.position}
                      onChange={(e) => handleGradientPositionChange(index, parseInt(e.target.value))}
                      className="w-16 text-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={gc.position}
                    onChange={(e) => handleGradientPositionChange(index, parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Gradient Angle (only for linear gradient) */}
          {config.colorType === 'linear-gradient' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">渐变角度</label>
                <span className="text-sm text-gray-500">{config.gradientAngle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={config.gradientAngle}
                onChange={(e) => onConfigChange({ ...config, gradientAngle: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
          )}
        </div>
      )}

      {/* Preview */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">预览</label>
        <div 
          className="w-full h-32 rounded-lg border border-gray-200"
          style={{
            background: getGradientStyle()
          }}
        />
      </div>
    </div>
  );
}