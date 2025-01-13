'use client';

import { useState, useEffect } from 'react';
import { DetailContent } from './components/DetailContent';
import { Images } from './components/Images';
import { Contact } from './components/Contact';
import { Product } from '@/types/product';

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL;

export default function ProductDetailPage({ params }: { params: { product_id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div>
      <div>
        {isLoading ? (
          <div className="h-[600px] animate-pulse bg-gray-100" />
        ) : product ? (
          <div className="p-6">
            <Images images={product.images} video={product.video} />
            <DetailContent product={product} />
            <Contact phone_number={product.user.phone_number} />
          </div>
        ) : (
          <div>정보를 불러오는데 실패했습니다.</div>
        )}
      </div>
    </div>
  );
}
