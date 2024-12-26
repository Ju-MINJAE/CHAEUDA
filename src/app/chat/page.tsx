import ChatList from '@/components/ChatList';
import ChatDisplay from '@/components/ChatDisplay';

const ChatPage = () => {
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
    <div className="flex h-[700px]">
      <ChatList chats={dummyChats} />
      <div className="flex-1 flex flex-col">
        <header className="bg-slate-200">
          <h1 className="text-2xl p-4 text-kick">매물 정보가 들어올 공간</h1>
        </header>
        <ChatDisplay messages={dummyMessages} />
      </div>
    </div>
  );
};

export default ChatPage;
