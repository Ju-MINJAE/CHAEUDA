import { Pro_type } from '@/types/product';
import Image from 'next/image';

interface ProductCardProps {
  product: {
    product_id: number;
    images: string;
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
    username: string;
    phone_number: string;
    created_at: string;
    updated_at: string;
  };
  onClick: () => void;
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const formatDate = (dateString: string) => {
    return dateString.slice(0, 10).replace(/-/g, '/');
  };

  return (
    <div onClick={onClick} className="w-full cursor-pointer border overflow-hidden relative">
      <div className="relative h-48">
        <Image
          src={product.images}
          alt={product.pro_title}
          fill
          sizes="100%"
          className="object-cover"
          priority={false}
          style={{ zIndex: 1 }}
        />
      </div>
      <div className="flex flex-col p-2 relative">
        <h3 className="font-bold">{product.pro_price.toLocaleString()}원</h3>
        <p className="text-sm mt-1">{product.add_new}</p>
        <div className="flex justify-between items-center">
          <p className="text-sm mt-1">
            {Pro_type[product.pro_type]} | {product.pro_supply_a}㎡
          </p>
          <p className="text-xs mt-1 text-gray-400">등록일: {formatDate(product.created_at)}</p>
        </div>
      </div>
    </div>
  );
};
