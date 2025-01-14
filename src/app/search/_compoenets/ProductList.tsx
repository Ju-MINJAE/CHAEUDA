import { useEffect, useState } from 'react';
import { ProductCard } from './ProductCard';
import { Location } from '@/types/product';
const BASEURL = process.env.NEXT_PUBLIC_BASE_URL;

interface product {
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
}

interface ProductListProps {
  location: Location;
  onProductClick: (productId: number) => void;
}

export const ProductList = ({ location, onProductClick }: ProductListProps) => {
  const [products, setProducts] = useState<product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNearbyProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${BASEURL}/api/product/nearby?latitude=${location.latitude}&longitude=${location.longitude}&zoom=14`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) throw new Error('Failed to fetch nearby products');
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching nearby products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNearbyProducts();
  }, [location]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-bounce">로딩중</div>
      </div>
    );
  }

  return (
    <div className="flex w-full items-center flex-col space-y-4">
      {products.length > 0 ? (
        products.map(product => (
          <ProductCard
            key={product.product_id}
            product={product}
            onClick={() => onProductClick(product.product_id)}
          />
        ))
      ) : (
        <div>이 지역에는 매물이 없습니다.</div>
      )}
    </div>
  );
};
