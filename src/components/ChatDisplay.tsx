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
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-2 md:p-4 space-y-4 overflow-y-auto">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.user === myName ? 'justify-end' : 'justify-start'} `}
          >
            <div
              className={`p-2 md:p-3 max-w-[75%] md:max-w-xs rounded-lg shadow-md ${
                msg.user === myName ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
              }`}
            >
              <p className="font-semibold mb-1 text-sm md:text-base">
                {msg.user === myName ? '나' : msg.user}
              </p>
              <p className="text-sm md:text-base">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex p-2 md:p-4 bg-white border-t border-gray-200">
        <input
          ref={inputRef}
          type="text"
          className="flex-1 border border-gray-300 rounded-l-md p-2 text-sm md:text-base foucus:outline-none"
          placeholder="메시지를 입력하세요"
        />
        <button type="submit" className="bg-kick text-white rounded-r-md p-2">
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatDisplay;
