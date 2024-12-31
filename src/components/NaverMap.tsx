'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    naver: typeof naver;
  }
}

interface NaverMapProps {
  topSearchInput?: boolean;
  searchQuery?: string;
  handleSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
}

const NaverMap = ({
  topSearchInput,
  searchQuery,
  handleSearchChange,
  initialCenter = { lat: 37.5656, lng: 126.9769 },
  initialZoom = 13,
}: NaverMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 클라이언트 환경에서만 실행
    if (typeof window === 'undefined' || !mapRef.current) return;

    const initializeMap = () => {
      if (!window.naver || !mapRef.current) return;

      const mapOptions = {
        center: new window.naver.maps.LatLng(initialCenter.lat, initialCenter.lng),
        zoom: initialZoom,
        zoomControl: true,
        zoomControlOptions: {
          position: window.naver.maps.Position.TOP_RIGHT,
        },
      };

      const map = new window.naver.maps.Map(mapRef.current, mapOptions);

      new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(initialCenter.lat, initialCenter.lng),
        map: map,
        title: 'Marker Test',
      });
    };

    const existingScript = document.querySelector('script[src*="maps.js"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`;
      script.async = true;
      script.onload = initializeMap;
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    } else {
      initializeMap;
    }
  }, [initialCenter, initialZoom]);

  return (
    <div className="relative">
      {topSearchInput && (
        <div className="absolute right-10 z-30 w-[250px] p-2">
          <input
            type="text"
            placeholder="지역명을 검색하세요."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full border-2 border-black p-2 text-[0.8rem]"
          />
        </div>
      )}
      <div ref={mapRef} className="w-full h-[700px]"></div>
    </div>
  );
};

export default NaverMap;
