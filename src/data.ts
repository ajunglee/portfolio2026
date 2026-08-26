import { FeaturedProject, ScatterProject, ArchiveItem } from './types';

const PROJECT_PREVIEW_URLS = [
  new URL('./images/project_img1.webp', import.meta.url).href,
  new URL('./images/project_img2.webp', import.meta.url).href,
  new URL('./images/project_img3.webp', import.meta.url).href,
  new URL('./images/project_img4.webp', import.meta.url).href,
  new URL('./images/project_img5.webp', import.meta.url).href,
  new URL('./images/project_img6.webp', import.meta.url).href,
  new URL('./images/project_img7.webp', import.meta.url).href,
  new URL('./images/project_img8.webp', import.meta.url).href,
] as const;
const PROJECT_JONGNO_FULLPAGE_URL = new URL(
  './images/project_con_jongno.webp',
  import.meta.url,
).href;
const PROJECT_JONGNO_MOBILE_URL = new URL(
  './images/project_con_jongno_m.webp',
  import.meta.url,
).href;
const PROJECT_GT_FULLPAGE_URL = new URL(
  './images/project_con_GT_pc.jpg',
  import.meta.url,
).href;
const PROJECT_GT_INTRO_URL = new URL(
  './images/project_con_GT_intro.jpg',
  import.meta.url,
).href;
const PROJECT_GT_MOBILE_URL = new URL(
  './images/project_con_GT_m.jpg',
  import.meta.url,
).href;
const PROJECT_AI_SCHOOL_FULLPAGE_URL = new URL(
  './images/project_con_AiSchool_pc.jpg',
  import.meta.url,
).href;
const PROJECT_AI_SCHOOL_TABLET_URL = new URL(
  './images/project_con_AiSchool_tab.jpg',
  import.meta.url,
).href;
const PROJECT_AI_SCHOOL_MOBILE_URL = new URL(
  './images/project_con_AiSchool_m.png',
  import.meta.url,
).href;
const PROJECT_FUTURE_DESKTOP_URL = new URL(
  './images/project_con_future_pc.jpg',
  import.meta.url,
).href;
const PROJECT_FUTURE_DESKTOP_HOVER_URL = new URL(
  './images/project_con_future_pc_hover.jpg',
  import.meta.url,
).href;
const PROJECT_FUTURE_MOBILE_URL = new URL(
  './images/project_con_future_m.jpg',
  import.meta.url,
).href;
const PROJECT_FAIR_DESKTOP_URL = new URL(
  './images/project_con_Fair_pc.jpg',
  import.meta.url,
).href;
const PROJECT_FAIR_MOBILE_URL = new URL(
  './images/project_con_Fair_m.jpg',
  import.meta.url,
).href;
const PROJECT_FAIR_SITEMAP_URL = new URL(
  './images/project_con_Fair_sitemap.jpg',
  import.meta.url,
).href;
const PROJECT_CERTI_FULLPAGE_01_URL = new URL(
  './images/project_con_certi1.jpg',
  import.meta.url,
).href;
const PROJECT_CERTI_FULLPAGE_02_URL = new URL(
  './images/project_con_certi2.jpg',
  import.meta.url,
).href;
const PROJECT_SANGROK_DESKTOP_URL = new URL(
  './images/project_con_sangrok_pc.webp',
  import.meta.url,
).href;
const PROJECT_SANGROK_TABLET_URL = new URL(
  './images/project_con_sangrok_tab.webp',
  import.meta.url,
).href;
const PROJECT_SANGROK_MOBILE_URL = new URL(
  './images/project_con_sangrok_m.webp',
  import.meta.url,
).href;
const ARCHIVE_FASHION_URLS = [
  new URL('./images/fashion1.jpg', import.meta.url).href,
  new URL('./images/fashion2.jpg', import.meta.url).href,
  new URL('./images/fashion3.jpg', import.meta.url).href,
  new URL('./images/fashion4.jpg', import.meta.url).href,
  new URL('./images/fashion5.jpg', import.meta.url).href,
] as const;
const ARCHIVE_BEAUTY_URLS = [
  new URL('./images/beauty1.jpg', import.meta.url).href,
  new URL('./images/beauty2.jpg', import.meta.url).href,
  new URL('./images/beauty3.jpg', import.meta.url).href,
  new URL('./images/beauty4.jpg', import.meta.url).href,
  new URL('./images/beauty5.jpg', import.meta.url).href,
] as const;
const ARCHIVE_PROMOTION_URLS = [
  new URL('./images/Promotion1.webp', import.meta.url).href,
  new URL('./images/promotion2.webp', import.meta.url).href,
  new URL('./images/promotion3.webp', import.meta.url).href,
  new URL('./images/promotion4.webp', import.meta.url).href,
  new URL('./images/promotion5.webp', import.meta.url).href,
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

// 상세 설명·발주사·팔레트는 팝업 레이아웃용 초안입니다.
// 공개 전 실제 프로젝트 명세로 교체하고, 기여도는 확정 수치를 입력합니다.
// 별도 전체 페이지 이미지가 준비되면 각 항목의 mockupImage에 연결합니다.
export const SCATTER_PROJECTS: ScatterProject[] = [
  {
    id: 'proj-1',
    previewImage: PROJECT_PREVIEW_URLS[0],
    title: 'BtoB플랫폼',
    subtitle: '스마트 산업 지원 통합 플랫폼',
    tags: ['Web', 'UI/UX', 'Responsive'],
    gradient: 'from-fuchsia-950/80 via-purple-900/60 to-black',
    description: '기업과 개발자를 대상으로 기술지원 서비스와 연구 인프라를 통합 제공하는 B2B 플랫폼 리뉴얼 프로젝트입니다. 참여기업 신청부터 전문가 등록, 장비·시설 예약까지 다양한 서비스를 보다 쉽고 직관적으로 이용할 수 있도록 사용자 경험을 개선했습니다.',
    client: '한국정보기술연구원(KITRI)',
    year: '2025',
    schedule: '2025년',
    contribution: { planning: null, design: null },
    colors: [
      { name: 'Main', hex: '#0435B2' },
      { name: 'Sub 01', hex: '#249984' },
      { name: 'Sub 02', hex: '#9400D3' },
    ],
  },
  {
    id: 'proj-2',
    previewImage: PROJECT_PREVIEW_URLS[1],
    mockupImage: PROJECT_GT_FULLPAGE_URL,
    mockupIntroImage: PROJECT_GT_INTRO_URL,
    mockupMobileImage: PROJECT_GT_MOBILE_URL,
    title: 'GT온라인',
    subtitle: '글로벌 기술협력 모바일 플랫폼',
    tags: ['Mobile', 'UI/UX', 'Global'],
    gradient: 'from-purple-950/90 via-indigo-950/70 to-slate-950',
    description: '국내 기업과 해외 기술 전문가를 연결하는 기술협력 플랫폼으로, 국제 공동 R&D와 기술 컨설팅 지원을 위한 다양한 정보를 제공합니다. 사업 안내부터 전문가 탐색, 기술 네트워크, 공고 및 신청 기능까지 통합 제공하여 사용자가 필요한 정보를 효율적으로 탐색하고 협업할 수 있도록 지원하는 서비스입니다.',
    client: '한국산업기술진흥원',
    year: '2025',
    schedule: '2025년 6월 ~ 2025년 12월',
    contribution: { planning: null, design: null },
    colors: [
      { name: 'Main', hex: '#5000B7' },
      { name: 'Sub 01', hex: '#00CFFF' },
      { name: 'Sub 02', hex: '#FF5B00' },
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
    description: "기존 '종로엔 다있다'는 역사·관광 중심 콘텐츠에 한정되어 있었고, 노후화된 시스템으로 인해 새로운 기능과 콘텐츠를 확장하는 데 한계가 있었습니다. 또한 종로구 곳곳에 분산된 공연, 전시, 축제, 문화유산 정보를 하나의 플랫폼에서 통합 제공하고, 예술인과 이용자가 직접 참여하는 양방향 문화예술 플랫폼 구축의 필요성이 제기되었습니다.",
    client: '서울특별시 종로구',
    year: '2025',
    schedule: '2025년',
    contribution: { planning: null, design: null },
    colors: [
      { name: 'Main · Christalle', hex: '#33036B' },
      { name: 'Sub · Alizarin', hex: '#D32730' },
      { name: 'Sub · Golden Yellow', hex: '#FFDF00' },
    ],
  },
  {
    id: 'proj-4',
    previewImage: PROJECT_PREVIEW_URLS[3],
    mockupImage: PROJECT_FUTURE_DESKTOP_URL,
    mockupHoverImage: PROJECT_FUTURE_DESKTOP_HOVER_URL,
    mockupMobileImage: PROJECT_FUTURE_MOBILE_URL,
    title: '경남교육청 미래교육원 체험누리집',
    subtitle: '체험 중심 미래교육 플랫폼',
    tags: ['Web', 'UI/UX', 'Education'],
    gradient: 'from-cyan-950/90 via-blue-950/70 to-zinc-950',
    description: '기존 체험누리집은 지속적인 유지관리와 함께 예약 서비스, 체험맵, 콘텐츠 관리 기능의 개선이 필요했으며, 변화하는 서비스 환경과 사용자 요구를 반영한 기능 고도화가 요구되었습니다. 또한 웹 접근성·웹 표준 준수와 개인정보 보호, 관리자 운영 효율성 향상을 위한 전반적인 개선이 필요하여 프로젝트가 추진되었습니다.',
    client: '경남교육청',
    year: '2026',
    schedule: '2026년',
    contribution: { planning: null, design: null },
    colors: [
      { name: 'Main', hex: '#0068FF' },
      { name: 'Sub 01', hex: '#5D57EB' },
      { name: 'Sub 02', hex: '#219F73' },
    ],
  },
  {
    id: 'proj-5',
    previewImage: PROJECT_PREVIEW_URLS[4],
    mockupImage: PROJECT_AI_SCHOOL_FULLPAGE_URL,
    mockupTabletImage: PROJECT_AI_SCHOOL_TABLET_URL,
    mockupMobileImage: PROJECT_AI_SCHOOL_MOBILE_URL,
    title: '인공지능사관학교',
    subtitle: 'AI 인재 양성 교육 플랫폼',
    tags: ['Mobile', 'UI/UX', 'Education'],
    gradient: 'from-purple-900/80 via-pink-950/60 to-black',
    description: '기존 교육 안내 중심의 정보 제공에서 벗어나 교육 → 실습 → 취·창업 → 성과 확산으로 이어지는 성장 과정을 효과적으로 전달하고, AI 교육기관의 전문성과 청년 친화적인 브랜드 이미지를 강화하기 위해 메인페이지 리디자인을 제안하였습니다.',
    client: '인공지능산업융합사업단(AICA)',
    year: '2025',
    schedule: '2025년',
    contribution: { planning: null, design: null },
    colors: [
      { name: 'Main', hex: '#275CAB' },
      { name: 'Sub 01', hex: '#008AFF' },
      { name: 'Sub 02', hex: '#F36F21' },
    ],
  },
  {
    id: 'proj-6',
    previewImage: PROJECT_PREVIEW_URLS[5],
    mockupImage: PROJECT_FAIR_DESKTOP_URL,
    mockupMobileImage: PROJECT_FAIR_MOBILE_URL,
    mockupSitemapImage: PROJECT_FAIR_SITEMAP_URL,
    title: '제12회 도시농업박람회',
    subtitle: '일상 속 도시농업 체험형 박람회',
    tags: ['Web', 'UI/UX', 'Exhibition'],
    gradient: 'from-orange-950/90 via-amber-950/70 to-stone-950',
    description: '도시농업을 일상 속 문화로 확산하기 위해 기존의 전시 중심 박람회에서 벗어나 집, 학교, 회사, 공원 등 생활공간을 테마로 한 체험형 전시를 기획했습니다. 관람객이 도시농업을 직접 경험하고 공감할 수 있는 콘텐츠를 통해 도시농업의 긍정적인 가치를 전달하는 것을 목표로 했습니다.',
    client: '모두가도시농부, 브랜드쿡',
    year: '2023',
    schedule: '2023년',
    contribution: { planning: null, design: null },
    colors: [
      { name: 'Main', hex: '#FE5722' },
      { name: 'Sub 01', hex: '#FFAA35' },
      { name: 'Sub 02', hex: '#5B3913' },
    ],
  },
  {
    id: 'proj-7',
    previewImage: PROJECT_PREVIEW_URLS[6],
    mockupImage: PROJECT_CERTI_FULLPAGE_01_URL,
    mockupSecondaryImage: PROJECT_CERTI_FULLPAGE_02_URL,
    title: '한국생산성본부인증원',
    subtitle: '인증 서비스 브랜드 경험 리뉴얼',
    tags: ['BX', 'Web', 'UI/UX'],
    gradient: 'from-rose-950/90 via-blue-950/70 to-slate-950',
    description: '한국생산성본부인증원(KPCQA)의 브랜드 아이덴티티를 강화하기 위해 메인페이지를 리뉴얼한 BX 프로젝트입니다. 기존의 공공기관 중심 UI에서 벗어나, 인증 서비스의 전문성과 신뢰성을 현대적인 브랜드 경험으로 전달하는 것을 목표로 디자인을 제안했습니다.',
    client: '한국생산성본부인증원',
    year: '2026',
    schedule: '2026년 8월',
    contribution: { planning: null, design: null },
    colors: [
      { name: 'Main', hex: '#EE3048' },
      { name: 'Sub 01', hex: '#2F6BFF' },
      { name: 'Sub 02', hex: '#21376B' },
    ],
  },
  {
    id: 'proj-8',
    previewImage: PROJECT_PREVIEW_URLS[7],
    mockupImage: PROJECT_SANGROK_DESKTOP_URL,
    mockupTabletImage: PROJECT_SANGROK_TABLET_URL,
    mockupMobileImage: PROJECT_SANGROK_MOBILE_URL,
    title: '공무원연금공단 복지시설(상록골프앤리조트)',
    subtitle: '복지시설 통합 웹사이트 리뉴얼',
    tags: ['Web', 'UI/UX', 'Responsive'],
    gradient: 'from-red-950/90 via-neutral-950/75 to-black',
    description: '기존 홈페이지는 노후화된 UI와 낮은 시각적 완성도로 인해 정보 전달력과 사용자 만족도가 떨어지고 있었습니다. 또한 시설별 콘텐츠가 일관성 없이 제공되어 서비스 인지도와 접근성이 낮아, 콘텐츠 중심의 정보 구조와 현대적인 사용자 경험으로 개선하는 프로젝트가 추진되었습니다.',
    client: '공무원연금공단',
    year: '2025',
    schedule: '2025년 8월',
    contribution: { planning: null, design: null },
    colors: [
      { name: 'Main', hex: '#E63927' },
      { name: 'Sub', hex: '#1E2124' },
    ],
  }
].sort((projectA, projectB) => Number(projectB.year) - Number(projectA.year));

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
