'use client';

import { useState, useEffect } from 'react';
import { ProductDetailModal } from '../product/detail/[product_id]/modal';
import { Location } from '@/types/product';
import { fetchNearbyProducts } from '@/api/product';
import SearchAndFilterMap from './_compoenets/SearchAndFilterMap';
import { ProductList } from './_compoenets/ProductList';

interface Property {
  id: number;
  location: Location;
  title: string;
  price: number;
}

const SearchPage = () => {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegionSelect = async (location: Location) => {
    setSelectedLocation(location);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchNearbyProducts(location.latitude, location.longitude);
      if (response.success && response.products) {
        const formattedProperties = response.products.map(product => ({
          id: product.id,
          location: { latitude: product.latitude, longitude: product.longitude },
          title: product.title,
          price: product.price,
        }));
        setProperties(formattedProperties);
      } else {
        setError(response.message || '매물을 불러오는데 실패했습니다.');
        setProperties([]);
      }
    } catch (err) {
      setError('매물을 불러오는 중 오류가 발생했습니다.');
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex p-5">
      <div className="flex-1">
        <SearchAndFilterMap
          onRegionSelect={handleRegionSelect}
          initialCenter={{ lat: 37.683834, lng: 126.776557 }}
          initialZoom={14}
          properties={properties}
          isLoading={isLoading}
        />
      </div>
      <div className="w-[25%] ml-[20px] flex flex-col items-center justify-start">
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {selectedProductId && (
          <ProductDetailModal
            productId={selectedProductId}
            isOpen={true}
            onClose={() => setSelectedProductId(null)}
          />
        )}
        {selectedLocation ? (
          isLoading ? (
            <div>매물을 불러오는 중...</div>
          ) : properties.length > 0 ? (
            <ProductList location={selectedLocation} onProductClick={setSelectedProductId} />
          ) : (
            <div>이 지역에 매물이 없습니다.</div>
          )
        ) : (
          <div>원하시는 지역의 매물을 검색하세요.</div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
