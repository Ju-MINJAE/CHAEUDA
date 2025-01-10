import { Message } from '@/types/chat';

interface ChatDisplayProps {
  messages: Message[];
}

const ChatDisplay: React.FC<ChatDisplayProps> = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map(message => (
        <div
          key={message.id}
          className={`p-2 rounded-lg ${
            message.user === '한효찬' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
          } max-w-[70%]`}
        >
          <p className="font-bold">{message.user}</p>
          <p>{message.content}</p>
        </div>
      ))}
    </div>
  );
};

export default ChatDisplay;
