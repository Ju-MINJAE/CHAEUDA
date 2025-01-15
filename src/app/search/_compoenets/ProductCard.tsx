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

function formatPrice(price: number): string {
  if (price >= 100000000) {
    return `${price / 100000000}억`;
  } else if (price >= 10000) {
    return `${price / 10000}만`;
  } else {
    return price.toLocaleString();
  }
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const formatDate = (dateString: string) => {
    return dateString.slice(0, 10).replace(/-/g, '/');
  };

  return (
    <div
      onClick={onClick}
      className="w-full rounded-lg cursor-pointer shadow-md border overflow-hidden relative transition-transform duration-300 hover:-translate-y-1"
    >
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
      <div className="flex flex-col p-3 relative">
        <h3 className="font-bold">{formatPrice(product.pro_price)}</h3>
        <p className="text-sm mt-1">{product.add_new}</p>
        <div className="flex justify-between items-center flex-wrap lg:flex-nowrap">
          <div className="text-sm mt-1 flex flex-wrap md:flex-nowrap">
            <p className="mr-1">{Pro_type[product.pro_type]} </p>
            <p> | {product.pro_supply_a}㎡</p>
          </div>

          <p className="text-xs mt-1 text-gray-400">등록일: {formatDate(product.created_at)}</p>
        </div>
      </div>
    </div>
  );
};
