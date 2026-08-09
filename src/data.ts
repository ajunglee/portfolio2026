import { FeaturedProject, ScatterProject, ArchiveItem } from './types';

export const HERO_CATEGORIES = [
  { id: 'web-ui', label: 'Web UI/UX', targetId: 'featured' },
  { id: 'visual', label: 'Visual Design', targetId: 'projects' },
  { id: 'motion', label: 'Motion', targetId: 'archive' },
];

export const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    id: 'bx',
    title: 'BX',
    category: 'Brand Experience',
    subtitle: 'Redefining Digital Identity Through Iridescent Systems',
    year: '2025',
    description: 'A comprehensive brand identity redesign for a futuristic art & tech house. Built with flexible visual tokens, multidimensional kinetic logos, and responsive spatial typography.',
    challenge: 'Existing branding lacked cohesive spatial depth and felt flat across modern web, spatial computing, and physical exhibition media.',
    solution: 'Engineered an adaptive light-reactive identity system featuring prismatic chrome gradients, modular layout grids, and motion design guidelines.',
    impact: 'Increased brand recognition by 140% and won multiple International Design Excellence Awards.',
    tags: ['Brand Identity', 'Design System', '3D Motion', 'Art Direction'],
    client: 'Apex Creative Studio',
    role: 'Lead Brand Experience Designer',
    previewBg: 'bg-gradient-to-br from-neutral-800 via-neutral-900 to-black',
    accentColor: '#a855f7',
    images: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop'
    ]
  },
  {
    id: 'uiux',
    title: 'UI/UX',
    category: 'Product Design & System',
    subtitle: 'Deep Web Application Interface for Next-Gen Creators',
    year: '2026',
    description: 'An immersive digital workspace platform featuring zero-friction micro-interactions, real-time spatial canvas tools, and high-performance dark editorial aesthetics.',
    challenge: 'Creators required complex data analysis alongside expressive creative controls without experiencing visual clutter or slow render speeds.',
    solution: 'Designed a high-density, context-aware interface powered by modular micro-drawers, custom glassmorphism layers, and GPU-accelerated canvas components.',
    impact: 'Achieved a 98% user satisfaction rating with a 4.2x increase in daily active session duration.',
    tags: ['Product Design', 'UI Architecture', 'Design System', 'Prototyping'],
    client: 'Digger Labs Inc.',
    role: 'Principal UI/UX Architect',
    previewBg: 'bg-gradient-to-br from-slate-300 via-neutral-400 to-slate-200',
    accentColor: '#3b82f6',
    images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop'
    ]
  },
  {
    id: 'promotion',
    title: 'Promotion',
    category: 'Campaign & Motion',
    subtitle: 'Kinetic Web Launch Campaign for Global Exhibition',
    year: '2025',
    description: 'An interactive campaign platform created to showcase world-class digital artists through WebGL shaders, procedural audio visualizers, and interactive editorial storytelling.',
    challenge: 'Creating a web promotion that matched the grandeur and fidelity of a high-end physical museum gallery.',
    solution: 'Developed an interactive multi-sensory web experience with camera parallax, scroll-driven storytelling, and ambient soundscapes.',
    impact: 'Generated over 2.4M unique web visits in the first week of launch.',
    tags: ['Campaign Design', 'WebGL Experience', 'Motion Design', 'Sound Art'],
    client: 'Subterranean Gallery',
    role: 'Creative Director',
    previewBg: 'bg-gradient-to-br from-neutral-700 via-stone-800 to-neutral-900',
    accentColor: '#ec4899',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop'
    ]
  }
];

export const SCATTER_PROJECTS: ScatterProject[] = [
  {
    id: 'proj-1',
    title: 'Cyber Helmet #124',
    edition: '1 Edition Minted',
    type: 'Digital Art',
    floorPrice: '$4,500',
    auctionPrice: '$9,000',
    stars: 100,
    gradient: 'from-fuchsia-950/80 via-purple-900/60 to-black',
    badge: 'Art',
    description: 'Futuristic iridescent helmet visualization with holographic visor reflection and volumetric dark atmosphere.',
    role: '3D Artist & Motion Designer',
    year: '2026',
    accent: '#d946ef'
  },
  {
    id: 'proj-2',
    title: 'Thalyssra Prism',
    edition: '1 Edition Minted',
    type: 'Art',
    floorPrice: '$4,500',
    auctionPrice: '$9,000',
    stars: 100,
    gradient: 'from-purple-950/90 via-indigo-950/70 to-slate-950',
    badge: 'Art',
    description: 'Iridescent head portrait blending synthetic metallic chrome and neon prismatic refractions.',
    role: '3D Lead Artist',
    year: '2025',
    accent: '#818cf8'
  },
  {
    id: 'proj-3',
    title: 'Thalyssra Goddess',
    edition: '1 Edition Minted',
    type: 'Art',
    floorPrice: '$4,500',
    auctionPrice: '$9,000',
    stars: 100,
    gradient: 'from-blue-950/90 via-purple-950/80 to-black',
    badge: 'Art',
    description: 'Surreal cyberpunk deity adorned in liquid violet gold and crystal particle emissions.',
    role: 'Concept Visual Artist',
    year: '2026',
    accent: '#a855f7'
  },
  {
    id: 'proj-4',
    title: 'Deep Sea Diver',
    edition: '1 Edition Minted',
    type: 'Digital Art',
    floorPrice: '$4,500',
    auctionPrice: '$9,000',
    stars: 100,
    gradient: 'from-cyan-950/90 via-blue-950/70 to-zinc-950',
    badge: 'Art',
    description: 'Atmospheric subterranean explorer gazing into glowing abyssal crystals deep underground.',
    role: 'Visual Director',
    year: '2025',
    accent: '#06b6d4'
  },
  {
    id: 'proj-5',
    title: 'Cyber Metaverse Sphere',
    edition: '1 Edition Minted',
    type: 'Digital Art',
    floorPrice: '$4,500',
    auctionPrice: '$9,000',
    stars: 100,
    gradient: 'from-purple-900/80 via-pink-950/60 to-black',
    badge: 'Art',
    description: 'Intricate particle mesh orb suspended in high-contrast void space with dynamic light rays.',
    role: 'Procedural Shader Specialist',
    year: '2026',
    accent: '#ec4899'
  }
];

export const ARCHIVE_COLUMNS: ArchiveItem[][] = [
  // Column 1
  [
    {
      id: 'arch-1',
      title: 'Neon Portrait Blue & Magenta',
      aspectRatio: 'aspect-[3/4]',
      gradient: 'from-blue-600 via-indigo-900 to-purple-950',
      tag: 'Neon Series',
      overlayStyle: 'bg-gradient-to-t from-blue-950/90 via-transparent to-transparent',
      accentGlow: 'shadow-[0_0_25px_rgba(37,99,235,0.3)]'
    },
    {
      id: 'arch-2',
      title: 'Emerald Prismatic Face',
      aspectRatio: 'aspect-[4/5]',
      gradient: 'from-emerald-500 via-teal-800 to-black',
      tag: 'Chromatics',
      overlayStyle: 'bg-gradient-to-t from-emerald-950/90 via-transparent to-transparent',
      accentGlow: 'shadow-[0_0_25px_rgba(16,185,129,0.3)]'
    },
    {
      id: 'arch-3',
      title: 'Dark Cyber Glitch Portrait',
      aspectRatio: 'aspect-[3/4]',
      gradient: 'from-cyan-600 via-blue-900 to-black',
      tag: 'Distortion',
      overlayStyle: 'bg-gradient-to-t from-cyan-950/90 via-transparent to-transparent',
      accentGlow: 'shadow-[0_0_25px_rgba(6,182,212,0.3)]'
    }
  ],
  // Column 2
  [
    {
      id: 'arch-4',
      title: 'Hot Pink Silhouette',
      aspectRatio: 'aspect-[4/5]',
      gradient: 'from-pink-600 via-rose-900 to-black',
      tag: 'Lighting',
      overlayStyle: 'bg-gradient-to-t from-pink-950/90 via-transparent to-transparent',
      accentGlow: 'shadow-[0_0_25px_rgba(236,72,153,0.3)]'
    },
    {
      id: 'arch-5',
      title: 'Violet Dusk Avatar',
      aspectRatio: 'aspect-[1/1]',
      gradient: 'from-purple-700 via-indigo-950 to-black',
      tag: 'Avatar Study',
      overlayStyle: 'bg-gradient-to-t from-purple-950/90 via-transparent to-transparent',
      accentGlow: 'shadow-[0_0_25px_rgba(168,85,247,0.3)]'
    },
    {
      id: 'arch-6',
      title: 'Spectrum Magenta Glasses',
      aspectRatio: 'aspect-[4/5]',
      gradient: 'from-fuchsia-600 via-purple-900 to-slate-950',
      tag: 'Optics',
      overlayStyle: 'bg-gradient-to-t from-fuchsia-950/90 via-transparent to-transparent',
      accentGlow: 'shadow-[0_0_25px_rgba(217,70,239,0.3)]'
    }
  ],
  // Column 3
  [
    {
      id: 'arch-7',
      title: 'Cyberpunk Sunburst',
      aspectRatio: 'aspect-[3/4]',
      gradient: 'from-[#7B00FF] via-purple-800 to-indigo-950',
      tag: 'Color Shift',
      overlayStyle: 'bg-gradient-to-t from-[#2E005F]/90 via-transparent to-transparent',
      accentGlow: 'shadow-[0_0_25px_rgba(123,0,255,0.35)]'
    },
    {
      id: 'arch-8',
      title: 'Polka Dotted Editorial',
      aspectRatio: 'aspect-[4/5]',
      gradient: 'from-slate-200 via-pink-400 to-slate-900',
      tag: 'Fashion Editorial',
      overlayStyle: 'bg-gradient-to-t from-slate-950/90 via-transparent to-transparent',
      accentGlow: 'shadow-[0_0_25px_rgba(244,114,182,0.3)]'
    },
    {
      id: 'arch-9',
      title: 'Neon Green Goggles',
      aspectRatio: 'aspect-[3/4]',
      gradient: 'from-lime-400 via-emerald-800 to-black',
      tag: 'Futurism',
      overlayStyle: 'bg-gradient-to-t from-lime-950/90 via-transparent to-transparent',
      accentGlow: 'shadow-[0_0_25px_rgba(132,204,22,0.3)]'
    }
  ],
  // Column 4
  [
    {
      id: 'arch-10',
      title: 'Gold Chrome Visor',
      aspectRatio: 'aspect-[4/5]',
      gradient: 'from-[#C084FC] via-[#7B00FF] to-black',
      tag: 'Metallic Art',
      overlayStyle: 'bg-gradient-to-t from-[#2E005F]/90 via-transparent to-transparent',
      accentGlow: 'shadow-[0_0_25px_rgba(123,0,255,0.35)]'
    },
    {
      id: 'arch-11',
      title: 'Monochrome Specular Portrait',
      aspectRatio: 'aspect-[1/1]',
      gradient: 'from-slate-400 via-slate-700 to-slate-950',
      tag: 'Greyscale',
      overlayStyle: 'bg-gradient-to-t from-black/90 via-transparent to-transparent',
      accentGlow: 'shadow-[0_0_25px_rgba(255,255,255,0.2)]'
    },
    {
      id: 'arch-12',
      title: 'Laser Cyan Profile',
      aspectRatio: 'aspect-[4/5]',
      gradient: 'from-sky-400 via-blue-800 to-black',
      tag: 'Photonic',
      overlayStyle: 'bg-gradient-to-t from-sky-950/90 via-transparent to-transparent',
      accentGlow: 'shadow-[0_0_25px_rgba(56,189,248,0.3)]'
    }
  ]
];

export const CONTACT_INFO = {
  phone: '010-5670-8349',
  email: 'ajung1306@naver.com',
  location: 'Seoul, Republic of Korea',
  socials: [
    { name: 'Behance', url: '#' },
    { name: 'Instagram', url: '#' },
    { name: 'GitHub', url: '#' },
    { name: 'LinkedIn', url: '#' }
  ]
};

export const CONTACT_CRYSTALS = [
  { color: 'from-[#C084FC] to-[#7B00FF]', glow: 'rgba(123, 0, 255, 0.65)', label: 'Quartz' },
  { color: 'from-purple-500 to-fuchsia-700', glow: 'rgba(192, 132, 252, 0.6)', label: 'Amethyst' },
  { color: 'from-slate-200 to-slate-400', glow: 'rgba(241, 245, 249, 0.6)', label: 'Diamond' },
  { color: 'from-cyan-400 to-blue-600', glow: 'rgba(56, 189, 248, 0.6)', label: 'Sapphire' },
  { color: 'from-[#A855F7] to-[#5B00BD]', glow: 'rgba(123, 0, 255, 0.65)', label: 'Citrine' }
];
