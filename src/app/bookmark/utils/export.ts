import { BackgroundConfig, TextConfig, DraggableItem } from '@/types/bookmark/index.d';

interface ExportConfig {
  backgroundConfig: BackgroundConfig;
  items: DraggableItem[];
  texts: TextConfig[];
}

export const exportToImage = async ({ backgroundConfig, items, texts }: ExportConfig): Promise<string> => {
  // 创建一个临时的 canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('无法创建 canvas 上下文');

  // 设置 canvas 尺寸为背景尺寸的 2 倍以获得高清效果
  const scale = 2;
  canvas.width = backgroundConfig.size.width * scale;
  canvas.height = backgroundConfig.size.height * scale;

  // 缩放以支持高清
  ctx.scale(scale, scale);

  // 绘制背景
  const drawBackground = () => {
    if (backgroundConfig.colorType === 'solid') {
      ctx.fillStyle = backgroundConfig.solidColor;
      ctx.fillRect(0, 0, backgroundConfig.size.width, backgroundConfig.size.height);
    } else {
      const gradient = backgroundConfig.colorType === 'linear-gradient'
        ? ctx.createLinearGradient(0, 0, 
            Math.cos(backgroundConfig.gradientAngle * Math.PI / 180) * backgroundConfig.size.width,
            Math.sin(backgroundConfig.gradientAngle * Math.PI / 180) * backgroundConfig.size.height)
        : ctx.createRadialGradient(
            backgroundConfig.size.width / 2,
            backgroundConfig.size.height / 2,
            0,
            backgroundConfig.size.width / 2,
            backgroundConfig.size.height / 2,
            Math.max(backgroundConfig.size.width, backgroundConfig.size.height) / 2
          );

      backgroundConfig.gradientColors
        .sort((a, b) => a.position - b.position)
        .forEach(({ color, position }) => {
          gradient.addColorStop(position / 100, color);
        });

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, backgroundConfig.size.width, backgroundConfig.size.height);
    }
  };

  // 绘制书签
  const drawBookmarks = async () => {
    for (const item of items) {
      // 先绘制阴影
      if (item.shadow) {
        ctx.save();
        const { angle, distance, blur, color, opacity } = item.shadow;
        const shadowX = Math.cos(angle * Math.PI / 180) * distance;
        const shadowY = Math.sin(angle * Math.PI / 180) * distance;
        ctx.shadowColor = color + Math.round(opacity * 255).toString(16).padStart(2, '0');
        ctx.shadowBlur = blur;
        ctx.shadowOffsetX = shadowX;
        ctx.shadowOffsetY = shadowY;
      }

      // 绘制书签背景
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(item.position.x, item.position.y, item.size.width, item.size.height);

      // 如果有图片，加载并绘制图片
      if (item.imageUrl) {
        try {
          const image = await loadImage(item.imageUrl);
          ctx.drawImage(
            image,
            item.position.x,
            item.position.y,
            item.size.width,
            item.size.height
          );
        } catch (error) {
          console.error('加载图片失败:', error);
        }
      }

      // 如果有内容，绘制文本
      if (item.content) {
        ctx.fillStyle = item.imageUrl ? '#ffffff' : '#000000';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const x = item.position.x + item.size.width / 2;
        const y = item.position.y + item.size.height / 2;
        
        // 为文本添加半透明背景
        const textMetrics = ctx.measureText(item.content);
        const padding = 8;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(
          x - textMetrics.width / 2 - padding,
          y - 10 - padding,
          textMetrics.width + padding * 2,
          20 + padding * 2
        );
        
        // 绘制文本
        ctx.fillStyle = '#ffffff';
        ctx.fillText(item.content, x, y);
      }

      if (item.shadow) {
        ctx.restore();
      }
    }
  };

  // 绘制文本
  const drawTexts = () => {
    // 按 zIndex 排序
    const sortedTexts = [...texts].sort((a, b) => 
      ((a.style.zIndex || 0) - (b.style.zIndex || 0))
    );

    for (const text of sortedTexts) {
      ctx.save();
      
      // 设置字体样式
      ctx.font = `${text.style.fontSize}px ${text.style.fontFamily}`;
      ctx.fillStyle = text.style.color || '#000000';
      
      // 移动到文本位置
      ctx.translate(
        text.position.x + text.size.width / 2,
        text.position.y + text.size.height / 2
      );
      
      // 应用旋转
      ctx.rotate(text.style.rotate * Math.PI / 180);
      
      // 根据方向设置文本
      if (text.style.direction === 'vertical') {
        // 垂直文本
        const chars = text.text.split('');
        const lineHeight = text.style.fontSize * 1.2;
        const totalHeight = chars.length * lineHeight;
        
        chars.forEach((char, index) => {
          ctx.fillText(
            char,
            0,
            -totalHeight / 2 + index * lineHeight
          );
        });
      } else {
        // 水平文本
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text.text, 0, 0);
      }
      
      ctx.restore();
    }
  };

  // 加载图片的辅助函数
  const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  };

  // 按顺序执行绘制
  drawBackground();
  await drawBookmarks();
  drawTexts();

  // 返回 base64 格式的图片数据
  return canvas.toDataURL('image/png');
};

// 下载图片的辅助函数
export const downloadImage = (dataUrl: string, filename: string = 'bookmark.png') => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};