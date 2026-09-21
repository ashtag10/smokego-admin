export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  image?: string | null;
  position: number;
  isActive: boolean;
  createdAt: string;
  children?: Category[]; // rempli côté API pour l'arbre catégorie > sous-catégories
}