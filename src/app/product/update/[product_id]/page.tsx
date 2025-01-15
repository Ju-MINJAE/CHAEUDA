'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Pro_heat, Pro_type } from '@/types/product';
import useAccessToken from '@/hooks/useAccessToken';
import { Pencil } from 'lucide-react';

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL;

const TYPE_OPTIONS = Object.entries(Pro_type).map(([value, label]) => ({
  value,
  label,
}));

const HEAT_OPTIONS = Object.entries(Pro_heat).map(([value, label]) => ({
  value,
  label,
}));

interface Product {
  product_id: number;
  images: string[];
  video: string | null;
  pro_title: string;
  pro_price: number;
  management_cost: number;
  pro_supply_a: number;
  pro_site_a: number;
  pro_heat: string;
  pro_type: string;
  pro_floor: number;
  description: string;
  sale: boolean;
  pro_rooms: number;
  pro_bathrooms: number;
  pro_construction_year: number;
  add_new: string;
  add_old: string;
  phone_number: string;
  latitude: number;
  longitude: number;
}

export default function ProductUpdatePage({ params }: { params: { product_id: number } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const accessToken = useAccessToken();

  useEffect(() => {
    const productData = searchParams.get('product');
    if (productData) {
      try {
        setProduct(JSON.parse(decodeURIComponent(productData)));
      } catch (error) {
        console.error('Product data parsing error:', error);
        router.back();
      }
    } else {
      router.back();
    }
    console.log('product', product);
  }, [searchParams, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct(prev =>
      prev
        ? {
            ...prev,
            [name]:
              name === 'management_cost' ||
              name === 'pro_floor' ||
              name === 'pro_rooms' ||
              name === 'pro_bathrooms' ||
              name === 'pro_construction_year' ||
              name === 'pro_site_a' ||
              name === 'pro_supply_a'
                ? Number(value)
                : value,
          }
        : null,
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!product) return;

    const formData = new FormData();

    const updatedProduct = {
      pro_title: product.pro_title,
      pro_price: product.pro_price,
      management_cost: product.management_cost,
      pro_type: product.pro_type,
      pro_supply_a: product.pro_supply_a,
      pro_site_a: product.pro_site_a,
      pro_floor: product.pro_floor,
      pro_rooms: product.pro_rooms,
      pro_bathrooms: product.pro_bathrooms,
      pro_heat: product.pro_heat,
      pro_construction_year: product.pro_construction_year,
      description: product.description,
      add_new: product.add_new,
      add_old: product.add_old,
      latitude: product.latitude,
      longitude: product.longitude,
    };

    formData.append('data', JSON.stringify(updatedProduct));

    try {
      const response = await fetch(`${BASEURL}/api/product/update/${params.product_id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(updatedProduct);
        throw new Error(errorData.message || '상품 수정 실패');
      }
      router.push(`/product/detail/${params.product_id}`);
    } catch (error) {
      console.error('상품 수정 중 오류:', error);
    }
  };

  return (
    <div className="w-[800px] mx-auto p-10">
      <h1 className="text-2xl text-kick font-bold mb-4">매물 정보 수정</h1>
      <form onSubmit={handleSubmit} className="space-y-5 text-[0.9rem] ">
        <label htmlFor="pro_title" className="text-[0.95rem]">
          제목
          <input
            id="pro_title"
            name="pro_title"
            type="text"
            value={product?.pro_title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2 mt-2 mb-4 text-[0.8rem]"
          />
        </label>
        <label htmlFor="pro_price" className="text-[0.95rem]">
          매매 ∙ 관리비(선택)
          <div className="grid grid-cols-2 gap-4 mt-2 mb-4 text-[0.8rem]">
            <input
              id="pro_price"
              name="pro_price"
              type="number"
              value={product?.pro_price}
              onChange={handleChange}
              required
              onWheel={e => e.currentTarget.blur()}
              className="border border-gray-300 px-4 py-2"
            />
            <input
              id="management_cost"
              name="management_cost"
              type="number"
              value={product?.management_cost ?? ''}
              onChange={handleChange}
              onWheel={e => e.currentTarget.blur()}
              className="border border-gray-300 px-4 py-2"
            />
          </div>
        </label>
        <div>
          <fieldset className="text-[0.95rem]">
            <legend>건물 유형</legend>
            <div className="flex gap-3 mt-2 text-[0.8rem]">
              {TYPE_OPTIONS.map(option => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    id="pro_type"
                    name="pro_type"
                    type="radio"
                    value={option.value}
                    checked={product?.pro_type === option.value}
                    onChange={e => handleChange(e)}
                    className="hidden"
                  />
                  <span
                    className={`block w-[80px] text-center py-2 border ${
                      product?.pro_type === option.value
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
          <label htmlFor="pro_supply_a" className="text-[0.95rem]">
            평수(공급면적)
            <input
              id="pro_supply_a"
              name="pro_supply_a"
              type="number"
              value={product?.pro_supply_a}
              onChange={handleChange}
              required
              onWheel={e => e.currentTarget.blur()}
              className="w-full border border-gray-300 px-4 py-2 mt-2 mb-4 text-[0.8rem]"
            />
          </label>
          <label htmlFor="pro_site_a" className="text-[0.95rem]">
            부지면적
            <input
              id="pro_site_a"
              name="pro_site_a"
              type="number"
              value={product?.pro_site_a}
              onChange={handleChange}
              required
              onWheel={e => e.currentTarget.blur()}
              className="w-full border border-gray-300 px-4 py-2 mt-2 mb-4 text-[0.8rem]"
            />
          </label>
        </div>
        <div className="grid grid-cols-3 gap-4 m-0">
          <label htmlFor="pro_floor" className="text-[0.95rem]">
            층 수
            <input
              id="pro_floor"
              name="pro_floor"
              type="number"
              value={product?.pro_floor}
              onChange={handleChange}
              required
              onWheel={e => e.currentTarget.blur()}
              className="w-full border border-gray-300 px-4 py-2 mt-2 mb-4 text-[0.8rem]"
            />
          </label>
          <label htmlFor="pro_rooms" className="text-[0.95rem]">
            방 수
            <input
              id="pro_rooms"
              name="pro_rooms"
              type="number"
              value={product?.pro_rooms}
              onChange={handleChange}
              required
              onWheel={e => e.currentTarget.blur()}
              className="w-full border border-gray-300 px-4 py-2 mt-2 mb-4 text-[0.8rem]"
            />
          </label>
          <label htmlFor="pro_bathrooms" className="text-[0.95rem]">
            욕실 수
            <input
              id="pro_bathrooms"
              name="pro_bathrooms"
              type="number"
              value={product?.pro_bathrooms}
              onChange={handleChange}
              required
              onWheel={e => e.currentTarget.blur()}
              className="w-full border border-gray-300 px-4 py-2 mt-2 mb-4 text-[0.8rem]"
            />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <fieldset className="text-[0.95rem]">
            <legend>난방 방식</legend>
            <div className="flex gap-3 mt-2 text-[0.8rem]">
              {HEAT_OPTIONS.map(option => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    id="pro_heat"
                    name="pro_heat"
                    type="radio"
                    value={option.value}
                    checked={product?.pro_heat === option.value}
                    onChange={e => handleChange(e)}
                    className="hidden"
                  />
                  <span
                    className={`block w-[80px] text-center py-2 border ${
                      product?.pro_heat === option.value
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
          <label htmlFor="pro_construction_year" className="text-[0.95rem]">
            건축년도
            <input
              id="pro_construction_year"
              name="pro_construction_year"
              type="number"
              onWheel={e => e.currentTarget.blur()}
              value={product?.pro_construction_year}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 mt-2 mb-4 text-[0.8rem]"
            />
          </label>
        </div>
        <div>
          <label htmlFor="description" className="text-[0.95rem]">
            상세 설명
            <textarea
              id="description"
              name="description"
              value={product?.description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 px-4 py-2 mt-2 text-[0.8rem]"
            />
          </label>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            name="cancel"
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-kick text-white rounded-md flex items-center gap-2"
          >
            <Pencil size={16} />
            수정 완료
          </button>
        </div>
      </form>
    </div>
  );
}
