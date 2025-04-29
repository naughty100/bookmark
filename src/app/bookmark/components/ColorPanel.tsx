'use client';
import React, { useState, useEffect, useRef } from 'react';
import { ColorPanelProps } from '@/types/bookmark/index.d';

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
const MAX_COLORS = 100; // 增加到100种颜色

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

// K-means 聚类相关函数
function getDistance(color1: number[], color2: number[]): number {
  return Math.sqrt(
    Math.pow(color1[0] - color2[0], 2) +
    Math.pow(color1[1] - color2[1], 2) +
    Math.pow(color1[2] - color2[2], 2)
  );
}

function getClosestCentroid(color: number[], centroids: number[][]): number {
  let minDistance = Infinity;
  let closestIndex = 0;

  centroids.forEach((centroid, index) => {
    const distance = getDistance(color, centroid);
    if (distance < minDistance) {
      minDistance = distance;
      closestIndex = index;
    }
  });

  return closestIndex;
}

function calculateNewCentroid(cluster: number[][]): number[] {
  if (cluster.length === 0) return [0, 0, 0];
  
  const sum = cluster.reduce((acc, color) => [
    acc[0] + color[0],
    acc[1] + color[1],
    acc[2] + color[2]
  ], [0, 0, 0]);

  return sum.map(v => v / cluster.length);
}

function kMeans(colors: number[][], k: number, maxIterations: number = 20): number[][] {
  // 随机初始化质心
  let centroids = colors
    .sort(() => 0.5 - Math.random())
    .slice(0, k)
    .map(color => [...color]);

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    // 为每个颜色分配最近的质心
    const clusters: number[][][] = Array.from({ length: k }, () => []);
    colors.forEach(color => {
      const closestCentroidIndex = getClosestCentroid(color, centroids);
      clusters[closestCentroidIndex].push(color);
    });

    // 计算新的质心
    const newCentroids = clusters.map(calculateNewCentroid);

    // 检查是否收敛
    const centroidsChanged = centroids.some((centroid, i) => 
      getDistance(centroid, newCentroids[i]) > 1
    );

    if (!centroidsChanged) break;
    centroids = newCentroids;
  }

  return centroids;
}

export default function ColorPanel({ onColorSelect, selectedColor }: ColorPanelProps) {
  const [customColors, setCustomColors] = useState<string[]>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newColor, setNewColor] = useState('#000000');
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; color: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const customColorsRef = useRef<HTMLDivElement>(null);

  // 从 localStorage 加载自定义颜色
  useEffect(() => {
    const savedColors = localStorage.getItem(CUSTOM_COLORS_KEY);
    if (savedColors) {
      setCustomColors(JSON.parse(savedColors));
    }
  }, []);

  // 添加点击任意处关闭右键菜单的处理
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
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
      ].slice(0, MAX_COLORS); // 限制最多100种颜色
      saveCustomColors(updatedColors);
    }
    setShowColorPicker(false);
  };

  // 删除自定义颜色
  const handleDeleteColor = (color: string) => {
    const updatedColors = customColors.filter(c => c !== color);
    saveCustomColors(updatedColors);
    setContextMenu(null);
  };

  // 清空所有自定义颜色
  const handleClearColors = () => {
    if (window.confirm('确定要清空所有自定义颜色吗？')) {
      saveCustomColors([]);
    }
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

  const extractColorsFromImage = (file: File) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      // 调整画布大小以提高性能，同时保持足够的采样量
      const maxDimension = 100;
      const scale = Math.min(maxDimension / img.width, maxDimension / img.height);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height).data;
      if (!imageData) return;

      // 收集所有像素颜色
      const colors: number[][] = [];
      for (let i = 0; i < imageData.length; i += 4) {
        if (imageData[i + 3] < 128) continue; // 跳过透明像素
        colors.push([
          imageData[i],     // R
          imageData[i + 1], // G
          imageData[i + 2]  // B
        ]);
      }

      // 使用 K-means 聚类找出主要颜色
      const k = 3; // 提取3种主要颜色
      const mainColors = kMeans(colors, k);

      // 转换为十六进制颜色并更新
      const hexColors = mainColors.map(color => 
        rgbToHex(
          Math.round(color[0]),
          Math.round(color[1]),
          Math.round(color[2])
        )
      );

      // 按亮度排序 (从浅到深)
      hexColors.sort((a, b) => {
        const getBrightness = (hex: string) => {
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          return (r * 299 + g * 587 + b * 114) / 1000;
        };
        return getBrightness(b) - getBrightness(a);
      });

      // 更新自定义颜色列表
      const updatedColors = [
        ...hexColors,
        ...customColors.filter(color => !hexColors.includes(color))
      ].slice(0, MAX_COLORS);

      saveCustomColors(updatedColors);
    };

    img.src = URL.createObjectURL(file);
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (customColorsRef.current) {
      const scrollAmount = 160; // 每次滚动4个颜色的宽度
      customColorsRef.current.scrollLeft += direction === 'left' ? -scrollAmount : scrollAmount;
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      extractColorsFromImage(file);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, color: string) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      color
    });
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
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-gray-700">自定义颜色</h3>
            {customColors.length > 0 && (
              <button
                onClick={handleClearColors}
                className="text-xs text-gray-500 hover:text-red-500"
                title="清空所有自定义颜色"
              >
                清空
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              从图片提取
            </button>
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              {showColorPicker ? '取消' : '添加'}
            </button>
          </div>
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

        {/* 自定义颜色列表 - 支持滚动 */}
        <div className="relative">
          {customColors.length > 5 && (
            <>
              <button
                onClick={() => handleScroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-80 p-1 rounded-full shadow hover:bg-opacity-100"
              >
                ◀
              </button>
              <button
                onClick={() => handleScroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-80 p-1 rounded-full shadow hover:bg-opacity-100"
              >
                ▶
              </button>
            </>
          )}
          <div 
            ref={customColorsRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ scrollBehavior: 'smooth', padding: '0 20px' }}
          >
            {customColors.map((color) => (
              <button
                key={color}
                onClick={() => handleColorSelect(color)}
                onContextMenu={(e) => handleContextMenu(e, color)}
                className={`flex-shrink-0 w-8 h-8 rounded-full border-2 ${
                  selectedColor === color ? 'border-blue-500' : 'border-transparent'
                } hover:scale-110 transition-transform duration-200 shadow-sm`}
                style={{ backgroundColor: color }}
                title={`${color} (右键删除)`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 右键菜单 */}
      {contextMenu && (
        <div
          className="fixed bg-white rounded-lg shadow-lg py-1 z-50 min-w-[100px]"
          style={{
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
          }}
        >
          <button
            onClick={() => handleDeleteColor(contextMenu.color)}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
          >
            删除
          </button>
        </div>
      )}
    </div>
  );
}