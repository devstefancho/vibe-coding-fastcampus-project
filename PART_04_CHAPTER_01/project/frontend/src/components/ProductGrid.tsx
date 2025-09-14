import { Product } from '@/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  title?: string;
}

export default function ProductGrid({ products, title }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {title || '상품을 찾을 수 없습니다'}
        </h2>
        <p className="text-gray-600">다른 카테고리를 확인해보세요.</p>
      </div>
    );
  }

  return (
    <div>
      {title && (
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">{title}</h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}