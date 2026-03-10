export type ProductWeight = "1kg" | "500g";

export type ProductCategory = "malt" | "flour" | "snack" | "drink";

export type Product = {
  id: string;
  name: string;
  description: string;
  prices: Record<ProductWeight, number>;
  image: string;
  category: ProductCategory;
  rating: number;
  reviews: number;
  isBestSeller?: boolean;
};

export type ProductCategoryOption = {
  value: "all" | ProductCategory;
  label: string;
};
