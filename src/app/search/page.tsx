'use client';

import { useState } from 'react';
import NaverMap from '@/components/NaverMap';
import RegionFilterForm from '@/containers/forms/RegionFilter';
import { ProductList } from './_compoenets/ProductList';
import { ProductDetailModal } from '../product/detail/[product_id]/modal';
import { Location } from '@/types/product';

const SearchPage = () => {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleRegionSelect = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex p-5">
      <div className="flex-1">
        <RegionFilterForm onRegionSelect={handleRegionSelect} />
        <NaverMap
          topSearchInput={false}
          initialCenter={{ lat: 37.5656, lng: 126.9769 }}
          initialZoom={14}
          searchQuery={searchQuery}
          handleSearchChange={handleSearchChange}
        />
      </div>
      <div className="w-[25%] ml-[20px] flex items-center justify-center">
        {selectedProductId && (
          <ProductDetailModal
            productId={selectedProductId}
            isOpen={true}
            onClose={() => setSelectedProductId(null)}
          />
        )}
        {selectedLocation ? (
          <ProductList location={selectedLocation} onProductClick={setSelectedProductId} />
        ) : (
          <div>원하시는 지역의 매물을 검색하세요.</div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
