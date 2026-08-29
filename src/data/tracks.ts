// Portfolio Data - Clear, Professional & Grounded (Grounded in ananda-bintang.netlify.app)

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
  subtitle: string;
  role: string;
  period: string;
  artAccent: string;
}

export const PLAYABLE_TRACKS: Track[] = [
  {
    id: "ayo-kasir",
    trackNo: "01",
    storyChapter: "PROJECT 01",
    title: "AYO Kasir by SRC",
    subtitle: "Enterprise Retail & POS Platform",
    role: "Backend Engineer @ Weekend Inc.",
    period: "2025 - Present",
    artAccent: "#4a9eff",
  },
  {
    id: "ayo-qoncierge",
    trackNo: "02",
    storyChapter: "PROJECT 02",
    title: "AYO Qoncierge by SRC",
    subtitle: "Field Operations & Staff Management",
    role: "Backend Engineer @ Weekend Inc.",
    period: "2025 - Present",
    artAccent: "#5dbf6e",
  },
  {
    id: "moneymate",
    trackNo: "03",
    storyChapter: "PROJECT 03",
    title: "MoneyMate",
    subtitle: "Personal Finance Web Application",
    role: "Full Stack Engineer",
    period: "2025",
    artAccent: "#c77dff",
  },
  {
    id: "ecommerce",
    trackNo: "04",
    storyChapter: "PROJECT 04",
    title: "E-Commerce & Top-up Platform",
    subtitle: "Digital Store & Webhook Billing",
    role: "Full Stack Developer (Freelance)",
    period: "2023 - 2025",
    artAccent: "#fbbf24",
  },
];

export const PROJECTS = {
  "ayo-kasir": {
    tagline: "Point-of-Sale & Retail Microservices for PT HM Sampoerna",
    description:
      "Enterprise digital retail ecosystem connecting wholesale partners, retail stores, and customers. Handles high-volume POS transactions, inventory tracking, and staff management under microservices architecture.",
    stack: ["Laravel", "PHP", "Microservices", "PostgreSQL", "AWS EC2/S3", "Jenkins CI/CD", "Payment Gateway"],
    deliverables: [
      "Developed backend modules for staff management, order processing, and store inventory",
      "Optimized relational database queries to eliminate N+1 latency bottlenecks",
      "Configured automated linting and code quality checks using Husky and Commitlint",
      "Collaborated in Agile/Scrum workflow across sprint planning and team reviews",
    ],
    liveUrl: "https://ayo.src.id",
    company: "Weekend Inc. (PT HM Sampoerna)",
  },
  "ayo-qoncierge": {
    tagline: "Staff Operations & Coach Management Platform",
    description:
      "Operational management platform for field coaches and staff across PT HM Sampoerna's retail network. Built with clean architecture principles for maintainability, role-based access control, and auditability.",
    stack: ["Laravel", "Node.js", "Clean Architecture", "PostgreSQL", "REST API", "CI/CD", "Docker"],
    deliverables: [
      "Designed clean modular service layers with clear domain boundaries",
      "Implemented role-based access control and permissions for field personnel",
      "Integrated structured audit logging for key business transactions and record updates",
      "Maintained reliable RESTful API contracts for frontend integrations",
    ],
    company: "Weekend Inc. (PT HM Sampoerna)",
  },
  moneymate: {
    tagline: "Personal Finance Web App with AI Receipt Scan & Budget Tracking",
    description:
      "Fullstack personal finance application built with React/Vite and Express.js. Features automated carry-over budgeting, AI-powered receipt scanning with Gemini Vision, JWT authentication, and daily push notifications.",
    stack: ["React", "Node.js", "Express.js", "Knex.js", "MySQL", "Google Gemini AI", "Firebase Auth", "Web Push", "Docker"],
    deliverables: [
      "Built calculation engines for carry-over budgeting and period balance tracking",
      "Integrated Google Gemini Vision API for automatic receipt extraction and OCR",
      "Implemented security middlewares including rate limiting, JWT token revocation, and HPP protection",
      "Deployed frontend on Netlify and backend with persistent database container",
    ],
    liveUrl: "https://moneymate-abp.netlify.app/",
    githubUrl: "https://github.com/MoneyMate-ABP/moneymate-api",
    company: "Personal Project",
  },
  ecommerce: {
    tagline: "Digital Goods & Game Top-Up Store with Automated Payment Webhooks",
    description:
      "Commercial e-commerce web platform for digital gaming vouchers and top-ups, featuring automated payment reconciliation, inventory management, and an admin dashboard.",
    stack: ["PHP", "Laravel", "MySQL", "PostgreSQL", "Payment Webhooks", "REST API"],
    deliverables: [
      "Engineered webhook callback handlers with idempotency checks to prevent duplicate transactions",
      "Optimized database indices for fast order queries and transaction reporting",
      "Built administrative panel for sales tracking, product stock control, and invoice generation",
    ],
    company: "Freelance Project",
  },
};

export const SKILLS = [
  {
    category: "Languages",
    items: ["JavaScript (ES6+)", "TypeScript", "PHP 8.x", "SQL", "Bash"],
  },
  {
    category: "Frameworks & Backend",
    items: ["Laravel", "Node.js", "Express.js", "Knex.js", "CodeIgniter", "RESTful API"],
  },
  {
    category: "Databases & Storage",
    items: ["PostgreSQL", "MySQL", "Redis", "Database Indexing", "Query Optimization"],
  },
  {
    category: "Cloud & DevOps",
    items: ["AWS (EC2, S3, RDS)", "Docker & Docker Compose", "Jenkins CI/CD", "Nginx", "Linux Server"],
  },
  {
    category: "Architecture & Practices",
    items: ["Clean Architecture", "Microservices Patterns", "Agile / Scrum", "Domain-Driven Design"],
  },
  {
    category: "Code Quality & Security",
    items: ["Husky & Commitlint", "JWT Authentication", "Rate Limiting", "Structured Error Logging"],
  },
];

export const SESSIONS = [
  {
    period: "Jul 2025 - Present",
    role: "Backend Engineer",
    company: "Weekend Inc.",
    client: "Client: PT HM Sampoerna",
    location: "Jakarta, Indonesia (Hybrid)",
    status: "CURRENT ROLE",
    highlights: [
      "Developing backend services for enterprise retail platforms including AYO KASIR and AYO QONCIERGE",
      "Building core modules for staff management, coach operations, and POS inventory synchronization",
      "Refactoring queries and optimizing database access to eliminate N+1 bottlenecks",
      "Implementing structured logging, audit trails, and unified error handling across microservices",
      "Enforcing code quality with automated pre-commit diff linting using Husky and Commitlint",
    ],
    tags: ["Laravel", "Microservices", "AWS", "Jenkins", "PostgreSQL"],
    active: true,
  },
  {
    period: "Oct 2023 - Jul 2025",
    role: "Web Developer",
    company: "Freelance",
    client: "Client: Various Businesses",
    location: "Sidoarjo, Indonesia",
    status: "COMPLETED",
    highlights: [
      "Built custom web applications and REST APIs for small to medium business clients",
      "Developed an e-commerce platform with automated payment gateway webhook integration",
      "Structured relational database schemas and optimized indexing for transaction queries",
    ],
    tags: ["PHP", "Laravel", "MySQL", "REST API", "Payment Webhooks"],
    active: false,
  },
  {
    period: "Nov 2023 - Sep 2024",
    role: "Assistant Mentor",
    company: "Google Developer Student Club (GDSC)",
    client: "Telkom University Chapter",
    location: "Bandung, Indonesia",
    status: "COMPLETED",
    highlights: [
      "Mentored 50+ university students in web development and backend fundamentals",
      "Led workshops covering RESTful API design, database modeling, and Git collaboration workflows",
    ],
    tags: ["Mentoring", "REST API", "Database Design", "Git"],
    active: false,
  },
  {
    period: "Mar 2023 - Oct 2023",
    role: "Full Stack Developer (Intern)",
    company: "Roleplay Studio",
    client: "Client: Studio Portfolio",
    location: "Surabaya, Indonesia",
    status: "COMPLETED",
    highlights: [
      "Built responsive website interfaces and web features in collaboration with UI/UX designers",
      "Converted Figma design mockups into functional frontend components and backend endpoints",
    ],
    tags: ["JavaScript", "HTML/CSS", "UI Development"],
    active: false,
  },
];

export const PROFILE = {
  name: "Ananda Bintang Saputra",
  callsign: "Ananda Bintang",
  title: "Backend Engineer",
  avatarUrl: "https://ananda-bintang.netlify.app/ananda-bintang.png",
  headline: "Backend Engineer",
  subheadline:
    "Backend Engineer focused on building reliable microservices, high-throughput REST APIs, and optimized database queries. Currently working on retail and operations platforms at Weekend Inc. for PT HM Sampoerna.",
  location: "Sidoarjo, East Java, Indonesia",
  email: "anandabintang4@gmail.com",
  github: "https://github.com/AnandaBintang",
  education: {
    degree: "Associate Degree in Computer Science (D3)",
    school: "Telkom University",
    period: "Sep 2023 - Sep 2027",
    highschool: "SMKS Antartika 2 Sidoarjo",
    highschoolMajor: "Software Engineering (RPL)",
    highschoolPeriod: "Aug 2020 - Jun 2023",
  },
};
