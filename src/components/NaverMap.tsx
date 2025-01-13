'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    naver: typeof naver;
  }
}

interface NaverMapProps {
  topSearchInput: boolean;
  searchQuery: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchAddressToCoordinate = (address: string) => {
    if (!window.naver || !map || !marker) return;

    setIsLoading(true);
    setError(null);

    window.naver.maps.Service.geocode(
      {
        query: address,
      },
      function (status, response) {
        setIsLoading(false);

        if (status === window.naver.maps.Service.Status.ERROR) {
          setError('검색 중 오류가 발생했습니다.');
          return;
        }

        if (response.v2.meta.totalCount === 0) {
          setError('검색 결과가 없습니다.');
          return;
        }

        const item = response.v2.addresses[0];
        const point = new window.naver.maps.Point(Number(item.x), Number(item.y));

        map.setCenter(point);
        marker.setPosition(point);
      },
    );
  };
  // const handleSearchSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   searchAddressToCoordinate(searchAddress);
  // };

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    const initializeMap = () => {
      if (!window.naver || !mapRef.current) return;

      const mapOptions = {
        center: new window.naver.maps.LatLng(initialCenter.lat, initialCenter.lng),
        zoom: initialZoom,
        zoomControl: false,
      };

      new window.naver.maps.Map(mapRef.current, mapOptions);

      // const newMarker = new window.naver.maps.Marker({
      //   position: new window.naver.maps.LatLng(initialCenter.lat, initialCenter.lng),
      //   map: newMap,
      // });


      // setMap(newMap);
      // setMarker(newMarker);

    };

    if (!process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID) {
      setError('Naver Maps API 키가 설정되지 않았습니다.');
      setIsLoading(false);
      return;
    }

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
          <form className="flex gap-2">
            <input
              type="text"
              value={searchAddress}
              onChange={e => setSearchAddress(e.target.value)}
              placeholder="주소를 입력하세요"
              className="flex-1 border-2 border-gray-300 p-2 text-[0.8rem]"
            />
          </form>
          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        </div>
      )}
      {isLoading ? (
        <div className="w-full h-[700px] flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : (
        <div ref={mapRef} className="w-full h-[700px]"></div>
      )}
    </div>
  );
};

export default NaverMap;
