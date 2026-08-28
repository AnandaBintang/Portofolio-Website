// Lo-Fi Spotify Portfolio - Track Data & Portfolio Information

export type TrackId =
  | "ayo-kasir"
  | "ayo-qoncierge"
  | "moneymate"
  | "ecommerce";

export interface Track {
  id: TrackId;
  trackNo: string;
  storyChapter: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  bpm: string;
  genre: string;
  artGradient: string;
  artAccent: string;
}

export const PLAYABLE_TRACKS: Track[] = [
  {
    id: "ayo-kasir",
    trackNo: "01",
    storyChapter: "SIDE A · TRACK 01",
    title: "AYO Kasir by SRC",
    artist: "Enterprise POS Platform",
    album: "Weekend Inc. · PT HM Sampoerna",
    duration: "4:12",
    bpm: "140",
    genre: "B2B Microservices",
    artGradient: "from-[#1a1f2e] via-[#0f1520] to-[#0a0d18]",
    artAccent: "#4a9eff",
  },
  {
    id: "ayo-qoncierge",
    trackNo: "02",
    storyChapter: "SIDE A · TRACK 02",
    title: "AYO Qoncierge by SRC",
    artist: "Staff & Coaching Platform",
    album: "Weekend Inc. · PT HM Sampoerna",
    duration: "3:45",
    bpm: "128",
    genre: "B2C Clean Architecture",
    artGradient: "from-[#1f2a1a] via-[#151f10] to-[#0d1008]",
    artAccent: "#5dbf6e",
  },
  {
    id: "moneymate",
    trackNo: "03",
    storyChapter: "SIDE B · TRACK 03",
    title: "MoneyMate",
    artist: "Financial Engine & Web App",
    album: "Personal Flagship Project",
    duration: "3:20",
    bpm: "116",
    genre: "AI-Powered Finance App",
    artGradient: "from-[#2a1a28] via-[#1c1020] to-[#100a18]",
    artAccent: "#c77dff",
  },
  {
    id: "ecommerce",
    trackNo: "04",
    storyChapter: "SIDE B · TRACK 04",
    title: "E-Commerce & Top-up Platform",
    artist: "Digital Commerce Engine",
    album: "Freelance Work",
    duration: "2:58",
    bpm: "110",
    genre: "Payment Gateway / High-Volume",
    artGradient: "from-[#2a1f10] via-[#1c1508] to-[#100d05]",
    artAccent: "#fbbf24",
  },
];

export const PROJECTS = {
  "ayo-kasir": {
    tagline: "Enterprise Point-of-Sale & Retail Microservices",
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
    scale: "Enterprise Retail / PT HM Sampoerna",
  },
  "ayo-qoncierge": {
    tagline: "Enterprise Staff & Coaching Operations Platform",
    description:
      "B2C & B2B operational platform managing field coaches, staff roles, and enterprise service delivery for PT HM Sampoerna. Designed for strict role-based access, auditability, and high maintainability through clean architecture patterns.",
    stack: ["Laravel", "Node.js", "Clean Architecture", "PostgreSQL", "REST API", "CI/CD", "Docker"],
    deliverables: [
      "Designed modular service layers with clear domain boundaries and dependency inversion",
      "Built role-based authorization system for staff and coaching personnel",
      "Integrated structured audit logging to track all critical business mutations",
      "Maintained clean API contracts across frontend and third-party consumers",
    ],
    scale: "Enterprise Operations",
  },
  moneymate: {
    tagline: "AI Vision Scan & Realtime Carry-Over Financial Engine",
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
    scale: "Live Production Web App",
  },
  ecommerce: {
    tagline: "High-Throughput Digital Commerce & Webhook Ledger",
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
    band: "BAND 01",
    freq: "20Hz - 200Hz",
    items: ["JavaScript (ES6+)", "TypeScript", "PHP 8.x", "SQL", "Bash Scripting"],
  },
  {
    category: "Frameworks & Runtimes",
    band: "BAND 02",
    freq: "200Hz - 800Hz",
    items: ["Laravel", "Node.js", "Express.js", "Knex.js", "CodeIgniter"],
  },
  {
    category: "Databases & Storage",
    band: "BAND 03",
    freq: "800Hz - 2kHz",
    items: ["PostgreSQL", "MySQL", "Redis Caching", "Index Optimization", "N+1 Elimination"],
  },
  {
    category: "Cloud & Infrastructure",
    band: "BAND 04",
    freq: "2kHz - 6kHz",
    items: ["AWS (EC2, S3, RDS, Lambda)", "Docker & Compose", "Jenkins CI/CD", "Nginx", "Linux Administration"],
  },
  {
    category: "Architecture & Design",
    band: "BAND 05",
    freq: "6kHz - 12kHz",
    items: ["RESTful API Architecture", "Microservices Patterns", "Clean Architecture", "Service Layer Pattern", "Domain-Driven Design"],
  },
  {
    category: "Engineering Quality",
    band: "BAND 06",
    freq: "12kHz - 20kHz",
    items: ["Husky & Commitlint", "Diff-based Linting", "Structured Logging", "JWT Session Revocation", "Rate Limiting & HPP"],
  },
];

export const SESSIONS = [
  {
    tapeId: "TAPE 01",
    period: "July 2025 - Present",
    role: "Backend Engineer",
    company: "Weekend Inc.",
    client: "PT HM Sampoerna",
    location: "Jakarta (Hybrid)",
    status: "CURRENT RESIDENCY",
    highlights: [
      "Contributing to enterprise-scale B2B & B2C platforms for PT HM Sampoerna, including AYO KASIR and AYO QONCIERGE",
      "Architected core backend modules for staff management, coach management, and POS inventory synchronization",
      "Optimized relational query performance by refactoring complex joins and eliminating N+1 query bottlenecks",
      "Implemented structured observability logs, audit trails, and unified error handling across microservices",
      "Configured automated pre-commit diff linting pipelines with Husky and Commitlint across multi-repo environments",
    ],
    tags: ["Laravel", "Microservices", "AWS", "Jenkins", "PostgreSQL"],
    active: true,
  },
  {
    tapeId: "TAPE 02",
    period: "Oct 2023 - July 2025",
    role: "Web Developer",
    company: "Freelance",
    client: "Various Businesses",
    location: "Sidoarjo / Remote",
    status: "COMPLETED",
    highlights: [
      "Architected bespoke backend systems and REST APIs for varied commercial and retail clients",
      "Engineered full-featured e-commerce platform serving 1,000+ active users with instant payment gateway reconciliation",
      "Tuned database execution times and established indexed views for high-traffic financial ledgers",
    ],
    tags: ["PHP", "Laravel", "MySQL", "REST API", "Payment Webhooks"],
    active: false,
  },
  {
    tapeId: "TAPE 03",
    period: "Nov 2023 - Sep 2024",
    role: "Assistant Mentor",
    company: "Google Developer Student Club",
    client: "Telkom University",
    location: "Bandung",
    status: "COMPLETED",
    highlights: [
      "Mentored 50+ computer science students in web development and scalable backend fundamentals",
      "Conducted hands-on technical workshops covering REST API design, relational database modeling, and Git workflows",
    ],
    tags: ["Mentoring", "REST API", "Database Design", "Git Workflow"],
    active: false,
  },
  {
    tapeId: "TAPE 04",
    period: "Mar 2023 - Oct 2023",
    role: "Full Stack Developer (Intern)",
    company: "Roleplay Studio",
    client: "Studio Portfolio",
    location: "Surabaya",
    status: "COMPLETED",
    highlights: [
      "Developed interactive company profile websites and web applications with rich layout discipline",
      "Translated Figma design tokens into clean component code in close collaboration with UI/UX designers",
    ],
    tags: ["JavaScript", "HTML/CSS", "UI Interaction"],
    active: false,
  },
];

export const PROFILE = {
  name: "Ananda Bintang Saputra",
  callsign: "Ananda Bintang",
  title: "Backend Engineer",
  avatarUrl: "https://ananda-bintang.netlify.app/ananda-bintang.png",
  headline: "ARCHITECTING INVISIBLE ENGINES.",
  subheadline:
    "Backend Engineer specializing in enterprise microservices, high-throughput REST APIs, and database query optimization. Currently engineering core retail and operational platforms at Weekend Inc. for PT HM Sampoerna.",
  location: "Sidoarjo, East Java, Indonesia",
  coordinates: "7°27'S 112°43'E",
  email: "anandabintang4@gmail.com",
  phone: "+62 853-3063-2334",
  github: "https://github.com/AnandaBintang",
  instagram: "https://instagram.com/anandabintang4",
  education: {
    degree: "Associate Degree in Computer Science",
    school: "Telkom University",
    period: "Sep 2023 - Sep 2027",
    highschool: "SMKS Antartika 2 Sidoarjo",
    highschoolMajor: "Software Engineering",
    highschoolPeriod: "Aug 2020 - Jun 2023",
  },
  stats: [
    { label: "CURRENT ENTERPRISE", value: "PT HM Sampoerna" },
    { label: "PRIMARY STACK", value: "Laravel / Node.js" },
    { label: "ARCHITECTURE", value: "Clean Microservices" },
    { label: "DATABASE FOCUS", value: "PostgreSQL / MySQL" },
  ],
};
