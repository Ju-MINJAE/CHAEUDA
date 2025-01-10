'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    naver: typeof naver;
  }
}

interface NaverMapProps {
  topSearchInput?: boolean;
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
}

const NaverMap = ({
  topSearchInput = true,
  initialCenter = { lat: 37.5656, lng: 126.9769 },
  initialZoom = 13,
}: NaverMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [searchAddress, setSearchAddress] = useState('');
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);

  // 주소로 좌표 검색하는 함수
  const searchAddressToCoordinate = (address: string) => {
    if (!window.naver || !map || !marker) return;

    window.naver.maps.Service.geocode(
      {
        query: address,
      },
      function (status, response) {
        if (status === window.naver.maps.Service.Status.ERROR) {
          console.log('Something Wrong!');
          return;
        }

        if (response.v2.meta.totalCount === 0) {
          console.log('totalCount' + response.v2.meta.totalCount);
          return;
        }

        const item = response.v2.addresses[0];
        const point = new window.naver.maps.Point(Number(item.x), Number(item.y));

        console.log({
          address: item.roadAddress || item.jibunAddress,
          coordinate: {
            lat: Number(item.y),
            lng: Number(item.x),
          },
        });
        map.setCenter(point);
        marker.setPosition(point);
      },
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchAddressToCoordinate(searchAddress);
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    const initializeMap = () => {
      if (!window.naver || !mapRef.current) return;

      const mapOptions = {
        center: new window.naver.maps.LatLng(initialCenter.lat, initialCenter.lng),
        zoom: initialZoom,
        zoomControl: false,
      };

      const newMap = new window.naver.maps.Map(mapRef.current, mapOptions);

      const newMarker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(initialCenter.lat, initialCenter.lng),
        map: newMap,
      });

      setMap(newMap);
      setMarker(newMarker);
    };

    const existingScript = document.querySelector('script[src*="maps.js"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}&submodules=geocoder`;
      script.async = true;
      script.onload = initializeMap;
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    } else {
      initializeMap();
    }
  }, [initialCenter, initialZoom]);

  return (
    <div className="relative">
      {topSearchInput && (
        <div className="absolute right-5 z-30 w-[300px] p-5">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              type="text"
              value={searchAddress}
              onChange={e => setSearchAddress(e.target.value)}
              placeholder="주소를 입력하세요"
              className="flex-1 border-2 border-gray-300 p-2 text-[0.8rem]"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 text-sm">
              검색
            </button>
          </form>
        </div>
      )}
      <div ref={mapRef} className="w-full h-[700px]"></div>
    </div>
  );
};

export default NaverMap;
