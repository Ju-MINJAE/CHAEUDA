'use client';

import { useState } from 'react';
import { ChevronDown, Copy } from 'lucide-react';
import { createChatRequest } from '@/api/chat';
import useAccessToken from '@/hooks/useAccessToken';
import { useRouter } from 'next/navigation';

interface ContactProps {
  phone_number: string;
  productId: string;
}

const formatPhoneNumber = (phone: string) => {
  const numbers = phone.replace(/[^\d]/g, '');

  if (numbers.length === 11) {
    return numbers.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  }
  if (numbers.length === 10) {
    return numbers.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  }
  return phone;
};

export const Contact = ({ phone_number, productId }: ContactProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const accessToken = useAccessToken();
  const router = useRouter();

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(phone_number);
      setToastMessage('전화번호가 클립보드에 복사되었습니다.');
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      setToastMessage('전화번호 복사에 실패했습니다. 다시 시도해주세요.');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleChatButton = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    if (!accessToken) {
      setErrorMessage('로그인이 필요합니다.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await createChatRequest(accessToken, parseInt(productId, 10));

      if (response.success) {
        router.push('/chat');
      } else {
        setErrorMessage(response.message || '채팅방 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('채팅방 생성 오류: ', error);
      setErrorMessage('알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-t">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex justify-between items-center bg-red-500 text-white hover:bg-red-600 transition-colors"
        aria-expanded={isOpen}
        aria-controls="contact-details"
      >
        <span className="font-medium">문의</span>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div id="contact-details" className="p-4 space-y-3 bg-gray-100">
          <div className="flex flex-col">
            <div className="font-semibold">판매자 휴대폰번호</div>
            <div className="flex items-center">
              <span className="mr-2">{formatPhoneNumber(phone_number)}</span>
              <button
                onClick={handleCopyClick}
                className="p-2 bg-white hover:bg-gray-200 rounded-full transition-colors"
                aria-label="전화번호 복사"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
          {errorMessage && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
              role="alert"
            >
              <p>{errorMessage}</p>
            </div>
          )}
          <button
            onClick={handleChatButton}
            className={`w-full py-3 text-white ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-500 hover:bg-gray-600'
            }`}
            disabled={isLoading}
          >
            {isLoading ? '생성 중...' : '채팅'}
          </button>
        </div>
      )}
      {toastMessage && (
        <div className="z-30 fixed bottom-4 left-4 bg-gray-800 text-white px-4 py-2" role="alert">
          {toastMessage}
        </div>
      )}
    </div>
  );
};
