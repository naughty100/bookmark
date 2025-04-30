'use client';
import React, { useState, useCallback, useEffect } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { ImageCropModalProps } from '@/types/bookmark/index.d';

export default function ImageCropModal({
  imageUrl,
  aspectRatio,
  onCancel,
  onCrop,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 50,
    height: aspectRatio ? 50 / aspectRatio : 50,
    x: 0,
    y: 0,
  });
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });
  const [imgLoaded, setImgLoaded] = useState(false);

  // 预加载图片以获取实际尺寸
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImgDimensions({ width: img.width, height: img.height });
      setImgLoaded(true);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const onImageLoad = useCallback((img: HTMLImageElement) => {
    setImageRef(img);
    
    // 计算适合的初始裁剪区域
    const imgWidth = img.width;
    const imgHeight = img.height;
    const imgAspect = imgWidth / imgHeight;
    
    let cropWidth, cropHeight;
    
    // 处理异常长宽比的图片
    if (imgAspect > 3) { // 处理特别宽的图片
      cropWidth = 30;
      cropHeight = aspectRatio ? 30 / aspectRatio : 30 * imgHeight / imgWidth;
    } else if (imgAspect < 0.33) { // 处理特别高的图片
      cropHeight = 30;
      cropWidth = aspectRatio ? 30 * aspectRatio : 30 * imgWidth / imgHeight;
    } else { // 正常比例的图片
      cropWidth = 50;
      cropHeight = aspectRatio ? 50 / aspectRatio : 50 * imgHeight / imgWidth;
    }
    
    // 确保裁剪框不会过大或过小
    cropWidth = Math.min(cropWidth, 80);
    cropHeight = Math.min(cropHeight, 80);
    
    setCrop({
      unit: '%',
      width: cropWidth,
      height: cropHeight,
      x: (100 - cropWidth) / 2,
      y: (100 - cropHeight) / 2,
    });
  }, [aspectRatio]);

  const getCroppedImage = useCallback(() => {
    if (!imageRef || !crop.width || !crop.height) return;

    const canvas = document.createElement('canvas');
    const scaleX = imageRef.naturalWidth / imageRef.width;
    const scaleY = imageRef.naturalHeight / imageRef.height;

    const pixelRatio = window.devicePixelRatio;
    canvas.width = Math.floor(crop.width * scaleX);
    canvas.height = Math.floor(crop.height * scaleY);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = 'high';

    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;

    ctx.drawImage(
      imageRef,
      cropX,
      cropY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY,
    );

    return canvas.toDataURL('image/png');
  }, [imageRef, crop]);

  const handleCrop = () => {
    const croppedImage = getCroppedImage();
    if (croppedImage) {
      onCrop(croppedImage);
    }
  };

  // 计算显示尺寸来适应模态框
  const getImageDisplayStyle = () => {
    if (!imgLoaded || imgDimensions.width === 0) return {};

    const aspectRatio = imgDimensions.width / imgDimensions.height;
    const isExtremelyWide = aspectRatio > 3;
    const isExtremelyTall = aspectRatio < 0.33;
    
    if (isExtremelyWide) {
      return { 
        maxWidth: '100%', 
        maxHeight: '500px',
        objectFit: 'contain' 
      };
    } else if (isExtremelyTall) {
      return { 
        maxHeight: '60vh', 
        maxWidth: '100%',
        objectFit: 'contain' 
      };
    }
    
    return { 
      maxHeight: '60vh', 
      maxWidth: '100%',
      objectFit: 'contain' 
    };
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
        <h3 className="text-lg font-medium mb-4">裁剪图片</h3>
        <div className="flex items-center justify-center mb-4 overflow-auto max-h-[70vh]">
          <div className="relative" style={{ maxWidth: '100%' }}>
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              aspect={aspectRatio}
              className="max-w-full"
              ruleOfThirds
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="裁剪预览"
                onLoad={(e) => onImageLoad(e.currentTarget)}
                style={getImageDisplayStyle()}
                className="max-w-full"
              />
            </ReactCrop>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            取消
          </button>
          <button
            onClick={handleCrop}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}