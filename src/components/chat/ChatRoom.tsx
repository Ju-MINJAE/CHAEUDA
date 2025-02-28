'use client';

import useAccessToken from '@/hooks/useAccessToken';
import type React from 'react';
import { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react';
import { Send } from 'lucide-react';
import useAuthStore from '@/stores/authStore';
import type { ChatRoomProps, Message, WebSocketMessage, WebSocketPrevMessage } from '@/types/chat';
import { MAX_RECCONECT_ATTEMPTS, MAX_RECONNECT_DELAY } from '@/constants/chat';

const ChatRoom: React.FC<ChatRoomProps> = ({ chatId }) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef<number>(0);

  const [reconnectError, setReconnectError] = useState<boolean>(false);

  const accessToken = useAccessToken();
  const { user } = useAuthStore();
  const myName = user?.username;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getReconnectDelay = useCallback(() => {
    const attempt = reconnectAttemptsRef.current;
    const delay = Math.min(MAX_RECONNECT_DELAY, MAX_RECONNECT_DELAY * Math.pow(2, attempt));
    return delay * (0.8 + Math.random() * 0.4);
  }, []);

  const resetReconnection = useCallback(() => {
    reconnectAttemptsRef.current = 0;
    setReconnectError(false);
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    if (!accessToken) return;

    socketRef.current = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_URL}/${chatId}/?token=${encodeURIComponent(accessToken)}`,
    );

    socketRef.current.onopen = () => {
      setIsConnected(true);
      resetReconnection();
    };

    socketRef.current.onmessage = event => {
      try {
        const data = JSON.parse(event.data) as WebSocketMessage;
        if (data.type === 'connection_established') {
          const prevMessages = (data.prev_messages || []).map((msg: WebSocketPrevMessage) => ({
            id: msg.id?.toString() || Date.now().toString(),
            content: msg.message || '',
            sender: msg.sender?.username || 'Unknown',
            createdAt: new Date(msg.created_at || Date.now()),
            chatRoom: msg.chat_room_id?.toString() || chatId.toString(),
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
              (typeof data.sender === 'object' ? data.sender.username : (data.sender as string)) ||
              'Unknown',
            createdAt: new Date(data.created_at || Date.now()),
            chatRoom: data.chat_room_id?.toString() || chatId.toString(),
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

      if (reconnectAttemptsRef.current >= MAX_RECCONECT_ATTEMPTS) {
        setReconnectError(true);
        console.error(`WebSocket reconnection failed after ${MAX_RECCONECT_ATTEMPTS} attempts`);
        return;
      }

      reconnectAttemptsRef.current += 1;

      const delay = getReconnectDelay();
      console.log(
        `Attempting to reconnect in ${Math.round(delay / 1000)} seconds... (Attempt ${reconnectAttemptsRef.current}/${MAX_RECCONECT_ATTEMPTS})`,
      );

      reconnectTimeoutRef.current = setTimeout(() => {
        console.log(
          `Reconnecting... (Attempt ${reconnectAttemptsRef.current}/${MAX_RECCONECT_ATTEMPTS})`,
        );
        connect();
      }, delay);
    };
  }, [accessToken, chatId, getReconnectDelay, resetReconnection]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
    }
    resetReconnection();
  }, [resetReconnection]);

  const handleManualReconnect = useCallback(() => {
    resetReconnection();
    connect();
  }, [resetReconnection, connect]);

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

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, []);

  const isNearBottom = useCallback(() => {
    if (!messagesEndRef.current) return false;
    const container = messagesEndRef.current.parentElement;
    if (!container) return false;

    return container.scrollHeight - container.scrollTop - container.clientHeight < 100;
  }, []);

  useLayoutEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.sender === myName || isNearBottom()) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom, myName, isNearBottom]);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {reconnectError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">연결 오류!</strong>
          <span className="block sm:inline"> 서버에 연결할 수 없습니다.</span>
          <button
            onClick={handleManualReconnect}
            className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs"
          >
            재연결
          </button>
        </div>
      )}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-4">
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
