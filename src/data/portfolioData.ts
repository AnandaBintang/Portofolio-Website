export interface ProjectTrack {
  id: string;
  trackNumber: string;
  title: string;
  category: string;
  duration: string;
  role: string;
  description: string;
  stack: string[];
  keyDeliverables: string[];
  metrics: string;
  liveUrl?: string;
  githubUrl?: string;
}

export interface ExperienceSession {
  sessionNo: string;
  period: string;
  role: string;
  company: string;
  location: string;
  highlights: string[];
  tags: string[];
}

export interface SkillFrequency {
  band: string;
  label: string;
  level: number; // 0 - 100 fader level
  gainDb: string;
  skills: string[];
  note: string;
}

export const PORTFOLIO_DATA = {
  profile: {
    name: "Ananda Bintang Saputra",
    callsign: "Ananda Bintang",
    title: "Backend Engineer",
    currentLocation: "Sidoarjo, East Java, Indonesia",
    status: "READY FOR PRODUCTION",
    email: "anandabintang4@gmail.com",
    phone: "+62 853-3063-2334",
    github: "https://github.com/AnandaBintang",
    instagram: "https://instagram.com/anandabintang4",
    linkedin: "https://linkedin.com/in/ananda-bintang",
    education: {
      degree: "Associate Degree in Computer Science",
      institution: "Telkom University",
      period: "Sep 2023 - Sep 2027",
    },
    bio: "Backend Engineer with experience building scalable, production-ready microservices and RESTful API ecosystems. Currently contributing to enterprise B2B & B2C platforms at Weekend Inc. for PT HM Sampoerna (AYO KASIR & AYO QONCIERGE). Specialized in database query optimization, clean architecture, automated quality pipelines, and high-reliability server architectures.",
  },

  projects: [
    {
      id: "ayo-kasir",
      trackNumber: "TRACK 01",
      title: "AYO Kasir by SRC",
      category: "Enterprise Microservices / POS Platform",
      duration: "04:12",
      role: "Core Backend Contributor",
      description: "Comprehensive digital retail ecosystem connecting wholesale partners, convenience stores, and end customers. Features advanced point-of-sale workflows, order management, and realtime inventory synchronization under high-volume load.",
      stack: ["Laravel", "PHP", "Microservices", "PostgreSQL", "AWS", "Jenkins CI/CD", "Payment Gateway"],
      keyDeliverables: [
        "Architected core backend modules for order processing and store inventory",
        "Refactored complex relational queries to eliminate N+1 latency bottlenecks",
        "Implemented standardized error handling and structured observability logs",
        "Engineered automated diff-based linting pipelines using Husky and Commitlint",
      ],
      metrics: "Enterprise Retail Scale / PT HM Sampoerna",
      liveUrl: "https://ayo.src.id",
    },
    {
      id: "ayo-qoncierge",
      trackNumber: "TRACK 02",
      title: "AYO Qoncierge by SRC",
      category: "Enterprise Staff & Coaching Platform",
      duration: "03:45",
      role: "Backend Engineer",
      description: "B2C & B2B operational system managing internal services, field coaches, and enterprise partner coaching workflows with strict data integrity and role-based access control.",
      stack: ["Laravel", "Node.js", "Clean Architecture", "RESTful API", "CI/CD Pipelines", "Docker"],
      keyDeliverables: [
        "Developed modular service layers aligned with domain-driven clean architecture",
        "Constructed role-based authorization modules for staff and coaching personnel",
        "Integrated robust logging to capture critical business mutations and audit trails",
      ],
      metrics: "Multi-Role Enterprise Operations",
    },
    {
      id: "moneymate-api",
      trackNumber: "TRACK 03",
      title: "MoneyMate API",
      category: "Financial Engine / AI-Powered Expense Tracking",
      duration: "03:20",
      role: "Lead Backend Developer",
      description: "Robust financial management engine featuring JWT session revocation, Firebase Google OAuth, AI receipt parsing via Gemini, realtime budget carry-over logic, and automated daily web push notifications.",
      stack: ["Node.js", "Express.js", "Knex.js", "MySQL", "Google Gemini AI", "Web Push VAPID", "Docker"],
      keyDeliverables: [
        "Implemented realtime carry-over, invest, and zero-budget period calculators",
        "Engineered AI receipt scan pipeline extracting structured transactional JSON",
        "Configured strict burst & brute-force rate limiters, HPP, and duplicate request filters",
      ],
      metrics: "Live Dockerized Multi-Tenant Stack",
      githubUrl: "https://github.com/MoneyMate-ABP/moneymate-api",
    },
    {
      id: "ecommerce-topup",
      trackNumber: "TRACK 04",
      title: "High-Volume E-Commerce & Top-up Platform",
      category: "Digital Commerce & Payment Integration",
      duration: "02:58",
      role: "Full Stack Engineer",
      description: "Digital transactions and gaming currency top-up engine with instant automated order fulfillment, secure payment gateway callbacks, and comprehensive audit ledger.",
      stack: ["PHP", "Laravel", "MySQL", "PostgreSQL", "Payment Webhooks", "REST API"],
      keyDeliverables: [
        "Designed idempotent webhook processing to prevent double-crediting",
        "Built responsive administration dashboard for order reconciliation and analytics",
        "Optimized database indices for sub-100ms lookup times during peak transaction hours",
      ],
      metrics: "1,000+ Active User Transactions",
    },
  ] as ProjectTrack[],

  frequencies: [
    {
      band: "LOW-END / 40Hz",
      label: "DATA & PERSISTENCE",
      level: 95,
      gainDb: "+6.0 dB",
      skills: ["PostgreSQL", "MySQL", "Database Indexing", "N+1 Query Elimination", "Knex.js / Eloquent ORM"],
      note: "Solid data foundation. Schema normalization, ACID compliance, and query performance tuning.",
    },
    {
      band: "MID-LOW / 250Hz",
      label: "CORE ARCHITECTURE",
      level: 90,
      gainDb: "+4.5 dB",
      skills: ["Laravel", "Node.js", "Express.js", "Clean Architecture", "Service Layer Pattern"],
      note: "Robust domain logic separation, dependency injection, and modular microservices structure.",
    },
    {
      band: "MID-HIGH / 2.5kHz",
      label: "API & PROTOCOLS",
      level: 92,
      gainDb: "+5.0 dB",
      skills: ["RESTful API Design", "JWT Auth & Revocation", "Rate Limiting & HPP", "Webhooks & Idempotency"],
      note: "Secure communication channels with strict payload verification and deterministic error handling.",
    },
    {
      band: "HIGH-END / 10kHz",
      label: "INFRA & OBSERVABILITY",
      level: 85,
      gainDb: "+3.2 dB",
      skills: ["Docker & Docker Compose", "AWS (EC2, S3, RDS)", "Jenkins CI/CD", "Husky / Commitlint", "Structured Logging"],
      note: "High-clarity delivery pipeline, reproducible container environments, and system tracing.",
    },
  ] as SkillFrequency[],

  sessions: [
    {
      sessionNo: "REC 01",
      period: "July 2025 - Present",
      role: "Backend Engineer",
      company: "Weekend Inc.",
      location: "Jakarta (Remote/Hybrid)",
      highlights: [
        "Contributed to enterprise B2B & B2C platforms for PT HM Sampoerna (AYO KASIR & AYO QONCIERGE)",
        "Engineered scalable backend modules for staff, coach, and store operations",
        "Optimized database efficiency and resolved query bottlenecks across microservices",
        "Implemented diff-based pre-commit quality pipelines across Node.js and Laravel codebases",
      ],
      tags: ["Laravel", "Microservices", "PostgreSQL", "AWS", "Jenkins"],
    },
    {
      sessionNo: "REC 02",
      period: "Oct 2023 - July 2025",
      role: "Web Developer",
      company: "Freelance",
      location: "Sidoarjo / Remote",
      highlights: [
        "Architected bespoke backend systems and APIs for varied business domains",
        "Delivered full-featured e-commerce systems serving 1,000+ active users",
        "Streamlined database queries and improved execution time for heavy transaction logs",
      ],
      tags: ["PHP", "Laravel", "MySQL", "RESTful API"],
    },
    {
      sessionNo: "REC 03",
      period: "Nov 2023 - Sep 2024",
      role: "Assistant Mentor",
      company: "Google Developer Student Club (GDSC)",
      location: "Telkom University",
      highlights: [
        "Mentored 50+ students in modern web development and backend principles",
        "Led practical workshops on REST APIs, relational database design, and Git workflow",
      ],
      tags: ["Mentoring", "Backend Basics", "API Workshops"],
    },
    {
      sessionNo: "REC 04",
      period: "Mar 2023 - Oct 2023",
      role: "Full Stack Developer (Internship)",
      company: "Roleplay Studio",
      location: "Surabaya",
      highlights: [
        "Built interactive company profiles and web apps with custom motion and layout rigor",
        "Collaborated with UI/UX designers to translate Figma design tokens into clean code",
      ],
      tags: ["JavaScript", "HTML/CSS", "Interactions"],
    },
  ] as ExperienceSession[],
};
