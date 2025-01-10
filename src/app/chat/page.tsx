'use client';

import { useEffect, useState } from 'react';
import { Menu, MapPin } from 'lucide-react';
import ChatList from '@/components/chat/ChatList';
import { Chat } from '@/types/chat';
import { fetchChatList } from '@/api/chat';
import ChatRoom from '@/components/chat/ChatRoom';
import useAccessToken from '@/hooks/useAccessToken';

const ChatPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatList, setChatList] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const accessToken = useAccessToken();

  useEffect(() => {
    if (accessToken) {
      const fetchChats = async () => {
        try {
          const chats = await fetchChatList(accessToken);
          setChatList(chats);
          setIsLoading(false);
        } catch (err) {
          console.error(err);
          setError('채팅 목록을 가져오지 못했습니다.');
          setIsLoading(false);
        }
      };

      fetchChats();
    }
  }, [accessToken]);

  const handleChatCreated = (newChat: Chat) => {
    setChatList(prevChats => [newChat, ...prevChats]);
    setSelectedChatId(newChat.id);
  };

  const selectedChat = chatList.find(chat => chat.id === selectedChatId);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div
        className={`md:w-64 bg-white md:block transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'block' : 'hidden'
        }`}
      >
        <ChatList
          initialChats={chatList}
          onSelectChat={setSelectedChatId}
          selectedChatId={selectedChatId}
          onChatCreated={handleChatCreated}
        />
      </div>
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-md flex items-center justify-between p-4">
          {selectedChat ? (
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                {selectedChat.product_title}
              </h1>
              <div className="flex items-center text-gray-600 mt-1">
                <span className="text-lg font-semibold">
                  {selectedChat.seller} - {selectedChat.product_price.toLocaleString()}원
                </span>
              </div>
              <div className="flex items-center text-gray-500 mt-1">
                <MapPin size={16} className="mr-2" />
                <span className="text-sm">{selectedChat.product_address}</span>
              </div>
            </div>
          ) : (
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">채팅을 선택해주세요</h1>
          )}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
        </header>
        <ChatRoom chatId={18} />
      </div>
    </div>
  );
};

export default ChatPage;
