'use client';

import React, { useRef } from 'react';
import { Send } from 'lucide-react';

type Message = {
  id: string;
  user: string;
  content: string;
};

type MessageDisplayProps = {
  messages: Message[];
};

const ChatDisplay: React.FC<MessageDisplayProps> = ({ messages }) => {
  const myName = '주민재';
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: 메세지 전송 기능 구현
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.user === myName ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div className="p-3 max-w-xs rounded-lg shadow-md">
              <p className="font-semibold mb-1">{msg.user === myName ? '나' : msg.user}</p>
              <p>{msg.content}</p>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex p-4 bg-white border-t border-gray-200">
        <input
          ref={inputRef}
          type="text"
          className="flex-1 border border-gray-300 rounded-l-md p-2 focus:outline-none"
          placeholder="메시지를 입력하세요"
        />
        <button
          type="submit"
          className="bg-kick text-white rounded-r-md p-2 transition-colors duration-200"
        >
          <Send size={24} />
        </button>
      </form>
    </div>
  );
};

export default ChatDisplay;
