'use client';

import { Heart } from 'lucide-react';
import { fetchMyProducts } from '@/api/product';
import useAccessToken from '@/hooks/useAccessToken';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MyProduct, Pro_type } from '@/types/product';
const BASEURL = process.env.NEXT_PUBLIC_BASE_URL;

export default function MyProductsPage() {
  const accessToken = useAccessToken();
  const [products, setProducts] = useState<MyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (accessToken) {
      const fetchProducts = async () => {
        setIsLoading(true);
        setError('');
        try {
          const response = await fetchMyProducts(accessToken);

          if (response.success) {
            setProducts(response.products);

            const initialIsLiked: { [key: string]: boolean } = {};
            response.products.forEach((product: MyProduct) => {
              initialIsLiked[product.product_id] = product.is_liked;
            });
            setIsLiked(initialIsLiked);
          } else {
            setError(response.message || 'Failed to fetch products.');
          }
        } catch (err) {
          setError('An error occurred while fetching your products.');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchProducts();
    }
  }, [accessToken, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const handleCardClick = (productId: string) => {
    router.push(`/product/detail/${productId}`);
  };

  // TODO : 좋아요 토글 버튼 연결
  const handleLikeToggle = async (productId: string) => {
    try {
      const response = await fetch(`${BASEURL}/api/product/like/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error('좋아요 실패');

      const data = await response.json();
      setIsLiked(prevIsLiked => ({
        ...prevIsLiked,
        [productId]: data.is_liked,
      }));
    } catch (error) {
      console.error('좋아요 에러:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return dateString.slice(0, 10).replace(/-/g, '/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div
              key={product.product_id}
              onClick={() => handleCardClick(product.product_id)}
              className="group relative bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div className="relative aspect-[4/3]">
                <img
                  src={product.images}
                  alt={product.pro_title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-normal flex-grow">{product.pro_title}</h3>
                  <button
                    className="p-2 bg-white/80 backdrop-blur-sm rounded-full"
                    onClick={e => {
                      e.stopPropagation();
                      handleLikeToggle(product.product_id);
                    }}
                  >
                    <Heart
                      className={`w-5 h-5 ${isLiked[product.product_id] ? 'fill-red-500 stroke-red-500' : 'stroke-gray-600'}`}
                    />
                  </button>
                </div>

                <p className="font-bold">{product.pro_price.toLocaleString()}원</p>

                <div className="flex flex-wrap justify-between text-sm text-gray-600 gap-1">
                  <span>
                    {Pro_type[product.pro_type]} | {product.pro_supply_a}㎡
                  </span>
                  <p className="text-sm text-gray-600">등록일: {formatDate(product.created_at)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">나의 매물이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
