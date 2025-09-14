import ProductGrid from '@/components/ProductGrid';
import { products } from '@/lib/products';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            ShoeMall에 오신 것을 환영합니다
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            최고의 신발을 합리적인 가격에 만나보세요
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <span className="mr-2">🚚</span>
              <span>무료 배송</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">↩️</span>
              <span>무료 반품</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">💳</span>
              <span>안전한 결제</span>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section>
        <ProductGrid products={products} title="전체 상품" />
      </section>
    </div>
  );
}
