import useAccessToken from '@/hooks/useAccessToken';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Send } from 'lucide-react';
import useAuthStore from '@/stores/authStore';
import { ChatRoomProps, Message } from '@/types/chat';

const ChatRoom: React.FC<ChatRoomProps> = ({ chatId }) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const accessToken = useAccessToken();
  const { user } = useAuthStore();
  const myName = user?.username
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const connect = useCallback(() => {
    if (!accessToken) return;

    socketRef.current = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_URL}/${chatId}/?token=${encodeURIComponent(accessToken)}`,
    );

    socketRef.current.onopen = () => {
      setIsConnected(true);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };

    socketRef.current.onmessage = event => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'connection_established') {
          const prevMessages = (data.prev_messages || []).map((msg: any) => ({
            id: msg.id?.toString() || Date.now().toString(),
            content: msg.message || '',
            sender: msg.sender?.username || 'Unknown',
            createdAt: new Date(msg.created_at || Date.now()),
            chatRoom: msg.chat_room_id?.toString() || chatId,
          }));

          prevMessages.sort(
            (a: Message, b: Message) => a.createdAt.getTime() - b.createdAt.getTime(),
          );

          setMessages(prevMessages);
        } else {
          const newMessage: Message = {
            id: data.id?.toString() || Date.now().toString(),
            content: data.message || '',
            sender:
              (typeof data.sender === 'object' ? data.sender.username : data.sender) || 'Unknown',
            createdAt: new Date(data.created_at || Date.now()),
            chatRoom: data.chat_room_id?.toString() || chatId,
          };
          setMessages(prev => {
            const updatedMessages = [...prev, newMessage];
            return updatedMessages.sort(
              (a: Message, b: Message) => a.createdAt.getTime() - b.createdAt.getTime(),
            );
          });
        }
      } catch (err) {
        console.error('Error parsing message:', err);
        console.error('Raw message data:', event.data);
      }
    };

    socketRef.current.onerror = error => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    socketRef.current.onclose = () => {
      setIsConnected(false);
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log('Attempting to reconnect...');
        connect();
      }, 5000);
    };
  }, [accessToken, chatId]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const sendMessage = () => {
    if (
      socketRef.current &&
      socketRef.current.readyState === WebSocket.OPEN &&
      inputMessage.trim()
    ) {
      const messageData = {
        message: inputMessage,
        sender: myName,
      };
      socketRef.current.send(JSON.stringify(messageData));
      setInputMessage('');
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.sender === myName ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] space-y-2 ${message.sender === myName ? 'order-1' : 'order-2'}`}
            >
              <p className="text-xs text-[#71829b]">{message.sender}</p>
              <div
                className={`p-3 rounded-xl ${
                  message.sender === myName ? 'bg-kick text-white' : 'bg-[#cbc9c9] text-[#181818]'
                }`}
              >
                <p className="text-sm break-words leading-relaxed">{message.content}</p>
              </div>
              <p className="text-xs text-[#71829b]">{message.createdAt.toLocaleTimeString()}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-[#d9d9d9]">
        <div className="flex items-stretch">
          <input
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요."
            className="flex-1 px-4 py-3 border border-[#d9d9d9] rounded-l-lg focus:outline-none focus:border-kick text-sm"
            disabled={!isConnected}
          />
          <button
            onClick={sendMessage}
            disabled={!isConnected || !inputMessage.trim()}
            className="bg-kick text-white px-5 rounded-r-lg hover:bg-kick/90 disabled:opacity-50 transition-colors"
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
