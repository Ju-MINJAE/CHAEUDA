'use client';

import { useEffect, useState } from 'react';
import { Menu, MapPin } from 'lucide-react';
import ChatList from '@/components/chat/ChatList';
import { Chat } from '@/types/chat';
import { fetchChatList } from '@/api/chat';
import ChatRoom from '@/components/chat/ChatRoom';
import useAccessToken from '@/hooks/useAccessToken';
import { useRouter } from 'next/navigation';

const ChatPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatList, setChatList] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

  const handleProductMove = (productId: string) => {
    router.push(`/product/detail/${productId}`);
  };

  const selectedChat = chatList.find(chat => chat.id === selectedChatId);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="flex h-[600px] bg-[#f6f6f6]">
      <div
        className={`w-60 bg-white border-r border-[#d9d9d9] transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed md:relative md:translate-x-0 z-10 h-full`}
      >
        <ChatList
          initialChats={chatList}
          onSelectChat={setSelectedChatId}
          selectedChatId={selectedChatId}
          onChatCreated={handleChatCreated}
        />
      </div>
      <div className="flex-1 flex flex-col w-full md:w-[calc(100%-15rem)]">
        <header className="bg-gray-300 border-b border-[#d9d9d9] flex items-center justify-between p-4">
          <div className="flex items-center">
            <button
              className="mr-4 text-[#71829b] md:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Toggle sidebar"
            >
              <Menu size={24} />
            </button>
            {selectedChat ? (
              <div className="">
                <h1 className="text-lg font-medium text-[#181818]">{selectedChat.product_title}</h1>
                <div className="flex items-center text-[#181818] mt-1">
                  <span className="text-sm">
                    {selectedChat.seller} · {selectedChat.product_price.toLocaleString()}원
                  </span>
                </div>
                <div className="flex items-center text-[#181818] mt-1">
                  <MapPin size={14} className="mr-1" />
                  <span className="text-xs mr-2">{selectedChat.product_address}</span>
                  <button
                    className="bg-gray-400 text-white font-thin text-xs px-2 py-1"
                    onClick={() => handleProductMove(selectedChat.product_id)}
                  >
                    매물 확인하기
                  </button>
                </div>
              </div>
            ) : (
              <h1 className="text-lg font-medium text-[#181818]">채팅을 선택해주세요</h1>
            )}
          </div>
        </header>
        <div className="flex-1 overflow-hidden">
          {selectedChatId && <ChatRoom chatId={selectedChatId} />}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
