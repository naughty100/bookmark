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

  // 设置 canvas 尺寸为背景尺寸的 3 倍以获得高清效果
  const scale = 3;
  canvas.width = backgroundConfig.size.width * scale;
  canvas.height = backgroundConfig.size.height * scale;

  // 缩放以支持高清
  ctx.scale(scale, scale);

  // 绘制背景
  const drawBackground = () => {
    if (backgroundConfig.colorType === 'solid') {
      ctx.fillStyle = backgroundConfig.solidColor;
      ctx.fillRect(0, 0, backgroundConfig.size.width, backgroundConfig.size.height);
    } else if (backgroundConfig.colorType === 'linear-gradient') {
      // 修复线性渐变计算
      const angleInRadians = (( backgroundConfig.gradientAngle + 270) % 360 ) * Math.PI / 180;
      const width = backgroundConfig.size.width;
      const height = backgroundConfig.size.height;
      
      // 计算渐变的起点和终点
      const x0 = width / 2 - Math.cos(angleInRadians) * width / 2;
      const y0 = height / 2 - Math.sin(angleInRadians) * height / 2;
      const x1 = width / 2 + Math.cos(angleInRadians) * width / 2;
      const y1 = height / 2 + Math.sin(angleInRadians) * height / 2;
      
      const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
      
      backgroundConfig.gradientColors
        .sort((a, b) => a.position - b.position)
        .forEach(({ color, position }) => {
          gradient.addColorStop(position / 100, color);
        });

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, backgroundConfig.size.width, backgroundConfig.size.height);
    } else if (backgroundConfig.colorType === 'radial-gradient') {
      // 径向渐变
      const centerX = backgroundConfig.size.width / 2;
      const centerY = backgroundConfig.size.height / 2;
      const radius = Math.max(backgroundConfig.size.width, backgroundConfig.size.height) / 2;
      
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
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
      
      // 设置字体样式 - 确保与CSS中的设置完全匹配
      ctx.font = `${text.style.fontSize}px ${text.style.fontFamily || 'Arial'}`;
      ctx.fillStyle = text.style.color || '#000000';
      
      // 精确计算文本在画布上的位置
      // 水平或垂直文本的定位略有不同
      if (text.style.direction === 'vertical') {
        // 垂直文本
        // 对于垂直文本，我们先计算总高度，然后根据文本内容调整位置以确保居中
        const chars = text.text.split('');
        const lineHeight = text.style.fontSize * 1.2; // 行高系数保持与CSS一致
        const totalHeight = chars.length * lineHeight;
        
        // 计算精确的起始位置，考虑到容器的大小和旋转角度
        const textX = text.position.x + text.size.width / 2;
        const textY = text.position.y + text.size.height / 2;
        
        ctx.translate(textX, textY);
        ctx.rotate((text.style.rotate || 0) * Math.PI / 180);
        
        // 绘制每个字符，确保垂直排列正确对齐
        chars.forEach((char, index) => {
          const charY = -totalHeight / 2 + index * lineHeight + text.style.fontSize / 2;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(char, 0, charY);
        });
      } else {
        // 水平文本
        // 计算精确的文本位置坐标，考虑到文本旋转
        const textX = text.position.x + text.size.width / 2;
        const textY = text.position.y + text.size.height / 2;
        
        // 考虑旋转角度的计算
        ctx.translate(textX, textY);
        ctx.rotate((text.style.rotate || 0) * Math.PI / 180);
        
        // 使用精确对齐方式确保文本在容器中居中
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

  // 按顺序执行绘制 - 先背景，再书签，最后文字（确保文字在最上层）
  drawBackground();
  await drawBookmarks();
  drawTexts(); // 文字最后绘制，确保最高优先级

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