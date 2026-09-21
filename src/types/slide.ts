export interface Slide {
  id: string;
  title?: string | null;
  imageUrl: string;
  imageUrlMobile?: string | null;
  linkUrl?: string | null;
  position: number;
  isActive: boolean;
  createdAt: string;
}