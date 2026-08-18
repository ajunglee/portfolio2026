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
  mockupImage?: string;
  mockupMobileImage?: string;
  title: string;
  subtitle: string;
  tags: string[];
  gradient: string;
  description: string;
  client: string | null;
  year: string;
  contribution: {
    planning: number | null;
    design: number | null;
  };
  colors: Array<{
    name: string;
    hex: string;
  }>;
  fonts: Array<{
    family: string;
    weights: string;
    usage: string;
    size?: number;
  }>;
}

export interface ArchiveItem {
  id: string;
  category: string;
  keywords: [string, string];
  description: string;
  image?: string;
}
