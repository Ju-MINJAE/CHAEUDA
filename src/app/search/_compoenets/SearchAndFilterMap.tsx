'use client';

import { useState, useEffect, useRef } from 'react';
import { Location } from '@/types/product';
import { FirstSelectRegion, SecondSelectRegion } from '@/containers/forms/SelectRegion';

interface Property {
  id: number;
  location: Location;
  title: string;
  price: number;
}

interface SearchAndFilterMapProps {
  onRegionSelect: (location: Location) => void;
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
  properties: Property[];
  isLoading: boolean;
}

declare global {
  interface Window {
    naver: typeof naver;
  }
}

const SearchAndFilterMap = ({
  onRegionSelect,
  initialCenter = { lat: 37.683834, lng: 126.776557 },
  initialZoom = 12,
  properties,
  isLoading,
}: SearchAndFilterMapProps) => {
  const [selectedCategory, setSelectedCategory] = useState('default');
  const [selectedSecondRegion, setSelectedSecondRegion] = useState('');
  const [mapCenter, setMapCenter] = useState(initialCenter);
  const [zoom, setZoom] = useState(initialZoom);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<naver.maps.Map | null>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedSecondRegion('');
  };

  const handleSecondRegionChange = (value: string) => {
    setSelectedSecondRegion(value);

    if (value) {
      const selectedRegion = SecondSelectRegion[selectedCategory]?.find(
        region => region.value === value,
      );

      if (selectedRegion?.latitude && selectedRegion?.longitude) {
        const newLocation = {
          latitude: selectedRegion.latitude,
          longitude: selectedRegion.longitude,
        };
        onRegionSelect(newLocation);
        setMapCenter({ lat: newLocation.latitude, lng: newLocation.longitude });
        setZoom(14);
      }
    }
  };

  const addMarkers = (map: naver.maps.Map, properties: Property[]) => {
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    properties.forEach(property => {
      if (
        property.location &&
        typeof property.location.latitude === 'number' &&
        typeof property.location.longitude === 'number'
      ) {
        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(
            property.location.latitude,
            property.location.longitude,
          ),
          map: map,
        });

        markersRef.current.push(marker);
      }
    });
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    const initializeMap = () => {
      if (!window.naver || !mapRef.current) return;

      const mapOptions = {
        center: new window.naver.maps.LatLng(mapCenter.lat, mapCenter.lng),
        zoom: zoom,
        zoomControl: false,
      };

      mapInstanceRef.current = new window.naver.maps.Map(mapRef.current, mapOptions);
      if (Array.isArray(properties)) {
        addMarkers(mapInstanceRef.current, properties);
      }
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
      initializeMap();
    }
  }, [mapCenter, zoom]);

  useEffect(() => {
    if (mapInstanceRef.current && Array.isArray(properties)) {
      addMarkers(mapInstanceRef.current, properties);
    }
  }, [properties]);

  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter(new window.naver.maps.LatLng(mapCenter.lat, mapCenter.lng));
      mapInstanceRef.current.setZoom(zoom);
    }
  }, [mapCenter, zoom]);

  const selectedOptions = SecondSelectRegion[selectedCategory] || [];

  return (
    <div className="space-y-3">
      <div className="flex space-x-3 ml-2">
        <select
          className="w-[140px] p-3 text-[0.8rem] bg-[#f4f4f4] shadow-sm border"
          onChange={e => handleCategoryChange(e.target.value)}
          value={selectedCategory}
        >
          {FirstSelectRegion.map(item => (
            <option key={item.value} value={item.value}>
              {item.name}
            </option>
          ))}
        </select>

        <select
          className="w-[140px] p-3 text-[0.8rem] bg-[#f4f4f4] shadow-sm border"
          onChange={e => handleSecondRegionChange(e.target.value)}
          value={selectedSecondRegion}
        >
          <option value="">지역을 선택하세요</option>
          {selectedOptions.map(item => (
            <option key={item.value} value={item.value}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <div ref={mapRef} className="w-full h-[650px] relative shadow-sm">
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilterMap;
