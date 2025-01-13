import { useState, useEffect } from 'react';
import { DetailContent } from './components/DetailContent';
import { Images } from './components/Images';
import { Dialog } from '@radix-ui/react-dialog';
import { Contact } from './components/Contact';
import { Product } from '@/types/product';
const BASEURL = process.env.NEXT_PUBLIC_BASE_URL;

interface ProductDetailModalProps {
  productId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductDetailModal = ({ productId, isOpen, onClose }: ProductDetailModalProps) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (isOpen && productId) {
        setIsLoading(true);
        try {
          const response = await fetch(`${BASEURL}/api/product/detail/${productId}`);
          if (!response.ok) throw new Error('API 요청 실패');
          const data = await response.json();
          setProduct(data.product);
        } catch (error) {
          console.error('API 요청 에러:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProduct();
  }, [productId, isOpen]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="z-50 flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-4xl overflow-hidden">
          {isLoading ? (
            <div className="h-[600px] animate-pulse bg-gray-100" />
          ) : product ? (
            <>
              <Images images={product.images} video={product.video} />
              <DetailContent product={product} />
              <Contact phone_number={product.user.phone_number} />
            </>
          ) : (
            <div className="h-[600px] flex items-center justify-center">
              정보를 불러오는데 실패했습니다.
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
};
