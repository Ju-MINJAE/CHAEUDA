import { useState, useEffect } from 'react';
import { DetailContent } from './components/DetailContent';
import { Images } from './components/Images';
import { Dialog } from '@radix-ui/react-dialog';
import { Contact } from './components/Contact';
import { Product } from '@/types/product';
import { Heart, X } from 'lucide-react';
import useAccessToken from '@/hooks/useAccessToken';
import { useRouter } from 'next/navigation';

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL;

interface ProductDetailModalProps {
  productId: number;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductDetailModal = ({ productId, isOpen, onClose }: ProductDetailModalProps) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const accessToken = useAccessToken();
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      if (isOpen && productId) {
        setIsLoading(true);
        try {
          const response = await fetch(`${BASEURL}/api/product/detail/${productId}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          if (!response.ok) throw new Error('API 요청 실패');
          const data = await response.json();
          console.log('상품 정보:', data);
          setProduct(data.product);
          setIsLiked(data.is_liked);
        } catch (error) {
          console.error('API 요청 에러:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProduct();
  }, [productId, isOpen]);

  const handleLikeToggle = async () => {
    if (!accessToken) {
      alert('로그인이 필요한 서비스입니다.');
      router.push('/auth/signIn');
      return;
    }

    try {
      const response = await fetch(`${BASEURL}/api/product/like/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        // body: JSON.stringify({ isLiked: !isLiked }),
      });

      if (!response.ok) throw new Error('좋아요 실패');

      const data = await response.json();
      console.log('좋아요 결과:', data);
      setIsLiked(data.is_liked);
    } catch (error) {
      console.error('좋아요 에러:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 flex justify-end mr-[26%] pt-[80px]">
        <div className="relative bg-white w-[300px] overflow-y-auto px-5 py-2 border shadow-md">
          <div className="flex justify-between py-2">
            <button onClick={handleLikeToggle}>
              <Heart
                size={20}
                className={`${isLiked ? 'text-kick fill-current' : 'text-gray-600 hover:text-kick'}`}
                fill={isLiked ? 'currentColor' : 'none'}
              />
            </button>
            <button onClick={onClose}>
              <X size={20} className="text-gray-600 hover:text-kick" />
            </button>
          </div>
          {isLoading ? (
            <div className="h-[600px] animate-pulse bg-gray-100" />
          ) : product ? (
            <div className="bg-white">
              <Images images={product.images} video={product.video} />
              <DetailContent product={product} />
              <Contact phone_number={product.user.phone_number} productId={productId} />
            </div>
          ) : (
            <div>정보를 불러오는데 실패했습니다.</div>
          )}
        </div>
      </div>
    </Dialog>
  );
};
