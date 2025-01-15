import { SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';

interface PostDetailFormProps {
  onSubmitData: (data: DetailData) => void;
}

export interface DetailData {
  pro_title: string;
  pro_price: number;
  management_cost?: number;
  pro_type: string;
  pro_supply_a: number;
  pro_site_a: number;
  pro_floor: number;
  pro_rooms: number;
  pro_bathrooms: number;
  pro_heat: string;
  pro_construction_year: number;
  description: string;
}

const PostDetailForm: React.FC<PostDetailFormProps> = ({ onSubmitData }) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedHeat, setSelectedHeat] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DetailData>({
    defaultValues: {
      management_cost: undefined,
    },
  });

  const onSubmit: SubmitHandler<DetailData> = data => {
    onSubmitData(data);
  };

  const handleTypeClick = (value: string) => {
    setSelectedType(value);
    setValue('pro_type', value);

    const currentData = watch();
    onSubmitData({ ...currentData, pro_type: value });
  };

  const handleHeatClick = (value: string) => {
    setSelectedHeat(value);
    setValue('pro_heat', value);

    const currentData = watch();
    onSubmitData({ ...currentData, pro_heat: value });
  };

  const registerWithChange = (name: keyof DetailData) => {
    return {
      ...register(name),
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
        const currentData = watch();
        onSubmitData({ ...currentData, [name]: value });
      },
    };
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-[0.9rem]">
      <h2 className="text-lg font-semibold mb-4">매물 정보</h2>
      <div className="space-y-5 text-[0.9rem]">
        <label htmlFor="pro_title" className="text-[0.95rem] font-semibold text-gray-700">
          제목
          <input
            id="pro_title"
            type="text"
            {...registerWithChange('pro_title')}
            placeholder="제목을 입력해주세요."
            className="w-full border border-gray-300 px-4 py-2 mt-2 mb-4 text-[0.8rem]"
          />
        </label>
        <label htmlFor="pro_price" className="text-[0.95rem] font-semibold text-gray-700">
          매매 ∙ 관리비(선택)
          <div className="grid grid-cols-2 gap-4 mt-2 mb-4 text-[0.8rem]">
            <input
              id="pro_price"
              type="number"
              onWheel={e => e.currentTarget.blur()}
              {...registerWithChange('pro_price')}
              placeholder="매매 가격을 입력해주세요."
              className="border border-gray-300 px-4 py-2"
            />
            <input
              id="management_cost"
              type="number"
              onWheel={e => e.currentTarget.blur()}
              placeholder="관리비용을 입력해주세요."
              className="border border-gray-300 px-4 py-2"
            />
          </div>
        </label>
        <div>
          <fieldset className="text-[0.95rem] font-semibold text-gray-700">
            <legend>건물 유형</legend>
            <div className="flex gap-3 mt-2 text-[0.8rem]">
              {[
                { value: 'detached', label: '단독주택' },
                { value: 'multi', label: '다세대주택' },
                { value: 'type_etc', label: '기타' },
              ].map(option => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="pro_type"
                    value={option.value}
                    checked={selectedType === option.value}
                    onChange={() => handleTypeClick(option.value)}
                    className="hidden"
                  />
                  <span
                    className={`block w-[80px] text-center py-2 border ${
                      selectedType === option.value
                        ? 'border-blue-500 bg-blue-100'
                        : 'border-gray-300'
                    }`}
                  >
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label htmlFor="pro_supply_a" className="text-[0.95rem] font-semibold text-gray-700">
            공급면적(㎡)
            <input
              id="pro_supply_a"
              type="number"
              onWheel={e => e.currentTarget.blur()}
              {...registerWithChange('pro_supply_a')}
              placeholder="면적을 입력해주세요."
              className="w-full border border-gray-300 px-4 py-2 mt-2 mb-4 text-[0.8rem]"
            />
          </label>
          <label htmlFor="pro_site_a" className="text-[0.95rem] font-semibold text-gray-700">
            부지면적(㎡)
            <input
              id="pro_site_a"
              type="number"
              onWheel={e => e.currentTarget.blur()}
              {...registerWithChange('pro_site_a')}
              placeholder="면적을 입력해주세요."
              className="w-full border border-gray-300 px-4 py-2 mt-2 mb-4 text-[0.8rem]"
            />
          </label>
        </div>
        <div className="grid grid-cols-3 gap-4 m-0">
          <label htmlFor="pro_floor" className="text-[0.95rem] font-semibold text-gray-700">
            층 수
            <input
              id="pro_floor"
              type="number"
              onWheel={e => e.currentTarget.blur()}
              {...registerWithChange('pro_floor')}
              placeholder="층 수를 입력해주세요."
              className="w-full border border-gray-300 px-4 py-2 mt-2 mb-4 text-[0.8rem]"
            />
          </label>
          <label htmlFor="pro_rooms" className="text-[0.95rem] font-semibold text-gray-700">
            방 수
            <input
              id="pro_rooms"
              type="number"
              onWheel={e => e.currentTarget.blur()}
              {...registerWithChange('pro_rooms')}
              placeholder="방 수를 입력해주세요."
              className="w-full border border-gray-300 px-4 py-2 mt-2 mb-4 text-[0.8rem]"
            />
          </label>
          <label htmlFor="pro_bathrooms" className="text-[0.95rem] font-semibold text-gray-700">
            욕실 수
            <input
              id="pro_bathrooms"
              type="number"
              onWheel={e => e.currentTarget.blur()}
              {...registerWithChange('pro_bathrooms')}
              placeholder="욕실 수를 입력해주세요."
              className="w-full border border-gray-300 px-4 py-2 mt-2 mb-4 text-[0.8rem]"
            />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <fieldset className="text-[0.95rem] font-semibold text-gray-700">
            <legend>난방 방식</legend>
            <div className="flex gap-3 mt-2 text-[0.8rem]">
              {[
                { value: 'gas', label: '가스보일러' },
                { value: 'oil', label: '기름보일러' },
                { value: 'briquette', label: '연탄보일러' },
                { value: 'heat_etc', label: '기타' },
              ].map(option => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="pro_heat"
                    value={option.value}
                    checked={selectedHeat === option.value}
                    onChange={() => handleHeatClick(option.value)}
                    className="hidden"
                  />
                  <span
                    className={`block w-[80px] text-center py-2 border ${
                      selectedHeat === option.value
                        ? 'border-blue-500 bg-blue-100'
                        : 'border-gray-300'
                    }`}
                  >
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <label
            htmlFor="pro_construction_year"
            className="text-[0.95rem] font-semibold text-gray-700"
          >
            건축 연도
            <input
              id="pro_construction_year"
              type="number"
              onWheel={e => e.currentTarget.blur()}
              {...registerWithChange('pro_construction_year')}
              placeholder="건축 연도를 입력해주세요."
              className="w-full border border-gray-300 px-4 py-2 mt-2 mb-4 text-[0.8rem]"
            />
          </label>
        </div>
        <label htmlFor="description" className="text-[0.95rem] font-semibold text-gray-700">
          상세 설명
          <textarea
            id="description"
            {...registerWithChange('description')}
            placeholder="집에 대한 상세 설명을 입력해주세요."
            className="w-full border border-gray-300 px-4 py-2 mt-2 text-[0.8rem] min-h-28 resize-none"
          />
        </label>
      </div>
    </form>
  );
};

export default PostDetailForm;
