import { Product } from '@/types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Classic Running Shoes',
    price: 89000,
    description: '편안한 착용감과 뛰어난 쿠셔닝을 제공하는 클래식 러닝화입니다. 일상 운동과 조깅에 완벽한 신발입니다.',
    image: '/shoe-sample.png',
    category: 'running',
    sizes: ['240', '250', '260', '270', '280'],
    colors: ['Black', 'White', 'Gray'],
    inStock: true,
  },
  {
    id: '2',
    name: 'Urban Street Sneakers',
    price: 125000,
    description: '스트릿 패션의 완성, 어반 스니커즈입니다. 세련된 디자인과 편안한 착용감을 동시에 만족시킵니다.',
    image: '/shoe-sample.png',
    category: 'casual',
    sizes: ['240', '250', '260', '270', '280', '290'],
    colors: ['Black', 'White', 'Red', 'Blue'],
    inStock: true,
  },
  {
    id: '3',
    name: 'Professional Dress Shoes',
    price: 189000,
    description: '비즈니스와 정장 스타일에 어울리는 프리미엄 드레스 슈즈입니다. 고급 가죽 소재로 제작되었습니다.',
    image: '/shoe-sample.png',
    category: 'dress',
    sizes: ['250', '260', '270', '280'],
    colors: ['Black', 'Brown'],
    inStock: true,
  },
  {
    id: '4',
    name: 'Hiking Boots',
    price: 159000,
    description: '산행과 아웃도어 활동을 위한 등산화입니다. 방수 기능과 미끄럼 방지 밑창으로 안전한 산행을 보장합니다.',
    image: '/shoe-sample.png',
    category: 'outdoor',
    sizes: ['240', '250', '260', '270', '280', '290'],
    colors: ['Brown', 'Green', 'Black'],
    inStock: true,
  },
  {
    id: '5',
    name: 'Basketball High-tops',
    price: 149000,
    description: '농구를 위한 하이탑 스니커즈입니다. 발목 보호와 뛰어난 그립력으로 코트에서 최고의 퍼포먼스를 발휘합니다.',
    image: '/shoe-sample.png',
    category: 'sports',
    sizes: ['250', '260', '270', '280', '290'],
    colors: ['White', 'Black', 'Red'],
    inStock: true,
  },
  {
    id: '6',
    name: 'Casual Loafers',
    price: 95000,
    description: '편안한 일상복과 완벽하게 어울리는 캐주얼 로퍼입니다. 부드러운 가죽과 편안한 쿠셔닝이 특징입니다.',
    image: '/shoe-sample.png',
    category: 'casual',
    sizes: ['240', '250', '260', '270', '280'],
    colors: ['Brown', 'Navy', 'Black'],
    inStock: false,
  },
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ko-KR').format(price) + '원';
};