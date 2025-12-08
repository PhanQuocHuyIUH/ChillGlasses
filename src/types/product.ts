export interface Product {
  id: number;
  name: string;
  slug: string;

  price: number;
  formattedPrice: string;

  originalPrice: number;
  formattedOriginalPrice: string;

  brand: string;
  brandName: string;

  categoryId: number;
  categoryName: string;

  stockQuantity: number;

  description: string;

  rating: number;
  reviewCount: number;

  isActive: boolean;

  images: ProductImage[];

  primaryImageUrl: string;

  createdAt: string;
}

export interface ProductImage {
  imageUrl: string;
  altText: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface ProductFilterValues {
  searchTerm: string;

  categoryId?: number;
  categoryName: string;

  brand?: string;

  minPrice?: number;
  maxPrice?: number;

  inStock?: boolean; // stockQuantity > 0
}

