export type ProductCategory = "CHICHA" | "SAVEUR" | "ACCESSOIRE" | "PACK";
export type Intensity = "LIGHT" | "MEDIUM" | "STRONG";

export interface ProductVariant {
  id: string;
  name: string;
  price: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  promoPrice: string | null;
  promoStart: string | null;
  promoEnd: string | null;
  category: ProductCategory; // @deprecated — garder tant que la migration n'est pas finie côté backend
  categoryId: string | null;       // NOUVEAU — catégorie principale
  subcategoryId: string | null;
  brand: string | null;
  images: string[];
  stock: number;
  isFeatured: boolean;
  isPopular: boolean;
  isActive: boolean;
  variants?: ProductVariant[];
  createdAt: string;
}

export interface ProductComponent {
  id: string;
  componentProductId: string;
  quantity: number;
  componentProduct: Product;
}