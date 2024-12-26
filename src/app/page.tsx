'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import SearchModal from '../components/SearchModal';

const NaverMap = dynamic(() => import('../components/NaverMap'), { ssr: false });

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [topSearchInput, setTopSearchInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTopSearchInput(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="relative">
      <NaverMap
        topSearchInput={topSearchInput}
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
      />
      <SearchModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default Home;
