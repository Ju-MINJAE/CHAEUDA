'use client';

import { Pro_type, Pro_heat, Product } from '@/types/product';

interface DetailContentProps {
  product: Product;
}

export const DetailContent = ({ product }: DetailContentProps) => {
  const formatDate = (dateString: string) => {
    return dateString.slice(0, 10).replace(/-/g, '/');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold mt-6">{product.pro_title}</h2>
        <p className="text-gray-400 text-xs space-x-1 pb-4">
          등록날짜: <span>{formatDate(product.created_at)}</span>
          <span> | </span>
          <span>수정날짜: {formatDate(product.updated_at)}</span>
        </p>
        <div className="border-t pt-6 space-y-2">
          <div className="flex">
            <span className="w-[115px] font-semibold">매매</span>
            <span>{product.pro_price.toLocaleString()}원</span>
          </div>
          <div className="flex">
            <span className="w-[115px] font-semibold">관리비</span>
            <span>
              {product.management_cost ? `${product.management_cost.toLocaleString()}원` : '0원'}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t pt-6 space-y-2">
        <div className="flex">
          <span className="w-[115px] font-semibold">건물 유형</span>
          <span>{Pro_type[product.pro_type]}</span>
        </div>
        <div className="flex">
          <span className="w-[115px] font-semibold">건축연도</span>
          <span>{product.pro_construction_year}년</span>
        </div>
        <div className="flex">
          <span className="w-[115px] font-semibold">공급면적</span>
          <span>{product.pro_supply_a}㎡</span>
        </div>
        <div className="flex">
          <span className="w-[115px] font-semibold">부지면적</span>
          <span>{product.pro_site_a}㎡</span>
        </div>
        <div className="flex">
          <span className="w-[115px] font-semibold">층</span>
          <span>{product.pro_floor}층</span>
        </div>
        <div className="flex">
          <span className="w-[115px] font-semibold">방/욕실 수</span>
          <span>
            {product.pro_rooms}개/{product.pro_bathrooms}개
          </span>
        </div>
        <div className="flex">
          <span className="w-[115px] font-semibold">난방 방식</span>
          <span>{Pro_heat[product.pro_heat]}</span>
        </div>
      </div>

      <div className="border-t pt-6 space-y-2">
        <span className="w-[115px] block mb-3 font-semibold">상세 설명</span>
        <span className="text-sm">{product.description}</span>
      </div>

      <div className="flex border-t pt-6">
        <span className="w-[115px] font-semibold">위치정보</span>
        <div className="flex flex-col">
          <span className="text-sm">{product.add_new}</span>
          <span className="text-sm">{product.add_old}</span>
        </div>
      </div>

      <div className="flex border-t py-6">
        <span className="w-[115px] font-semibold">판매자</span>
        <span>{product.user.username}</span>
      </div>
    </div>
  );
};
