import { useState } from 'react';
import { FirstSelectRegion, SecondSelectRegion } from './SelectRegion';
import { Location } from '@/types/product';

interface RegionFilterProps {
  onRegionSelect: (location: Location) => void;
}

const RegionFilter = ({ onRegionSelect }: RegionFilterProps) => {
  const [selectedCategory, setSelectedCategory] = useState('default');
  const [selectedSecondRegion, setSelectedSecondRegion] = useState('');

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
        onRegionSelect({
          latitude: selectedRegion.latitude,
          longitude: selectedRegion.longitude,
        });
      }
    }
  };

  const selectedOptions = SecondSelectRegion[selectedCategory] || [];

  return (
    <div className="mb-3 space-x-3">
      <select
        className="w-[140px] p-[10px] text-[0.8rem] bg-[#f4f4f4]"
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
        className="w-[140px] p-[10px] text-[0.8rem] bg-[#f4f4f4]"
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
  );
};

export default RegionFilter;
