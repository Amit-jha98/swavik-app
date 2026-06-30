import { useEffect, useState } from 'react';
import { fetchProducts } from '@/firebase/firestore';
import { productSeed } from '@/lib/productSeed';

function matchesFilter(product, category) {
  if (!category || category === 'All') {
    return true;
  }

  const needle = category.toLowerCase();
  return [product.category, product.subcategory, product.room, product.mood, ...(product.notes || [])]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(needle));
}

function applyFilters(products, filters) {
  return products.filter((product) => matchesFilter(product, filters.category));
}

export function useProducts(filters = {}) {
  const [products, setProducts] = useState(applyFilters(productSeed, filters));
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadProducts() {
      setStatus('loading');
      try {
        const remoteProducts = await fetchProducts(filters);
        if (!ignore) {
          setProducts(applyFilters(remoteProducts.length ? remoteProducts : productSeed, filters));
          setStatus('ready');
        }
      } catch (nextError) {
        if (!ignore) {
          setError(nextError);
          setProducts(applyFilters(productSeed, filters));
          setStatus('error');
        }
      }
    }

    loadProducts();
    return () => {
      ignore = true;
    };
  }, [filters.category]);

  return { products, status, error };
}
