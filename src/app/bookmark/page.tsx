'use client';
import { useState } from 'react';
import Background from './components/Background';
import OperationPanel from './components/OperationPanel';

interface DraggableItem {
  id: number;
  content: string;
  position: { x: number; y: number };
  isEditing: boolean;
}

export default function Home() {
  const [items, setItems] = useState<DraggableItem[]>([]);
  const [nextId, setNextId] = useState(1);

  const addNewItem = () => {
    const newItem: DraggableItem = {
      id: nextId,
      content: '新便签',
      position: { x: Math.random() * 500, y: Math.random() * 300 },
      isEditing: false
    };
    setItems([...items, newItem]);
    setNextId(nextId + 1);
  };
  
  return (
    <main className="min-h-screen flex">
      <Background items={items} setItems={setItems} />
      <OperationPanel onAddBookmark={addNewItem} />
    </main>
  );
}
