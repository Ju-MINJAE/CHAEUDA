'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSearch }) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');

  useEffect(() => {
    setMounted(true);

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLocalSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(searchValue);
      onClose();
    }
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-30">
      <div className="relative w-4/5 max-w-xl p-4">
        <input
          type="text"
          value={searchValue}
          onChange={handleLocalSearchChange}
          onKeyDown={handleKeyDown}
          placeholder="찾으시는 지역명을 검색하세요. (예: 시/도, 구/군)"
          className="w-full h-[60px] border-2 border-black p-5 focus:outline-none inset-x-0 focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[0.7rem] border px-[0.2rem] rounded-sm text-gray-700 hover:text-gray-500 bg-gray-100"
        >
          ✖
        </button>
      </div>
    </div>,
    document.body,
  );
};

export default SearchModal;
