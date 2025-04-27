'use client';
import React from 'react';

interface AddBookmarkButtonProps {
  onClick: () => void;
}

export default function AddBookmarkButton({ onClick }: AddBookmarkButtonProps) {
  return (
    <button 
      onClick={onClick} 
      className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-sm"
    >
      添加便签
    </button>
  );
}