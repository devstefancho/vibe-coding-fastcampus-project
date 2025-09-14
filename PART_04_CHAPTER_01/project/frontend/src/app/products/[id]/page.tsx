'use client';

import { useState } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { getProductById, formatPrice } from '@/lib/products';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import ImageMagnifier from '@/components/ImageMagnifier';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const { addItem } = useCart();
  const { showToast } = useToast();
  const router = useRouter();

  // Resolve params promise
  useState(() => {
    params.then(setResolvedParams);
  });

  if (!resolvedParams) {
    return <div>Loading...</div>;
  }

  const product = getProductById(resolvedParams.id);

  if (!product) {
    notFound();
  }

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      showToast('사이즈와 색상을 선택해주세요.', 'error');
      return;
    }

    setIsAddingToCart(true);

    try {
      addItem(product, selectedSize, selectedColor, quantity);

      // Show success message with action options
      showToast('장바구니에 상품이 추가되었습니다!', 'success', {
        actionButton: {
          label: '장바구니 보기',
          onClick: () => router.push('/cart')
        }
      });

      // Reset form
      setSelectedSize('');
      setSelectedColor('');
      setQuantity(1);
    } catch (error) {
      console.error('Error adding to cart:', error);
      showToast('장바구니 추가 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-gray-700">
              홈
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-700">{product.name}</li>
        </ol>
      </nav>

      <div className="space-y-12">
        {/* Product Image with Magnifier */}
        <div className="relative">
          <ImageMagnifier
            src={product.image}
            alt={product.name}
            zoomLevel={2.5}
            zoomAreaSize={350}
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center pointer-events-none z-10">
              <span className="bg-red-500 text-white px-6 py-3 rounded-lg text-lg font-semibold">
                품절
              </span>
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
            <p className="text-2xl font-semibold text-blue-600">{formatPrice(product.price)}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">상품 설명</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {product.inStock && (
            <div className="space-y-6">
              {/* Size Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">사이즈</h3>
                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-3 border rounded-lg text-center font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">색상</h3>
                <div className="flex space-x-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`py-2 px-4 border rounded-lg font-medium transition-colors ${
                        selectedColor === color
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">수량</h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-gray-200 text-gray-700 w-10 h-10 rounded-full hover:bg-gray-300 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="bg-gray-200 text-gray-700 w-10 h-10 rounded-full hover:bg-gray-300 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="w-full bg-blue-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingToCart ? '추가 중...' : '장바구니에 담기'}
              </button>
            </div>
          )}

          {!product.inStock && (
            <div className="text-center py-8">
              <p className="text-red-600 text-lg font-semibold mb-4">현재 품절된 상품입니다</p>
              <Link
                href="/"
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                다른 상품 보기
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}