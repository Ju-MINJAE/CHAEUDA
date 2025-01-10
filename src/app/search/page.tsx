'use client';

import { useState } from 'react';
import NaverMap from '@/components/NaverMap';
import RegionFilterForm from '@/containers/forms/RegionFilter';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex p-5">
      <div className="flex-1">
        <RegionFilterForm />
        <NaverMap
          topSearchInput={false}
          initialCenter={{ lat: 37.5656, lng: 126.9769 }}
          initialZoom={14}
          searchQuery={searchQuery}
          handleSearchChange={handleSearchChange}
        />
      </div>
      <div className="w-[25%] flex items-center justify-center">
        원하시는 지역의 매물을 검색하세요.
      </div>
    </div>
  );
};

export default SearchPage;
