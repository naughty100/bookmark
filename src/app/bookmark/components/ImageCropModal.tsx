'use client';
import React, { useState, useCallback } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropModalProps {
  imageUrl: string;
  aspectRatio?: number;
  onCancel: () => void;
  onCrop: (croppedImage: string) => void;
}

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

  const onImageLoad = useCallback((img: HTMLImageElement) => {
    setImageRef(img);
    // 根据图片比例初始化裁剪区域
    const imgAspect = img.width / img.height;
    let cropWidth = 50;
    let cropHeight = aspectRatio ? 50 / aspectRatio : 50;
    
    if (aspectRatio) {
      if (imgAspect > aspectRatio) {
        cropWidth = cropHeight * aspectRatio;
      } else {
        cropHeight = cropWidth / aspectRatio;
      }
    }

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

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
        <h3 className="text-lg font-medium mb-4">裁剪图片</h3>
        <div className="mb-4 overflow-auto max-h-[60vh]">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            aspect={aspectRatio}
            className="max-w-full"
          >
            <img
              src={imageUrl}
              alt="裁剪预览"
              onLoad={(e) => onImageLoad(e.currentTarget)}
              className="max-w-full"
            />
          </ReactCrop>
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