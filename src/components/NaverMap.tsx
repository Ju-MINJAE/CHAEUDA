'use client';

import { fetchNearbyProducts } from '@/api/product';
import { SearchProduct } from '@/types/product';
import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    naver: typeof naver;
  }
}

interface NaverMapProps {
  topSearchInput?: boolean;
  searchQuery: string;
  onSearch: (query: string) => void;
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
}

const NaverMap = ({
  topSearchInput,
  searchQuery,
  onSearch,
  initialCenter = { lat: 37.5656, lng: 126.9769 },
  initialZoom = 13,
}: NaverMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [infoWindow, setInfoWindow] = useState<any>(null);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

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
      setMap(newMap);

      const newInfoWindow = new window.naver.maps.InfoWindow({
        content: '',
        maxWidth: 300,
        backgroundColor: '#eee',
        borderColor: '#F22929',
        borderWidth: 2,
        anchorSize: new window.naver.maps.Size(30, 30),
        anchorSkew: true,
        anchorColor: '#eee',
        pixelOffset: new window.naver.maps.Point(20, -20),
      });

      setInfoWindow(newInfoWindow);
    };

    const loadNaverMapsScript = () => {
      const script = document.createElement('script');
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}&submodules=geocoder`;
      script.async = true;
      script.onload = initializeMap;
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    };

    const existingScript = document.querySelector('script[src*="maps.js"]');
    if (!existingScript) {
      loadNaverMapsScript();
    }
  }, [initialCenter, initialZoom]);

  useEffect(() => {
    if (map && searchQuery) {
      performSearch(searchQuery);
    }
  }, [map, searchQuery]);

  const performSearch = (query: string) => {
    window.naver.maps.Service.geocode(
      {
        query: query,
      },
      async (status: any, response: any) => {
        if (status !== window.naver.maps.Service.Status.OK) {
          console.error('Geocode Error: ' + status);
          return;
        }

        if (!response.v2.addresses || response.v2.addresses.length === 0) {
          console.error('No results found');
          return;
        }

        const result = response.v2.addresses[0];
        const lat = parseFloat(result.y);
        const lng = parseFloat(result.x);
        const point = new window.naver.maps.LatLng(lat, lng);

        map.setCenter(point);
        map.setZoom(15);

        try {
          const nearbyProductsResponse = await fetchNearbyProducts(lat, lng);
          // console.log('Nearby Products Response:', nearbyProductsResponse);

          if (nearbyProductsResponse.success && nearbyProductsResponse.products) {
            clearMarkers();
            addMarkers(nearbyProductsResponse.products);
          }
        } catch (error) {
          console.error('Fetching Nearby Products:', error);
        }
      },
    );
  };

  const clearMarkers = () => {
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);
  };

  const addMarkers = (products: SearchProduct[]) => {
    const newMarkers = products.map(product => {
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(product.latitude, product.longitude),
        map: map,
        icon: {
          content: `<div style="background-color: #999999; color: white; border-radius: 50%; width: 30px; height: 30px; text-align: center; line-height: 30px; font-weight: bold;">🔎</div>`,
          anchor: new window.naver.maps.Point(15, 15),
        },
      });

      window.naver.maps.Event.addListener(marker, 'click', () => {
        if (infoWindow) {
          infoWindow.setContent(`
            <div style="padding: 10px;">
              <h3 style="margin-bottom: 5px;">${product.pro_title}</h3>
              <p>가격: ${product.pro_price.toLocaleString()}원</p>
              <p>유형: ${product.pro_type}</p>
              <p>면적: ${product.pro_supply_a}㎡</p>
            </div>
          `);
          infoWindow.open(map, marker);
        }
      });

      return marker;
    });

    setMarkers(newMarkers);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(localSearchQuery);
    }
  };

  return (
    <div className="relative">
      {topSearchInput && (
        <div className="absolute right-5 top-5 z-30 w-[250px]">
          <input
            type="text"
            placeholder="지역명을 검색하세요."
            value={localSearchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full border-2 border-black p-2 text-[0.8rem]"
          />
        </div>
      )}
      <div ref={mapRef} className="w-full h-[700px]"></div>
    </div>
  );
};

export default NaverMap;
