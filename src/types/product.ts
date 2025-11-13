// DEMO PURPOSES ONLY. ADJUST AS NEEDED FOR APPLICATION.
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  brand: string;
  category: string;
  imageUrl: string;
  stock: number;
  rating: number;
}

export interface ProductFilter {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}
