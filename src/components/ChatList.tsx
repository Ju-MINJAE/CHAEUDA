type ChatListProps = {
  chats: { id: string; name: string }[];
};

const ChatList: React.FC<ChatListProps> = ({ chats }) => {
  return (
    <div className="w-64 h-screen p-4">
      <h2 className="text-xl font-bold mb-4">채팅 목록</h2>
      <ul className="space-y-2">
        {chats.map(chat => (
          <li key={chat.id} className="p-3 border-b border-black cursor-pointer">
            {chat.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
