import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { formatPrice } from '@/lib/products';
import LikeButton from './LikeButton';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/products/${product.id}`}>
        <div className="relative h-64 w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />

          {/* 좋아요 버튼 */}
          <div className="absolute top-2 right-2 z-10">
            <LikeButton
              productId={product.id}
              productName={product.name}
              size="md"
            />
          </div>

          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-3 py-1 rounded text-sm font-semibold">
                품절
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-blue-600">
            {product.name}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-blue-600">
            {formatPrice(product.price)}
          </span>

          <div className="flex space-x-1">
            {product.colors.slice(0, 3).map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{
                  backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' :
                                 color.toLowerCase() === 'black' ? '#000000' :
                                 color.toLowerCase() === 'gray' ? '#6b7280' :
                                 color.toLowerCase() === 'red' ? '#ef4444' :
                                 color.toLowerCase() === 'blue' ? '#3b82f6' :
                                 color.toLowerCase() === 'brown' ? '#a3a3a3' :
                                 color.toLowerCase() === 'green' ? '#22c55e' :
                                 color.toLowerCase() === 'navy' ? '#1e3a8a' : '#6b7280'
                }}
                title={color}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="text-xs text-gray-500">+{product.colors.length - 3}</span>
            )}
          </div>
        </div>

        <div className="mt-3">
          <span className="text-sm text-gray-500">
            사이즈: {product.sizes.join(', ')}
          </span>
        </div>
      </div>
    </div>
  );
}