export interface FeaturedProject {
  id: string;
  title: string;
  category: string;
  subtitle: string;
  year: string;
  description: string;
  challenge: string;
  solution: string;
  impact: string;
  tags: string[];
  client: string;
  role: string;
  previewBg: string; // CSS color gradient / styling
  previewImage?: string;
  hoverImage?: string;
  accentColor: string;
  images: string[];
}

export interface ScatterProject {
  id: string;
  previewImage: string;
  title: string;
  edition: string;
  type: string;
  floorPrice: string;
  auctionPrice: string;
  stars: number;
  gradient: string;
  badge: string;
  description: string;
  role: string;
  year: string;
  accent: string;
}

export interface ArchiveItem {
  id: string;
  title: string;
  aspectRatio: 'aspect-[3/4]' | 'aspect-[4/5]' | 'aspect-[1/1]' | 'aspect-[9/16]';
  gradient: string;
  tag: string;
  overlayStyle: string;
  accentGlow: string;
}
