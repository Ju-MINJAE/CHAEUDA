'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import SearchModal from '../components/SearchModal';
import useAuthStore from '@/stores/authStore';

const NaverMap = dynamic(() => import('../components/NaverMap'), {
  loading: () => (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        <p className="mt-4 text-lg text-gray-600">로딩 중입니다...</p>
      </div>
    </div>
  ),
  ssr: false,
});

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [topSearchInput, setTopSearchInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { socialLogin } = useAuthStore();

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTopSearchInput(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts === undefined) return;
      if (parts.length === 2) {
        const cookieValue = parts.pop();
        if (cookieValue) {
          return cookieValue.split(';').shift();
        }
      }
      return null;
    };

    const userInfo = getCookie('user');

    if (userInfo) {
      const decodedUserInfo = JSON.parse(decodeURIComponent(userInfo));

      if (decodedUserInfo.is_active === false) {
        return;
      }
      socialLogin(decodedUserInfo);
    }
  }, []);

  return (
    <div className="relative">
      <NaverMap
        topSearchInput={topSearchInput}
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
      />
      <SearchModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        handleSearchChange={handleSearchChange}
      />
    </div>
  );
};

export default Home;
