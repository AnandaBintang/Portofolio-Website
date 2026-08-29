// Portfolio Data - Clear, Professional & Grounded (Grounded in ananda-bintang.netlify.app & CV)

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
      "Developed and maintained backend modules for staff management, coach management, and orders",
      "Optimized relational database queries by resolving N+1 issues and improving indexing efficiency",
      "Configured automated linting pipelines with Husky and Commitlint across multi-repo environments",
      "Collaborated in Agile/Scrum workflow across sprint planning, stand-ups, and retrospectives",
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
      "Designed clean modular service layers with clear domain boundaries and dependency inversion",
      "Implemented role-based authorization system for staff and coaching personnel",
      "Integrated structured audit logging and error handling for critical mutations",
      "Maintained reliable RESTful API contracts for frontend and third-party consumers",
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
    items: ["JavaScript (ES6+)", "PHP 8.x", "SQL", "TypeScript", "Bash"],
  },
  {
    category: "Frameworks & Backend",
    items: ["Laravel", "Node.js", "Express.js", "CodeIgniter", "RESTful API", "Microservices"],
  },
  {
    category: "Databases & Storage",
    items: ["PostgreSQL", "MySQL", "Redis", "Database Optimization", "Query Indexing"],
  },
  {
    category: "Cloud & DevOps",
    items: ["AWS (EC2, S3)", "Docker", "Jenkins CI/CD", "Git", "Linux Server"],
  },
  {
    category: "Architecture & Practices",
    items: ["Clean Architecture", "Service Layer Pattern", "Agile / Scrum", "Domain-Driven Design"],
  },
  {
    category: "Code Quality & Observability",
    items: ["Husky & Commitlint", "Diff-based Linting", "Structured Error Logging", "JWT Revocation"],
  },
];

export const SESSIONS = [
  {
    period: "July 2025 – Present",
    role: "Backend Engineer",
    company: "Weekend Inc.",
    client: "Client: PT HM Sampoerna",
    location: "Jakarta, Indonesia (Hybrid)",
    status: "CURRENT ROLE",
    highlights: [
      "Contributing to enterprise-scale B2B and B2C platforms for PT HM Sampoerna, including AYO KASIR and AYO QONCIERGE, built on microservices architecture using Laravel",
      "Developing and maintaining core backend modules such as staff management, coach management, and orders aligned with business workflows",
      "Designing and implementing RESTful APIs following clean architecture and service layer patterns",
      "Optimizing database performance by resolving N+1 query issues and improving query efficiency",
      "Implementing structured logging and error handling to improve system observability and debugging",
      "Enhancing code quality and engineering workflow using Husky, Commitlint, and diff-based linting pipelines across Node.js, Laravel, and .NET",
      "Supporting cloud infrastructure and deployment processes using AWS and CI/CD pipelines with Jenkins in an Agile/Scrum environment",
    ],
    tags: ["Laravel", "Microservices", "AWS", "Jenkins", "PostgreSQL", "Node.js"],
    active: true,
  },
  {
    period: "Oct 2023 – July 2025",
    role: "Web Developer",
    company: "Freelance",
    client: "Client: Various Businesses",
    location: "Sidoarjo, Indonesia",
    status: "COMPLETED",
    highlights: [
      "Built backend applications using PHP, Laravel, and PostgreSQL for small to medium business clients",
      "Developed an e-commerce platform serving 1,000+ active users with instant payment gateway reconciliation",
      "Improved SQL query efficiency and established indexed views for high-traffic financial ledgers",
    ],
    tags: ["PHP", "Laravel", "PostgreSQL", "MySQL", "REST API", "Payment Webhooks"],
    active: false,
  },
  {
    period: "Nov 2023 – Sep 2024",
    role: "Assistant Mentor",
    company: "Google Developer Student Club (GDSC)",
    client: "Telkom University Chapter",
    location: "Bandung, Indonesia",
    status: "COMPLETED",
    highlights: [
      "Mentored 50+ computer science students in web development technologies and backend fundamentals",
      "Conducted workshops and project-based learning sessions covering RESTful API design, database modeling, and Git collaboration workflows",
    ],
    tags: ["Mentoring", "REST API", "Database Design", "Git"],
    active: false,
  },
  {
    period: "Mar 2023 – Oct 2023",
    role: "Full Stack Developer (Internship)",
    company: "Roleplay Studio",
    client: "Studio Portfolio",
    location: "Surabaya, Indonesia",
    status: "COMPLETED",
    highlights: [
      "Developed interactive company profile websites and web applications in collaboration with designers and project managers",
      "Translated Figma design tokens into clean component code and backend endpoints",
    ],
    tags: ["JavaScript", "HTML/CSS", "UI Development"],
    active: false,
  },
  {
    period: "Sep 2022 – Dec 2022",
    role: "Full Stack Developer (Internship)",
    company: "CV. Purnama Kreatifa",
    client: "Attendance System",
    location: "Indonesia",
    status: "COMPLETED",
    highlights: [
      "Built location-based attendance system with geofencing technology",
      "Collaborated with cross-functional teams to deliver reliable attendance tracking workflows",
    ],
    tags: ["PHP", "JavaScript", "Geofencing", "MySQL"],
    active: false,
  },
];

export const PROFILE = {
  name: "Ananda Bintang Saputra",
  callsign: "Ananda Bintang",
  title: "Backend Engineer",
  avatarUrl: "/ananda-bintang.png",
  headline: "Backend Engineer",
  subheadline:
    "Backend Engineer with experience building scalable and production-ready systems, currently contributing to enterprise B2B and B2C platforms at Weekend Inc. for PT HM Sampoerna, including AYO KASIR and AYO QONCIERGE.",
  location: "Sidoarjo, East Java, Indonesia",
  phone: "085330632334",
  email: "anandabintang4@gmail.com",
  github: "https://github.com/AnandaBintang",
  linkedin: "https://www.linkedin.com/in/ananda-bintang-7a7400229/",
  instagram: "https://instagram.com/bn.tang",
  instagramHandle: "@bn.tang",
  resumeUrl: "/Ananda_Bintang_Saputra_CV.pdf",
  languages: [
    { name: "English", level: "Professional Working Proficiency" },
    { name: "Indonesian", level: "Native" },
  ],
  education: {
    degree: "Associate Degree in Computer Science",
    school: "Telkom University",
    period: "Sep 2023 – Sep 2027",
    highschool: "SMKS Antartika 2 Sidoarjo",
    highschoolMajor: "Software Engineering",
    highschoolPeriod: "Aug 2020 – Jun 2023",
  },
};
