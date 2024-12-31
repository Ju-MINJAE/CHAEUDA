import { useState } from 'react';
import { FirstSelectRegion, SecondSelectRegion } from './SelectRegion';

const RegionFilterForm = () => {
  const [selectedCategory, setSelectedCategory] = useState('default');

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const selectedOptions = SecondSelectRegion[selectedCategory] || [];

  return (
    <form className="mb-3 space-x-3">
      <select
        className="w-[140px] p-[10px] text-[0.8rem] bg-[#f4f4f4]"
        onChange={e => handleCategoryChange(e.target.value)}
      >
        {FirstSelectRegion.map(item => (
          <option key={item.value} value={item.value}>
            {item.name}
          </option>
        ))}
      </select>

      <select className="w-[140px] p-[10px] text-[0.8rem] bg-[#f4f4f4]">
        {selectedOptions.map(item => (
          <option key={item.value} value={item.value}>
            {item.name}
          </option>
        ))}
      </select>
    </form>
  );
};

export default RegionFilterForm;
