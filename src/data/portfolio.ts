export interface Project {
  code: string;
  title: string;
  role: string;
  description: string;
  systems: string[];
}

export interface CapabilityGroup {
  label: string;
  items: string[];
}

export interface Checkpoint {
  id: string;
  period: string;
  badge: string;
  title: string;
  description: string;
  isHighlight?: boolean;
  ctaText?: string;
  ctaHref?: string;
}

export const projects: Project[] = [
  {
    code: 'PROJECT / 02',
    title: 'Capstone Learning Telemetry & Analytics Platform',
    role: 'ITP INTERNSHIP · CAPSTONE RESEARCH',
    description:
      'Our learning platform serves 10,000+ active students, but synchronous iframe handshakes were bottlenecking initial page loads. I decoupled the handshake flow, built an async pipeline streaming 152k+ learner logs into MySQL under 120ms, and verified the speedup under 500 concurrent users.',
    systems: ['xAPI TELEMETRY', 'MYSQL OPTIMIZATION', 'JMETER STRESS TESTS', 'PLAYWRIGHT TRACES'],
  },
  {
    code: 'PROJECT / 03',
    title: 'WARP Multi-Agent Recommendation Engine',
    role: 'HIPTECH INTERNSHIP',
    description:
      'Built a semantic recommendation service across 50,000+ hardware items. Wired up stateful LangGraph agentic workflows with Milvus vector search to keep semantic query response times consistently under 250ms on live endpoints.',
    systems: ['LANGGRAPH', 'MILVUS VECTOR DB', 'E5 EMBEDDINGS', 'FASTAPI'],
  },
  {
    code: 'PROJECT / 04',
    title: 'Corsair Hardware Scanner & Anomaly Detector',
    role: 'HIPTECH INTERNSHIP',
    description:
      'Designed an ingestion and anomaly detection pipeline to scan supplier spec sheets before they enter the search catalog. Caught malformed data and corrupted schema values early, saving the team hours of manual cleanup.',
    systems: ['POSTGRESQL', 'ANOMALY DETECTION', 'VECTOR INGESTION', 'DOCKER'],
  },
];

export const capabilityGroups: CapabilityGroup[] = [
  {
    label: 'AI & Retrieval',
    items: [
      'PyTorch',
      'LangGraph & LangChain',
      'Qdrant & ChromaDB',
      'Hugging Face / Transformers',
      'Whisper & Ollama',
      'PaddleOCR',
    ],
  },
  {
    label: 'Backend & APIs',
    items: [
      'FastAPI (asyncio / uvloop)',
      'Pydantic v2',
      'Go & C++',
      'Uvicorn & Gunicorn',
      'Nginx',
      'Postman',
    ],
  },
  {
    label: 'Data & Storage',
    items: [
      'PostgreSQL & pgvector',
      'MySQL 8.0',
      'Redis',
      'DuckDB',
      'xAPI (TinCan)',
      'SQLAlchemy & asyncpg',
    ],
  },
  {
    label: 'DevOps & Systems',
    items: [
      'Docker & Docker Compose',
      'Apache JMeter',
      'OpenTelemetry',
      'Linux / Bash',
      'Git & GitHub Actions',
      'Android Automotive OS',
    ],
  },
];

export const checkpoints: Checkpoint[] = [
  {
    id: 'checkpoint-00',
    period: '2022 - 2026',
    badge: 'CHECKPOINT 00 · GROUND ZERO',
    title: 'B.S. in Computer Science & Engineering · International University (VNU-HCM)',
    description:
      'Where it all started. Coursework focused on Distributed Systems, Artificial Intelligence algorithms, and Database Internals. GPA 3.0 / 4.0, graduating late 2026.',
  },
  {
    id: 'checkpoint-01',
    period: 'JUN 2025 - JAN 2026',
    badge: 'CHECKPOINT 01 · MICROSERVICES',
    title: 'AI Engineer Intern · HIPTECH',
    description:
      'Shipped backend inference and vector ingestion services for WARP and Corsair Scanner. Kept microservices running inside Docker containers with 99.5% uptime.',
  },
  {
    id: 'checkpoint-02',
    period: 'FEB - JUL 2026',
    badge: 'CHECKPOINT 02 · HIGH LOAD',
    title: 'Software Engineer Intern · ITP',
    description:
      'Optimized core APIs serving 10,000+ active students. Streamed 152,714+ telemetry events into MySQL under 120ms and cut page load lag during peak traffic.',
  },
  {
    id: 'checkpoint-03',
    period: 'JUL - AUG 2026',
    badge: 'CHECKPOINT 03 · HACKATHON',
    title: 'Team Lead · FPT Automotive Hackathon 2026',
    description:
      'Pitched and engineered an Agentic RAG voice assistant on Android Automotive OS. Handled messy vehicle schematics with OCR fallbacks to take our team to Top 13 nationwide out of 300+ teams.',
  },
  {
    id: 'checkpoint-next',
    period: 'LATE 2026 →',
    badge: 'CHECKPOINT [?] · NEXT DEPLOYMENT',
    title: 'Your engineering team, maybe.',
    description:
      'Graduating late 2026. Looking for an engineering team where I can solve real backend bottlenecks, build scalable data systems, and ship products users rely on.',
    isHighlight: true,
    ctaText: "Initiate handshake / Let's talk",
    ctaHref: '#contact',
  },
];
