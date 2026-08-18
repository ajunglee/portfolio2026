import { FeaturedProject, ScatterProject, ArchiveItem } from './types';

const FEATURED_BX_PREVIEW_URL = new URL(
  './images/Featured_img_1.png',
  import.meta.url,
).href;
const FEATURED_BX_HOVER_URL = new URL(
  './images/Featured_img_behind_1.png',
  import.meta.url,
).href;
const PROJECT_PREVIEW_URLS = [
  new URL('./images/project_img1.png', import.meta.url).href,
  new URL('./images/project_img2.png', import.meta.url).href,
  new URL('./images/project_img3.png', import.meta.url).href,
  new URL('./images/project_img4.png', import.meta.url).href,
  new URL('./images/project_img5.png', import.meta.url).href,
] as const;
const PROJECT_JONGNO_FULLPAGE_URL = new URL(
  './images/project_con_jongno.jpg',
  import.meta.url,
).href;
const PROJECT_JONGNO_MOBILE_URL = new URL(
  './images/project_con_jongno_m.png',
  import.meta.url,
).href;
const ARCHIVE_FASHION_URLS = [
  new URL('./images/fashion1.png', import.meta.url).href,
  new URL('./images/fashion2.png', import.meta.url).href,
  new URL('./images/fashion3.png', import.meta.url).href,
  new URL('./images/fashion4.png', import.meta.url).href,
  new URL('./images/fashion5.png', import.meta.url).href,
] as const;
const ARCHIVE_BEAUTY_URLS = [
  new URL('./images/beauty1.png', import.meta.url).href,
  new URL('./images/beauty2.png', import.meta.url).href,
  new URL('./images/beauty3.png', import.meta.url).href,
  new URL('./images/beauty4.png', import.meta.url).href,
  new URL('./images/beauty5.png', import.meta.url).href,
] as const;
const ARCHIVE_PROMOTION_URLS = [
  new URL('./images/Promotion1.png', import.meta.url).href,
  new URL('./images/promotion2.png', import.meta.url).href,
  new URL('./images/promotion3.png', import.meta.url).href,
  new URL('./images/promotion4.png', import.meta.url).href,
  new URL('./images/promotion5.png', import.meta.url).href,
] as const;

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
    subtitle: '한국생산성본부인증원 메인 리뉴얼',
    year: '2025',
    description: 'A comprehensive brand identity redesign for a futuristic art & tech house. Built with flexible visual tokens, multidimensional kinetic logos, and responsive spatial typography.',
    challenge: 'Existing branding lacked cohesive spatial depth and felt flat across modern web, spatial computing, and physical exhibition media.',
    solution: 'Engineered an adaptive light-reactive identity system featuring prismatic chrome gradients, modular layout grids, and motion design guidelines.',
    impact: 'Increased brand recognition by 140% and won multiple International Design Excellence Awards.',
    tags: ['Brand Identity', 'Design System', '3D Motion', 'Art Direction'],
    client: 'Apex Creative Studio',
    role: 'Lead Brand Experience Designer',
    previewBg: 'bg-gradient-to-br from-neutral-800 via-neutral-900 to-black',
    previewImage: FEATURED_BX_PREVIEW_URL,
    hoverImage: FEATURED_BX_HOVER_URL,
    accentColor: '#a855f7',
    images: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop'
    ]
  },
  {
    id: 'motion',
    title: 'MOTION',
    category: 'Motion Design & Direction',
    subtitle: 'Kinetic Visual Systems for Immersive Brand Stories',
    year: '2026',
    description: 'A motion-led visual system combining kinetic typography, dimensional transitions, and rhythmic storytelling for immersive digital brand experiences.',
    challenge: 'The brand needed a flexible motion language that could remain recognizable across short-form content, campaigns, and large-format displays.',
    solution: 'Built a modular motion toolkit with responsive type choreography, procedural transitions, and a scalable timing system for every channel.',
    impact: 'Unified campaign output across formats while increasing viewer retention and repeated engagement with the brand story.',
    tags: ['Motion Design', 'Kinetic Type', 'Art Direction', '3D Animation'],
    client: 'Digger Labs Inc.',
    role: 'Lead Motion Designer',
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

// 상세 설명·발주사·팔레트·폰트는 팝업 레이아웃용 초안입니다.
// 공개 전 실제 프로젝트 명세로 교체하고, 기여도는 확정 수치를 입력합니다.
// 별도 전체 페이지 이미지가 준비되면 각 항목의 mockupImage에 연결합니다.
export const SCATTER_PROJECTS: ScatterProject[] = [
  {
    id: 'proj-1',
    previewImage: PROJECT_PREVIEW_URLS[0],
    title: 'BtoB',
    subtitle: '스마트 산업 지원 통합 플랫폼',
    tags: ['Web', 'UI/UX', 'Responsive'],
    gradient: 'from-fuchsia-950/80 via-purple-900/60 to-black',
    description: '스마트 산업을 준비하는 기업이 사업 정보와 시설·장비 지원을 한곳에서 탐색할 수 있도록 설계한 반응형 통합 플랫폼입니다.',
    client: null,
    year: '2026',
    contribution: { planning: null, design: null },
    colors: [
      { name: 'Core Blue', hex: '#5D63F2' },
      { name: 'Smart Mint', hex: '#49DDB1' },
      { name: 'Deep Ink', hex: '#111318' },
    ],
    fonts: [
      { family: 'Pretendard', weights: '400 · 600 · 800', usage: 'Headline · Body · UI' },
      { family: 'Inter', weights: '500 · 700', usage: 'Number · English' },
    ],
  },
  {
    id: 'proj-2',
    previewImage: PROJECT_PREVIEW_URLS[1],
    title: 'GT온라인',
    subtitle: '글로벌 기술협력 모바일 플랫폼',
    tags: ['Mobile', 'UI/UX', 'Global'],
    gradient: 'from-purple-950/90 via-indigo-950/70 to-slate-950',
    description: '국내 기업의 글로벌 기술협력과 사업화 정보를 한국어와 영어로 빠르게 탐색할 수 있도록 구성한 모바일 중심 플랫폼입니다.',
    client: null,
    year: '2025',
    contribution: { planning: null, design: null },
    colors: [
      { name: 'Global Orange', hex: '#FF5A1F' },
      { name: 'Cooperation Purple', hex: '#5B2A86' },
      { name: 'Charcoal', hex: '#202124' },
    ],
    fonts: [
      { family: 'Pretendard', weights: '400 · 600 · 700', usage: 'Headline · Body · UI' },
      { family: 'Inter', weights: '500 · 700', usage: 'English · Number' },
    ],
  },
  {
    id: 'proj-3',
    previewImage: PROJECT_PREVIEW_URLS[2],
    mockupImage: PROJECT_JONGNO_FULLPAGE_URL,
    mockupMobileImage: PROJECT_JONGNO_MOBILE_URL,
    title: '종로엔다있다',
    subtitle: '종로 문화예술 정보 플랫폼',
    tags: ['Web', 'UI/UX', 'Culture'],
    gradient: 'from-blue-950/90 via-purple-950/80 to-black',
    description: '종로의 문화예술 행사와 공간, 단체 정보를 키워드 검색과 맞춤형 탐색 경험으로 연결한 지역 문화 플랫폼입니다.',
    client: null,
    year: '2026',
    contribution: { planning: null, design: null },
    colors: [
      { name: 'Main · Christalle', hex: '#33036B' },
      { name: 'Sub · Alizarin', hex: '#D32730' },
      { name: 'Sub · Golden Yellow', hex: '#FFDF00' },
    ],
    fonts: [
      {
        family: 'Pretendard',
        weights: 'Bold',
        usage: 'Heading 1',
        size: 60,
      },
      {
        family: 'Pretendard',
        weights: 'Bold',
        usage: 'Heading 2',
        size: 40,
      },
      {
        family: 'Pretendard',
        weights: 'Bold',
        usage: 'Heading 3',
        size: 32,
      },
    ],
  },
  {
    id: 'proj-4',
    previewImage: PROJECT_PREVIEW_URLS[3],
    title: '경남교육청 미래교육원',
    subtitle: '체험 중심 미래교육 플랫폼',
    tags: ['Web', 'UI/UX', 'Education'],
    gradient: 'from-cyan-950/90 via-blue-950/70 to-zinc-950',
    description: '미래교육 체험 예약부터 공간 안내까지 학생과 교사가 필요한 정보를 직관적으로 찾도록 설계한 교육 플랫폼입니다.',
    client: null,
    year: '2025',
    contribution: { planning: null, design: null },
    colors: [
      { name: 'Future Green', hex: '#98D92F' },
      { name: 'Learning Blue', hex: '#2388D8' },
      { name: 'Graphite', hex: '#17191D' },
    ],
    fonts: [
      { family: 'Pretendard', weights: '400 · 600 · 700', usage: 'Body · UI' },
      { family: 'Gmarket Sans', weights: '500 · 700', usage: 'Headline · Key Message' },
    ],
  },
  {
    id: 'proj-5',
    previewImage: PROJECT_PREVIEW_URLS[4],
    title: '인공지능사관학교',
    subtitle: 'AI 인재 양성 교육 플랫폼',
    tags: ['Mobile', 'UI/UX', 'Education'],
    gradient: 'from-purple-900/80 via-pink-950/60 to-black',
    description: 'AI 교육 과정과 역량 진단, 시설·멘토 정보를 모바일에서도 빠르게 이용할 수 있도록 정리한 교육 플랫폼입니다.',
    client: null,
    year: '2026',
    contribution: { planning: null, design: null },
    colors: [
      { name: 'AI Blue', hex: '#168DE2' },
      { name: 'Growth Orange', hex: '#F28B24' },
      { name: 'Midnight', hex: '#111827' },
    ],
    fonts: [
      { family: 'Pretendard', weights: '400 · 600 · 800', usage: 'Headline · Body · UI' },
      { family: 'Montserrat', weights: '600 · 700', usage: 'English · Number' },
    ],
  },
  {
    id: 'proj-6',
    previewImage: PROJECT_PREVIEW_URLS[0],
    title: '스마트산업지원센터',
    subtitle: '스마트 산업 지원 웹사이트 리뉴얼',
    tags: ['Web', 'Renewal', 'Responsive'],
    gradient: 'from-violet-950/80 via-indigo-900/60 to-black',
    description: '기업별 지원 프로그램과 입주·시설 정보를 명확한 정보 구조로 재정비한 스마트산업지원센터 반응형 웹사이트입니다.',
    client: null,
    year: '2026',
    contribution: { planning: null, design: null },
    colors: [
      { name: 'Core Blue', hex: '#5D63F2' },
      { name: 'Smart Mint', hex: '#49DDB1' },
      { name: 'Deep Ink', hex: '#111318' },
    ],
    fonts: [
      { family: 'Pretendard', weights: '400 · 600 · 800', usage: 'Headline · Body · UI' },
      { family: 'Inter', weights: '500 · 700', usage: 'English · Data' },
    ],
  },
  {
    id: 'proj-7',
    previewImage: PROJECT_PREVIEW_URLS[1],
    title: '글로벌기술협력센터',
    subtitle: '글로벌 기술협력 모바일 웹',
    tags: ['Mobile', 'Global', 'UI/UX'],
    gradient: 'from-orange-950/80 via-neutral-900/70 to-black',
    description: '국제 기술교류와 협력 사업 정보를 다국어 환경에서 빠르게 확인할 수 있도록 설계한 모바일 퍼스트 웹사이트입니다.',
    client: null,
    year: '2025',
    contribution: { planning: null, design: null },
    colors: [
      { name: 'Global Orange', hex: '#FF5A1F' },
      { name: 'Cooperation Purple', hex: '#5B2A86' },
      { name: 'Charcoal', hex: '#202124' },
    ],
    fonts: [
      { family: 'Pretendard', weights: '400 · 600 · 700', usage: 'Headline · Body · UI' },
      { family: 'Inter', weights: '500 · 700', usage: 'English · Number' },
    ],
  },
  {
    id: 'proj-8',
    previewImage: PROJECT_PREVIEW_URLS[4],
    title: 'AI 교육 플랫폼',
    subtitle: 'AI 기반 디지털 학습 플랫폼',
    tags: ['Web', 'AI', 'Education'],
    gradient: 'from-sky-950/80 via-blue-900/60 to-black',
    description: '학습 과정과 교육 자료, 진로 정보를 하나의 흐름으로 연결해 AI 인재의 성장을 돕는 디지털 학습 플랫폼입니다.',
    client: null,
    year: '2026',
    contribution: { planning: null, design: null },
    colors: [
      { name: 'AI Blue', hex: '#168DE2' },
      { name: 'Growth Orange', hex: '#F28B24' },
      { name: 'Midnight', hex: '#111827' },
    ],
    fonts: [
      { family: 'Pretendard', weights: '400 · 600 · 800', usage: 'Headline · Body · UI' },
      { family: 'Montserrat', weights: '600 · 700', usage: 'English · Number' },
    ],
  }
];

export const ARCHIVE_COLUMNS: ArchiveItem[][] = [
  // Column 1
  [
    {
      id: 'arch-1',
      category: 'FASHION',
      keywords: ['Monochrome', 'Chic'],
      description: '바다의 잔광과 비건 소재의 질감을 담은 타이달 컬렉션 패션 비주얼입니다.',
      image: ARCHIVE_FASHION_URLS[0],
    },
    {
      id: 'arch-2',
      category: 'FASHION',
      keywords: ['Pearl', 'Minimal'],
      description: '진주빛 소재와 미니멀한 실루엣으로 구성한 슈즈 캠페인 비주얼입니다.',
      image: ARCHIVE_FASHION_URLS[1],
    },
    {
      id: 'arch-3',
      category: 'FASHION',
      keywords: ['Iridescent', 'Resort'],
      description: '노을과 오로라빛 드레스를 결합한 리조트 패션 캠페인 비주얼입니다.',
      image: ARCHIVE_FASHION_URLS[2],
    },
    {
      id: 'arch-fashion-4',
      category: 'FASHION',
      keywords: ['Sheer', 'Coastal'],
      description: '투명한 레이어드 소재와 거친 해안 암석의 대비를 담은 패션 에디토리얼입니다.',
      image: ARCHIVE_FASHION_URLS[3],
    },
    {
      id: 'arch-fashion-5',
      category: 'FASHION',
      keywords: ['Tidal', 'Sneakers'],
      description: '파도와 아이리디슨트 소재를 결합한 타이달 컬렉션 스니커즈 캠페인입니다.',
      image: ARCHIVE_FASHION_URLS[4],
    }
  ],
  // Column 2
  [
    {
      id: 'arch-4',
      category: 'BEAUTY',
      keywords: ['Lunar', 'Radiance'],
      description: '달빛과 해파리의 투명한 질감으로 세럼의 수분감을 표현한 뷰티 비주얼입니다.',
      image: ARCHIVE_BEAUTY_URLS[0],
    },
    {
      id: 'arch-5',
      category: 'BEAUTY',
      keywords: ['Seahorse', 'Barrier'],
      description: '해마와 골드 리퀴드 오브제로 장벽 크림의 밀도감을 표현한 캠페인입니다.',
      image: ARCHIVE_BEAUTY_URLS[1],
    },
    {
      id: 'arch-6',
      category: 'BEAUTY',
      keywords: ['Coral', 'Glass Tint'],
      description: '코랄 리프와 글라스 패키지로 다양한 틴트 컬러를 보여주는 뷰티 비주얼입니다.',
      image: ARCHIVE_BEAUTY_URLS[2],
    },
    {
      id: 'arch-beauty-4',
      category: 'BEAUTY',
      keywords: ['Deep Water', 'Hydration'],
      description: '깊은 바다의 청량한 물결과 투명한 패키지로 수분감을 표현한 스킨케어 비주얼입니다.',
      image: ARCHIVE_BEAUTY_URLS[3],
    },
    {
      id: 'arch-beauty-5',
      category: 'BEAUTY',
      keywords: ['Seaweed', 'Cleansing'],
      description: '해조류의 싱그러운 색감과 물의 움직임을 담은 클렌징 라인 캠페인입니다.',
      image: ARCHIVE_BEAUTY_URLS[4],
    }
  ],
  // Column 3
  [
    {
      id: 'arch-promotion-1',
      category: 'PROMOTION',
      keywords: ['Gift Set', 'Chuseok'],
      description: '골드 톤과 해마 모티프로 프리미엄 추석 선물 세트를 소개한 프로모션 비주얼입니다.',
      image: ARCHIVE_PROMOTION_URLS[0],
    },
    {
      id: 'arch-promotion-2',
      category: 'PROMOTION',
      keywords: ['Coral Tint', 'Launch'],
      description: '코럴 컬러와 투명한 물방울 질감으로 글라스 틴트 신제품 런칭 혜택을 알린 프로모션입니다.',
      image: ARCHIVE_PROMOTION_URLS[1],
    },
    {
      id: 'arch-promotion-3',
      category: 'PROMOTION',
      keywords: ['Season Off', 'Sale'],
      description: '톡톡 튀는 네온 컬러와 3D 타이포그래피로 20% 시즌 오프 혜택을 강조한 세일 캠페인입니다.',
      image: ARCHIVE_PROMOTION_URLS[2],
    },
    {
      id: 'arch-promotion-4',
      category: 'PROMOTION',
      keywords: ['Sea Breeze', 'Sale'],
      description: '바다의 은은한 빛과 평온한 여름 무드로 비건 패션 시즌 오프 소식을 전한 프로모션입니다.',
      image: ARCHIVE_PROMOTION_URLS[3],
    },
    {
      id: 'arch-promotion-5',
      category: 'PROMOTION',
      keywords: ['Beach Run', 'Performance'],
      description: '해변 러닝 장면과 청량한 블루 톤으로 운동화의 통기성과 속건 기능을 보여주는 프로모션입니다.',
      image: ARCHIVE_PROMOTION_URLS[4],
    }
  ],
  // Column 4
  [
    {
      id: 'arch-10',
      category: 'CONCEPT',
      keywords: ['Chrome', 'Metallic'],
      description: '크롬 소재의 반사와 금속 질감을 실험한 콘셉트 비주얼입니다.',
    },
    {
      id: 'arch-11',
      category: 'PORTRAIT',
      keywords: ['Greyscale', 'Specular'],
      description: '빛과 명암만으로 표면의 질감을 강조한 모노크롬 포트레이트입니다.',
    },
    {
      id: 'arch-12',
      category: 'LIGHTING',
      keywords: ['Laser', 'Cyan'],
      description: '레이저와 시안 컬러로 빛의 흐름을 표현한 라이팅 스터디입니다.',
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
