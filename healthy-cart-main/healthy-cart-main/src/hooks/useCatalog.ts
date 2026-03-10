import { useEffect, useState } from "react";
import { apiFetch, resolveApiUrl } from "@/lib/api";
import type { Product, ProductCategoryOption } from "@/types/product";

type CatalogResponse = {
  products: Product[];
  categories: ProductCategoryOption[];
};

export function useCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCatalog() {
      try {
        const data = await apiFetch<CatalogResponse>("/products");

        if (cancelled) {
          return;
        }

        setProducts(
          data.products.map((product) => ({
            ...product,
            image: resolveApiUrl(product.image),
          })),
        );
        setCategories(data.categories);
        setError(null);
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load products.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCatalog();

    return () => {
      cancelled = true;
    };
  }, []);

  return { products, categories, loading, error };
}
