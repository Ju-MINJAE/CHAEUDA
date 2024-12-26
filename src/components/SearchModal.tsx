import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="relative w-4/5 max-w-xl p-4">
        <input
          type="text"
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
