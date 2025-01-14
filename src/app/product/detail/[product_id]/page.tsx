'use client';

import { useState, useEffect } from 'react';
import { DetailContent } from './components/DetailContent';
import { Images } from './components/Images';
import { Contact } from './components/Contact';
import { Product } from '@/types/product';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL;

export default function ProductDetailPage({ params }: { params: { product_id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASEURL}/api/product/detail/${params.product_id}`);
        if (!response.ok) throw new Error('Failed to fetch product');
        const data = await response.json();
        console.log(data.product);
        setProduct(data.product);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [params.product_id]);

  const handleUpdateClick = () => {
    router;
  };

  return (
    <div className="flex flex-col items-center py-5">
      <div className="w-[60%]">
        <div className="flex justify-end mb-4">
          <button className="bg-kick text-white text-sm rounded-lg p-2 flex items-center gap-1">
            <Pencil size={16} />
            수정
          </button>
        </div>
        <div className="border">
          {isLoading ? (
            <div className="h-[600px] animate-pulse bg-gray-100" />
          ) : product ? (
            <div className="px-8 py-6">
              <Images images={product.images} video={product.video} />
              <DetailContent product={product} />
              <Contact
                phone_number={product.user.phone_number}
                productId={Number(product.product_id)}
              />
            </div>
          ) : (
            <div>정보를 불러오는데 실패했습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
}
