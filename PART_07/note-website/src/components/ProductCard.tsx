import type { Product } from '../lib/supabase';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <a
      href={product.href}
      target="_blank"
      rel="noopener noreferrer"
      referrerPolicy="unsafe-url"
      className="product-card"
    >
      <img
        src={product.img_src}
        alt={product.alt}
        referrerPolicy="unsafe-url"
      />
      <p>{product.alt}</p>
    </a>
  );
}
