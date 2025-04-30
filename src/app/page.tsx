"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="min-h-screen">
      {/* 导航栏 */}
      <nav className={`fixed w-full z-10 transition-all duration-300 ${isScrolled ? 'bg-white/90 shadow-md backdrop-blur-sm' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image 
              src="/file.svg" 
              alt="Bookmark Logo" 
              width={32} 
              height={32} 
              className="w-8 h-8"
            />
            <span className="text-xl font-bold text-gray-800">Bookmark</span>
          </div>
          <Link href="/bookmark" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors">
            开始使用
          </Link>
        </div>
      </nav>

      {/* 英雄区 */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 pt-28 pb-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
            打造你的个性化书签照片墙
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            简洁、美观、高效，让照片变成独特的视觉艺术
          </p>
          <Link href="/bookmark" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg rounded-full inline-block transition-colors">
            立即体验
          </Link>
          
          {/* <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-blue-50 to-transparent z-10 pointer-events-none h-20 bottom-0 top-auto"></div>
            <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200 max-w-4xl mx-auto">
              <Image 
                src="/preview.png" 
                alt="Bookmark Preview" 
                width={1200} 
                height={675} 
                className="w-full h-auto"
                priority
                // 如果没有预览图，可以暂时注释掉这个Image组件
              />
            </div>
          </div> */}
        </div>
      </section>

      {/* 功能特点 */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">强大的功能，简约的体验</h2>
          
          <div className="flex flex-col md:flex-row justify-center gap-10 max-w-4xl mx-auto">
            {/* 功能卡片 1 */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex-1">
              <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Image src="/window.svg" alt="Customizable" width={24} height={24} className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">完全自定义</h3>
              <p className="text-gray-600">自由调整背景、字体、颜色和布局，打造专属于你的书签墙。</p>
            </div>
            
            {/* 功能卡片 3 */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex-1">
              <div className="bg-purple-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">导出分享</h3>
              <p className="text-gray-600">轻松导出你的书签设计，与好友分享你的收藏和创意。</p>
            </div>
          </div>
        </div>
      </section>

      {/* 使用流程 */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">简单两步，开始使用</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-16">不需要复杂的学习过程，几分钟内即可创建你的专属书签墙</p>
          
          <div className="flex flex-col md:flex-row gap-8 max-w-3xl mx-auto justify-center">
            <div className="text-center md:w-1/2">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">个性化定制</h3>
              <p className="text-gray-600">调整颜色、背景和布局，创造专属视觉风格</p>
            </div>
            
            <div className="text-center md:w-1/2">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">使用和分享</h3>
              <p className="text-gray-600">导出分享给朋友</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/bookmark" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg rounded-full inline-block transition-colors">
              开始创建
            </Link>
          </div>
        </div>
      </section>

      {/* 愿景 */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-6">我们的愿景</h2>
          <p className="text-xl mb-8 leading-relaxed">
            我们致力于创造一个既实用又美观的书签照片管理工具，让互联网冲浪变得更加有序和愉悦。
            每个人都可以根据自己的喜好和习惯，打造专属的内容入口，让网络体验更加个性化。
          </p>
          <Link href="/bookmark" className="px-8 py-3 bg-white hover:bg-gray-100 text-blue-700 text-lg rounded-full inline-block transition-colors">
            成为先行者
          </Link>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="bg-gray-800 text-gray-300 py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <Image 
                src="/file.svg" 
                alt="Bookmark Logo" 
                width={32} 
                height={32} 
                className="w-8 h-8 brightness-0 invert" 
              />
              <span className="text-xl font-bold">Bookmark</span>
            </div>
            
            <div className="text-sm">
              © {new Date().getFullYear()} Bookmark.Squidward1984. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}