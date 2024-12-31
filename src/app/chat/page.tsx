'use client';

import { useState } from 'react';
import ChatList from '@/components/ChatList';
import ChatDisplay from '@/components/ChatDisplay';
import { Menu } from 'lucide-react';

const ChatPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const dummyChats = [
    { id: '1', name: '한효찬' },
    { id: '2', name: '이재훈' },
    { id: '3', name: '안지선' },
    { id: '4', name: '김범준' },
    { id: '5', name: '최승원' },
  ];

  const dummyMessages = [
    { id: '1', user: '한효찬', content: '안녕하세요' },
    { id: '2', user: '주민재', content: '안녕하세요' },
    { id: '3', user: '한효찬', content: '안녕하세요' },
    { id: '4', user: '주민재', content: '안녕하세요' },
  ];

  return (
    <div className="flex flex-col md:flex-row h-[700px]">
      <div
        className={`md:w-64 bg-white md:block transition-all duration-300 ease-in-out ${isSidebarOpen ? 'block' : 'hidden'}`}
      >
        <ChatList chats={dummyChats} />
      </div>
      <div className="flex-1 flex flex-col">
        <header className="bg-slate-200 flex items-center justify-between p-4">
          <h1 className="text-xl md:text-2xl text-kick">매물 정보가 들어올 공간</h1>
          <button className="md:hidden text-kick" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu size={24} />
          </button>
        </header>
        <ChatDisplay messages={dummyMessages} />
      </div>
    </div>
  );
};

export default ChatPage;
