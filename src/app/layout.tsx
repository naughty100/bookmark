import './globals.css'

export const metadata = {
  title: 'Bookmark - 个性化书签墙',
  description: '打造你的个性化书签墙，简洁、美观、高效，让收藏的网页变成独特的视觉艺术',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}
