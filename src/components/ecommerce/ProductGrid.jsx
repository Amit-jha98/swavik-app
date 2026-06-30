import { ProductCard } from '@/components/luxury/ProductCard';
import { ProductGallery } from '@/components/luxury/ProductGallery';
import { useProducts } from '@/hooks/useProducts';

export function ProductGrid({ category, onSelect }) {
  const { products } = useProducts({ category });
  return (
    <div>
      <ProductGallery>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onSelect={onSelect} />
        ))}
      </ProductGallery>
    </div>
  );
}
