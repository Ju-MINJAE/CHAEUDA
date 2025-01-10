import React, { useEffect, useRef, useState } from 'react';

interface ChatRoomProps {
  chatId: number;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ chatId }) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    try {
      setError(null);
      const tokenResponse = await fetch('/api/token', {
        method: 'GET',
        credentials: 'include',
      });

      if (!tokenResponse.ok) {
        throw new Error('토큰을 가져오는 데 실패했습니다.');
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.accessToken;

      // socketRef.current = new WebSocket(
      //   `wss://api.chaeuda.shop/ws/chat/${chatId}/?token=${encodeURIComponent(accessToken)}`,
      // );
      socketRef.current = new WebSocket(`wss://api.chaeuda.shop/ws/chat/${chatId}/`, [
        'authorization-bearer',
        `Bearer ${accessToken}`,
      ]);

      socketRef.current.onopen = () => {
        console.log(`WebSocket connection established for chat ${chatId}`);
        setIsConnected(true);
      };

      socketRef.current.onmessage = event => {
        console.log('Received message:', event.data);
        setMessages(prev => [...prev, event.data]);
      };

      socketRef.current.onerror = error => {
        console.error('WebSocket error:', error);
        setError('WebSocket connection error. Please try again.');
        setIsConnected(false);
      };

      socketRef.current.onclose = event => {
        console.log(`WebSocket connection closed for chat ${chatId}`, event.code, event.reason);
        setIsConnected(false);
        if (event.code !== 1000) {
          setError(`Connection closed unexpectedly. Code: ${event.code}, Reason: ${event.reason}`);
        }
      };
    } catch (error) {
      console.error('Connection error:', error);
      setError('Failed to establish connection. Please try again.');
    }
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }
  };

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return (
    <div className="flex-1 p-4">
      <h2 className="text-xl font-bold mb-4">Chat Room {chatId}</h2>
      <p className="mb-4">Connection status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      <div className="flex space-x-2 mb-4">
        <button
          onClick={connect}
          disabled={isConnected}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          연결하기
        </button>
        <button
          onClick={disconnect}
          disabled={!isConnected}
          className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          연결끊기
        </button>
      </div>
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          <p>{error}</p>
        </div>
      )}
      <div className="border rounded p-4 h-64 overflow-y-auto">
        {messages.map((message, index) => (
          <p key={index} className="mb-2">
            {message}
          </p>
        ))}
      </div>
    </div>
  );
};

export default ChatRoom;
