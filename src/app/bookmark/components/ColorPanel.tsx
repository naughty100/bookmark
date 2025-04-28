'use client';
import React, { useState, useEffect } from 'react';

interface ColorPanelProps {
  onColorSelect: (color: string) => void;
  selectedColor?: string;
}

// 预设的颜色列表
const presetColors = [
  '#FF6B6B', // 红色
  '#4ECDC4', // 青色
  '#45B7D1', // 蓝色
  '#96CEB4', // 绿色
  '#FFEEAD', // 米色
  '#FFD93D', // 黄色
  '#6C5B7B', // 紫色
  '#F7F5F2', // 浅灰
  '#2F4858', // 深灰
  '#1A1A1A', // 黑色
];

const CUSTOM_COLORS_KEY = 'bookmark-custom-colors';
const MAX_COLORS = 50;

export default function ColorPanel({ onColorSelect, selectedColor }: ColorPanelProps) {
  const [customColors, setCustomColors] = useState<string[]>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newColor, setNewColor] = useState('#000000');

  // 从 localStorage 加载自定义颜色
  useEffect(() => {
    const savedColors = localStorage.getItem(CUSTOM_COLORS_KEY);
    if (savedColors) {
      setCustomColors(JSON.parse(savedColors));
    }
  }, []);

  // 保存自定义颜色到 localStorage
  const saveCustomColors = (colors: string[]) => {
    localStorage.setItem(CUSTOM_COLORS_KEY, JSON.stringify(colors));
    setCustomColors(colors);
  };

  // 添加新的自定义颜色
  const handleAddColor = () => {
    if (customColors.includes(newColor)) {
      // 如果颜色已存在，将其移到最前面
      const updatedColors = [
        newColor,
        ...customColors.filter(color => color !== newColor)
      ];
      saveCustomColors(updatedColors);
    } else {
      // 如果是新颜色，添加到最前面
      const updatedColors = [
        newColor,
        ...customColors
      ].slice(0, MAX_COLORS); // 限制最多50种颜色
      saveCustomColors(updatedColors);
    }
    setShowColorPicker(false);
  };

  // 处理颜色选择
  const handleColorSelect = (color: string) => {
    onColorSelect(color);
    // 如果选择的是自定义颜色，更新顺序
    if (customColors.includes(color)) {
      const updatedColors = [
        color,
        ...customColors.filter(c => c !== color)
      ];
      saveCustomColors(updatedColors);
    }
  };

  return (
    <div className="space-y-4">
      {/* 预设颜色 */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">预设颜色</h3>
        <div className="grid grid-cols-5 gap-2">
          {presetColors.map((color) => (
            <button
              key={color}
              onClick={() => handleColorSelect(color)}
              className={`w-8 h-8 rounded-full border-2 ${
                selectedColor === color ? 'border-blue-500' : 'border-transparent'
              } hover:scale-110 transition-transform duration-200 shadow-sm`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* 自定义颜色 */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-700">自定义颜色</h3>
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            {showColorPicker ? '取消' : '添加'}
          </button>
        </div>

        {/* 颜色选择器 */}
        {showColorPicker && (
          <div className="mb-2 flex gap-2">
            <input
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="w-8 h-8 p-0 border-0"
            />
            <button
              onClick={handleAddColor}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            >
              确定
            </button>
          </div>
        )}

        {/* 自定义颜色列表 */}
        <div className="grid grid-cols-5 gap-2">
          {customColors.map((color) => (
            <button
              key={color}
              onClick={() => handleColorSelect(color)}
              className={`w-8 h-8 rounded-full border-2 ${
                selectedColor === color ? 'border-blue-500' : 'border-transparent'
              } hover:scale-110 transition-transform duration-200 shadow-sm`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
}