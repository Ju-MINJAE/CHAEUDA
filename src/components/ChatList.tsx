type ChatListProps = {
  chats: { id: string; name: string }[];
};

const ChatList: React.FC<ChatListProps> = ({ chats }) => {
  return (
    <div className="h-full p-4 overflow-y-auto">
      {/* TODO: 채팅 페이지 -> 마이페이지  */}
      <h2 className="text-lg md:text-xl font-bold mb-4">채팅 목록</h2>
      <ul className="space-y-2">
        {chats.map(chat => (
          <li
            key={chat.id}
            className="bg-gray-100 p-3 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors"
          >
            {chat.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
