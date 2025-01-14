import { useState, useEffect } from 'react';
import { DetailContent } from './components/DetailContent';
import { Images } from './components/Images';
import { Dialog } from '@radix-ui/react-dialog';
import { Contact } from './components/Contact';
import { Product } from '@/types/product';
import { X } from 'lucide-react';
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
      <div className="fixed inset-0 flex justify-end mr-[27%] pt-[80px]">
        <div className="relative bg-white w-[300px] overflow-y-auto px-6 pb-6 border ">
          <div className="flex justify-end p-2">
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
