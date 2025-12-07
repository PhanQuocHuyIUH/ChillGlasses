export interface Product {
  id: number;
  name: string;
  slug: string;

  price: number;
  formattedPrice: string;

  originalPrice: number;
  formattedOriginalPrice: string;

  brand: string;

  categoryId: number;
  categoryName: string;

  stockQuantity: number;

  description: string;

  rating: number;
  reviewCount: number;

  isActive: boolean;

  primaryImageUrl: string;

  createdAt: string; // or Date
}


export interface ProductFilter {
  categoryId?: number;
  brand?: string;

  minPrice?: number;
  maxPrice?: number;

  inStock?: boolean; // stockQuantity > 0
}
