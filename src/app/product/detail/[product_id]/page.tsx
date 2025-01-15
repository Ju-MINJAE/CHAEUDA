'use client';

import { useState, useEffect } from 'react';
import { DetailContent } from './components/DetailContent';
import { Images } from './components/Images';
import { Contact } from './components/Contact';
import { Product } from '@/types/product';
import { Pencil, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { deleteRequest } from '@/api/product';
import useAccessToken from '@/hooks/useAccessToken';
import useAuthStore from '@/stores/authStore';

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL;

export default function ProductDetailPage({ params }: { params: { product_id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const accessToken = useAccessToken();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASEURL}/api/product/detail/${params.product_id}`);
        if (!response.ok) throw new Error('Failed to fetch product');
        const data = await response.json();
        console.log('user:', user);
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
    router.push(
      `/product/update/${params.product_id}?product=${encodeURIComponent(JSON.stringify(product))}`,
    );
  };

  const handleDelete = async () => {
    if (!product || !accessToken) return;

    const confirmDelete = confirm('정말 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      const response = await deleteRequest(product.product_id, accessToken);
      if (response.success) {
        alert('매물이 성공적으로 삭제되었습니다.');
        router.push('/mypage/myproducts');
      } else {
        alert(response.message || '삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex flex-col items-center py-5  mx-auto">
      <div className="w-[500px] md:w-[600px] duration-200">
        {user?.email === product?.user.email && (
          <div className="flex justify-end mb-3 gap-3">
            <button
              className="bg-kick text-white text-sm rounded-lg p-2 px-4 flex items-center gap-1"
              onClick={handleUpdateClick}
            >
              <Pencil size={16} />
              수정
            </button>

            <button
              onClick={handleDelete}
              className="bg-gray-500 text-white text-sm rounded-lg p-2 px-4 flex items-center gap-1"
            >
              <X size={16} />
              삭제
            </button>
          </div>
        )}

        <div className="border">
          {isLoading ? (
            <div className="h-[600px] animate-pulse bg-gray-100" />
          ) : product ? (
            <div className="p-8 pb-10">
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
