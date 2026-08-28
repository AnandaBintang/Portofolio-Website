// Lo-Fi Spotify Portfolio - Track Data
// Every "track" is a portfolio section.

export type TrackId =
  | "home"
  | "ayo-kasir"
  | "ayo-qoncierge"
  | "moneymate"
  | "ecommerce"
  | "frequencies"
  | "sessions";

export interface Track {
  id: TrackId;
  trackNo: string;
  storyChapter: string;   // Label storyline tematik musik
  title: string;
  artist: string;         // role / context
  album: string;          // project category or "Artist Info"
  duration: string;
  bpm: string;
  genre: string;
  artGradient: string;
  artAccent: string;
}

export const TRACKS: Track[] = [
  {
    id: "home",
    trackNo: "00",
    storyChapter: "PROLOGUE: THE ACOUSTIC CORE",
    title: "Ananda Bintang Saputra",
    artist: "Backend Engineer",
    album: "Artist Profile",
    duration: "∞",
    bpm: "120",
    genre: "Microservices / Clean Arch",
    artGradient: "from-[#2a1f14] via-[#1c1510] to-[#0f0d0b]",
    artAccent: "#e8a045",
  },
  {
    id: "ayo-kasir",
    trackNo: "01",
    storyChapter: "SIDE A: HIGH-SCALE SYMPHONY",
    title: "AYO Kasir by SRC",
    artist: "Enterprise POS Platform",
    album: "Weekend Inc. - PT HM Sampoerna",
    duration: "4:12",
    bpm: "140",
    genre: "B2B Microservices",
    artGradient: "from-[#1a1f2e] via-[#0f1520] to-[#0a0d18]",
    artAccent: "#4a9eff",
  },
  {
    id: "ayo-qoncierge",
    trackNo: "02",
    storyChapter: "SIDE A: CLEAN HARMONICS",
    title: "AYO Qoncierge by SRC",
    artist: "Staff & Coaching Platform",
    album: "Weekend Inc. - PT HM Sampoerna",
    duration: "3:45",
    bpm: "128",
    genre: "B2C Clean Architecture",
    artGradient: "from-[#1f2a1a] via-[#151f10] to-[#0d1008]",
    artAccent: "#5dbf6e",
  },
  {
    id: "moneymate",
    trackNo: "03",
    storyChapter: "SIDE B: SYNTHESIZED ALGORITHMS",
    title: "MoneyMate",
    artist: "Financial Engine & Web App",
    album: "Personal Project",
    duration: "3:20",
    bpm: "116",
    genre: "AI-Powered Finance App",
    artGradient: "from-[#2a1a28] via-[#1c1020] to-[#100a18]",
    artAccent: "#c77dff",
  },
  {
    id: "ecommerce",
    trackNo: "04",
    storyChapter: "SIDE B: HIGH-THROUGHPUT GROOVE",
    title: "E-Commerce & Top-up Platform",
    artist: "Digital Commerce Engine",
    album: "Freelance Work",
    duration: "2:58",
    bpm: "110",
    genre: "Payment Gateway / High-Volume",
    artGradient: "from-[#2a1f10] via-[#1c1508] to-[#100d05]",
    artAccent: "#fbbf24",
  },
  {
    id: "frequencies",
    trackNo: "05",
    storyChapter: "INTERLUDE: FREQUENCY BANDS",
    title: "Core Frequencies",
    artist: "Technical Skills & Stack",
    album: "Studio Setup",
    duration: "—",
    bpm: "—",
    genre: "Full Stack / Infrastructure",
    artGradient: "from-[#1a2020] via-[#101818] to-[#080f0f]",
    artAccent: "#2dd4bf",
  },
  {
    id: "sessions",
    trackNo: "06",
    storyChapter: "OUTRO: MASTER RECORDINGS",
    title: "Session History",
    artist: "Work Experience & Education",
    album: "The Logbook",
    duration: "—",
    bpm: "—",
    genre: "Professional Journey",
    artGradient: "from-[#201a2a] via-[#15101c] to-[#0d0810]",
    artAccent: "#f472b6",
  },
];

export const PROJECTS = {
  "ayo-kasir": {
    description:
      "Comprehensive digital retail ecosystem connecting wholesale partners, convenience stores, and end customers for PT HM Sampoerna. Handles high-volume POS transactions, inventory synchronization, and multi-channel order management under microservices architecture.",
    stack: ["Laravel", "PHP", "Microservices", "PostgreSQL", "AWS EC2/S3", "Jenkins CI/CD", "Payment Gateway"],
    deliverables: [
      "Built core backend modules for staff management, order processing, and POS inventory",
      "Eliminated N+1 query bottlenecks across multiple relational data layers",
      "Implemented structured error logging and observability for production debugging",
      "Engineered diff-based automated linting pipelines with Husky and Commitlint",
      "Collaborated in Agile/Scrum environment across sprint planning and retrospectives",
    ],
    liveUrl: "https://ayo.src.id",
    scale: "Enterprise / PT HM Sampoerna",
  },
  "ayo-qoncierge": {
    description:
      "B2C & B2B operational platform managing field coaches, staff roles, and enterprise service delivery for PT HM Sampoerna. Designed for strict role-based access, auditability, and high maintainability through clean architecture patterns.",
    stack: ["Laravel", "Node.js", "Clean Architecture", "PostgreSQL", "REST API", "CI/CD", "Docker"],
    deliverables: [
      "Designed modular service layers with clear domain boundaries and dependency inversion",
      "Built role-based authorization system for staff and coaching personnel",
      "Integrated structured audit logging to track all critical business mutations",
      "Maintained clean API contracts across frontend and third-party consumers",
    ],
    scale: "Enterprise / Multi-Role Operations",
  },
  moneymate: {
    description:
      "Full-stack personal finance application with React/Vite frontend and Express.js backend. Features JWT token revocation, Firebase Google OAuth, AI-powered receipt scanning via Gemini Vision, realtime carry-over budget calculation, and automated daily web push notifications.",
    stack: ["React", "Node.js", "Express.js", "Knex.js", "MySQL", "Google Gemini AI", "Firebase Auth", "Web Push VAPID", "Docker"],
    deliverables: [
      "Implemented realtime carry-over, invest, and zero-budget period calculation engines",
      "Built Gemini Vision receipt OCR pipeline returning structured transaction JSON",
      "Configured burst rate limiting, HPP protection, and duplicate 60s request blocking",
      "Deployed full-stack app live on Netlify with backend on high-availability server",
    ],
    liveUrl: "https://moneymate-abp.netlify.app/",
    githubUrl: "https://github.com/MoneyMate-ABP/moneymate-api",
    scale: "Live Production App",
  },
  ecommerce: {
    description:
      "Full-featured digital commerce and gaming top-up platform with automated order fulfillment, secure payment gateway webhooks, product inventory control, and a comprehensive admin dashboard for business reconciliation.",
    stack: ["PHP", "Laravel", "MySQL", "PostgreSQL", "Payment Gateway Webhooks", "REST API"],
    deliverables: [
      "Designed idempotent webhook callbacks to prevent double-crediting on payment events",
      "Optimized database indices for sub-100ms lookup times under peak transaction load",
      "Built admin dashboard for order reconciliation, user management, and reporting",
    ],
    scale: "1,000+ Active Users",
  },
};

export const SKILLS = [
  {
    category: "Languages",
    icon: "{ }",
    items: ["JavaScript", "TypeScript", "PHP", "SQL", "Bash"],
  },
  {
    category: "Frameworks",
    icon: "⚙",
    items: ["Laravel", "Express.js", "Node.js", "CodeIgniter", "Knex.js"],
  },
  {
    category: "Databases",
    icon: "▦",
    items: ["PostgreSQL", "MySQL", "Redis (basic)"],
  },
  {
    category: "Cloud & DevOps",
    icon: "☁",
    items: ["AWS (EC2, S3, RDS, Lambda)", "Docker", "Docker Compose", "Jenkins CI/CD", "Nginx"],
  },
  {
    category: "Architecture",
    icon: "◈",
    items: ["RESTful API Design", "Microservices", "Clean Architecture", "Service Layer Pattern", "N+1 Optimization"],
  },
  {
    category: "Engineering Quality",
    icon: "✓",
    items: ["Husky + Commitlint", "Diff-based Linting", "Structured Logging", "JWT & Auth Security", "Rate Limiting & HPP"],
  },
];

export const SESSIONS = [
  {
    no: "01",
    period: "July 2025 - Present",
    role: "Backend Engineer",
    company: "Weekend Inc.",
    client: "PT HM Sampoerna",
    location: "Jakarta (Hybrid)",
    highlights: [
      "Contributing to AYO KASIR & AYO QONCIERGE - enterprise B2B & B2C platforms",
      "Microservices architecture with Laravel as core backend framework",
      "N+1 resolution, structured logging, CI/CD pipelines with Jenkins",
      "Agile/Scrum across sprint planning, stand-ups, and retrospectives",
    ],
    tags: ["Laravel", "Microservices", "AWS", "Jenkins", "PostgreSQL"],
    active: true,
  },
  {
    no: "02",
    period: "Oct 2023 - July 2025",
    role: "Web Developer",
    company: "Freelance",
    client: null,
    location: "Sidoarjo / Remote",
    highlights: [
      "Built bespoke backend systems for varied business clients",
      "E-commerce platform serving 1,000+ active users",
      "SQL query optimization and index tuning for high-traffic read operations",
    ],
    tags: ["PHP", "Laravel", "MySQL", "REST API"],
    active: false,
  },
  {
    no: "03",
    period: "Nov 2023 - Sep 2024",
    role: "Assistant Mentor",
    company: "Google Developer Student Club",
    client: "Telkom University",
    location: "Bandung",
    highlights: [
      "Mentored 50+ students in web development and backend engineering",
      "Led practical workshops on REST API design, relational databases, and Git",
    ],
    tags: ["Mentoring", "REST API", "Backend Fundamentals"],
    active: false,
  },
  {
    no: "04",
    period: "Mar 2023 - Oct 2023",
    role: "Full Stack Developer",
    company: "Roleplay Studio",
    client: null,
    location: "Surabaya (Internship)",
    highlights: [
      "Built interactive company profile websites with custom motion",
      "Collaborated directly with UI/UX designers from design tokens to production code",
    ],
    tags: ["JavaScript", "HTML/CSS", "Animations"],
    active: false,
  },
];

export const PROFILE = {
  name: "Ananda Bintang Saputra",
  callsign: "Ananda Bintang",
  role: "Backend Engineer",
  bio: "Building the systems people rely on without seeing. Microservices, optimized SQL data layers, clean REST APIs - engineered for scale, reliability, and zero surprises in production.",
  location: "Sidoarjo, East Java, Indonesia",
  email: "anandabintang4@gmail.com",
  phone: "+62 853-3063-2334",
  github: "https://github.com/AnandaBintang",
  instagram: "https://instagram.com",
  education: {
    degree: "Associate Degree in Computer Science",
    school: "Telkom University",
    period: "Sep 2023 - Sep 2027",
  },
};
