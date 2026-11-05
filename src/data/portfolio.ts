export interface ProjectMetric {
  value: string;
  label: string;
}

export interface Project {
  code: string;
  index: string;
  title: string;
  role: string;
  period: string;
  description: string;
  systems: string[];
  metrics: [ProjectMetric, ProjectMetric, ProjectMetric];
}

export interface CapabilityGroup {
  code: string;
  label: string;
  summary: string;
  items: string[];
}

export interface Checkpoint {
  id: string;
  index: string;
  period: string;
  badge: string;
  title: string;
  description: string;
  isHighlight?: boolean;
  ctaText?: string;
  ctaHref?: string;
}

export interface SystemNote {
  code: string;
  title: string;
  content: string;
  defaultOpen?: boolean;
}

export const featuredDossier = {
  code: 'PROJECT 01 · ANDROID AUTOMOTIVE OS',
  badge: 'TEAM LEAD · JUL 2026 – AUG 2026',
  recognition: 'FPT Automotive Hackathon · Top 13 Finalist nationwide (300+ teams)',
  title: 'In-Cockpit Vehicle Copilot',
  subtitle: 'Diagnosing Vehicle Manuals Without The Guesswork',
  summary:
    'When a driver asks about an active dashboard warning light at 80 km/h, the system cannot afford a slow response or an invented answer. We built an embedded voice assistant for Android Automotive OS designed to query 84 dense vehicle service manuals with verifiable page and part-number citations.',
  breakdown: [
    {
      num: '01',
      label: 'Spatial OCR Fallback',
      text: 'We split the document processing pipeline. Clean textual sections were sent directly to standard vector indexing, while pages containing schematics and tables were processed via RapidOCR to reconstruct spatial key-value relationships before embedding.',
    },
    {
      num: '02',
      label: 'Hybrid Search & Reranking',
      text: 'We combined BM25 (for exact part numbers and fuse codes) with ChromaDB dense embeddings (for natural driver phrasing) using Reciprocal Rank Fusion (RRF), followed by a Cross-Encoder reranker to prioritize the most relevant context.',
    },
    {
      num: '03',
      label: 'Within Cockpit Latency Budget',
      text: 'Cross-encoders introduced roughly 25–40ms of latency on local hardware. To keep voice interaction seamless, we implemented an asynchronous FastAPI router (<5ms) to classify driver intent immediately while prefetching candidate manual chunks in parallel.',
    },
  ],
  evidence: [
    {
      label: 'PRACTICAL CHALLENGE',
      value: 'Schematics and fuse tables caused diagnostic lookups to miss 24% of initial test queries',
    },
    {
      label: 'ENGINEERING SOLUTION',
      value: 'RapidOCR spatial reconstruction paired with hybrid BM25 + dense ChromaDB and RRF',
    },
    {
      label: 'BENCHMARK OUTCOME',
      value: 'Eliminated the 24% retrieval failure rate with exact page and pinout citations',
    },
    {
      label: 'VOICE INTENT ROUTER',
      value: 'Asynchronous FastAPI intent classification <5ms on cockpit runtime',
      isLive: true,
    },
  ],
  notes: [
    {
      code: 'A',
      title: 'The practical challenge: Manuals are packed with diagrams & fuse tables',
      content:
        'Automotive technical manuals are not clean prose. They are packed with pinout schematics, torque tables, and multi-column fuse layouts. Standard text splitters and dense embeddings destroyed table structures and completely missed labels inside diagrams—causing diagnostic lookups to fail in 24% of our initial test queries.',
      defaultOpen: true,
    },
    {
      code: 'B',
      title: 'Engineering the solution: Spatial OCR fallback & hybrid search with RRF',
      content:
        'We split the document processing pipeline. Clean textual sections were sent directly to standard vector indexing, while pages containing schematics and tables were processed via RapidOCR to reconstruct spatial key-value relationships before embedding. We combined BM25 (for exact part numbers and fuse codes) with ChromaDB dense embeddings (for natural driver phrasing) using Reciprocal Rank Fusion (RRF), followed by a Cross-Encoder reranker.',
    },
    {
      code: 'C',
      title: 'Keeping within the cockpit latency budget: Decoupled intent routing (<5ms)',
      content:
        'Cross-encoders introduced roughly 25–40ms of latency on local hardware. To keep voice interaction seamless, we implemented an asynchronous FastAPI router (<5ms) to classify driver intent immediately while prefetching candidate manual chunks in parallel.',
    },
  ] as SystemNote[],
};

export const projects: Project[] = [
  {
    code: 'PROJECT 02 // FEB 2026 – JUL 2026',
    index: '02',
    title: 'High-Throughput Learning Telemetry & Analytics Platform',
    role: 'SOFTWARE ENGINEER INTERN & CAPSTONE RESEARCHER · ITP (VNU-HCM)',
    period: 'FEB 2026 – JUL 2026',
    description:
      'Serving over 10,000 active students across university MOOC courses. Synchronous telemetry requests during interactive quiz loads were blocking the browser thread and slowing down page handshakes. Decoupled tracking into an asynchronous ingestion pipeline for xAPI (TinCan) event streams, optimized MySQL batch indexing for 152,714+ events with p95 writes under 120ms, and validated stability using Apache JMeter simulating 500 concurrent users during peak registration.',
    systems: ['PYTHON', 'FASTAPI', 'MYSQL 8.0', 'XAPI (TINCAN)', 'DOCKER', 'APACHE JMETER', 'PLAYWRIGHT'],
    metrics: [
      { value: '152k+', label: 'xAPI events streamed' },
      { value: '<120ms', label: 'p95 MySQL write latency' },
      { value: '500', label: 'Concurrent users verified' },
    ],
  },
  {
    code: 'PROJECT 03 // JUN 2025 – JAN 2026',
    index: '03',
    title: 'WARP Multi-Agent Recommendation Engine',
    role: 'AI ENGINEER INTERN · HIPTECH',
    period: 'JUN 2025 – JAN 2026',
    description:
      'Built a semantic search and recommendation service covering a catalog of 50,000+ hardware SKUs. Orchestrated stateful agent workflows using LangGraph to handle user clarification turns and hardware compatibility checks. Integrated Milvus vector database with E5 embeddings, maintaining average semantic query turnaround times below 250ms on live endpoints with 99.5% containerized uptime.',
    systems: ['PYTHON', 'LANGGRAPH', 'MILVUS', 'E5 EMBEDDINGS', 'FASTAPI', 'DOCKER'],
    metrics: [
      { value: '50k+', label: 'Hardware catalog SKUs' },
      { value: '<250ms', label: 'Average query latency' },
      { value: '99.5%', label: 'Containerized uptime' },
    ],
  },
  {
    code: 'PROJECT 04 // JUN 2025 – JAN 2026',
    index: '04',
    title: 'Hardware Spec Sheet Validator & Anomaly Pipeline',
    role: 'AI ENGINEER INTERN · HIPTECH',
    period: 'JUN 2025 – JAN 2026',
    description:
      'Designed an automated ingestion pipeline to audit incoming supplier specification sheets before records entered the production catalog. Implemented strict schema validation and anomaly detection using Pydantic v2 and PostgreSQL to catch malformed units, conflicting pinout specs, and duplicate SKUs—preventing corrupted supplier data from reaching production search indexes.',
    systems: ['PYTHON', 'POSTGRESQL', 'PYDANTIC V2', 'ANOMALY DETECTION', 'DOCKER'],
    metrics: [
      { value: '100%', label: 'Schema gate coverage' },
      { value: '0', label: 'Corrupted catalog writes' },
      { value: '24/7', label: 'Automated spec ingestion' },
    ],
  },
];

export const capabilityGroups: CapabilityGroup[] = [
  {
    code: 'LAYER 01',
    label: 'AI & Retrieval Systems',
    summary: 'Hybrid sparse + dense search, Reciprocal Rank Fusion, Cross-Encoder reranking, and spatial OCR.',
    items: [
      'Hybrid Sparse + Dense Search',
      'Reciprocal Rank Fusion (RRF)',
      'Cross-Encoder Reranking',
      'Milvus, ChromaDB, Qdrant, pgvector',
      'RapidOCR & PaddleOCR (Spatial Parsing)',
      'LangGraph, LangChain, Transformers',
    ],
  },
  {
    code: 'LAYER 02',
    label: 'Backend & API Architecture',
    summary: 'Low-latency asynchronous services, strict Pydantic typing, and reverse proxying.',
    items: [
      'FastAPI (asyncio / uvloop)',
      'Spring Boot',
      'Pydantic v2 (Strict Schema Contracts)',
      'Uvicorn & Gunicorn concurrency',
      'Nginx reverse proxying',
      'Python, SQL, Java, C++, Go',
    ],
  },
  {
    code: 'LAYER 03',
    label: 'Data & Storage Internals',
    summary: 'Relational indexing, connection pooling, caching, and event stream telemetry.',
    items: [
      'PostgreSQL & pgvector',
      'MySQL 8.0 (Indexing & Pool Tuning)',
      'Redis (Cache & Session State)',
      'xAPI (TinCan Event Telemetry)',
      'SQLAlchemy & asyncpg',
      'DuckDB',
    ],
  },
  {
    code: 'LAYER 04',
    label: 'Infrastructure & Systems',
    summary: 'Containerization, load verification, Linux workflows, and embedded edge targets.',
    items: [
      'Docker & Docker Compose',
      'Apache JMeter (Load & Stress Testing)',
      'OpenTelemetry Profiling',
      'Playwright',
      'Linux (Ubuntu / WSL2) & Bash',
      'Android Automotive OS',
    ],
  },
];

export const checkpoints: Checkpoint[] = [
  {
    id: 'checkpoint-00',
    index: '00',
    period: '2022 – LATE 2026',
    badge: 'ACADEMIC FOUNDATION',
    title: 'B.S. in Computer Science & Engineering · International University (VNU-HCM)',
    description:
      'Coursework centered on Distributed Systems, AI Algorithms, Computer Networks, and Database Internals. GPA: 3.0 / 4.0. Expected graduation late 2026.',
  },
  {
    id: 'checkpoint-01',
    index: '01',
    period: 'JUN 2025 – JAN 2026',
    badge: 'INDUSTRY INTERNSHIP',
    title: 'AI Engineer Intern · HIPTECH Co., Ltd.',
    description:
      'Engineered semantic search microservices, vector ingestion pipelines, and catalog validation tools using LangGraph, Milvus, and FastAPI.',
  },
  {
    id: 'checkpoint-02',
    index: '02',
    period: 'FEB 2026 – JUL 2026',
    badge: 'CAPSTONE RESEARCH & INTERNSHIP',
    title: 'Software Engineer Intern · Information Technology Park (ITP), VNU-HCM',
    description:
      'Designed high-throughput telemetry pipelines for 10,000+ students. Optimized database write bottlenecks and documented empirical benchmarks with JMeter.',
  },
  {
    id: 'checkpoint-03',
    index: '03',
    period: 'JUL 2026 – AUG 2026',
    badge: 'HACKATHON LEADERSHIP',
    title: 'Team Lead · FPT Automotive Hackathon 2026',
    description:
      'Led a 5-member team to Top 13 nationwide out of 300+ teams. Designed an in-cockpit RAG voice assistant capable of parsing complex schematics under strict hardware latency limits.',
  },
  {
    id: 'checkpoint-04',
    index: '04',
    period: 'LATE 2026 →',
    badge: 'NEXT CHAPTER',
    title: 'Full-Time AI Engineer or Backend Engineer Roles',
    description:
      'Graduating in late 2026. Actively seeking roles in Ho Chi Minh City or remote where I can contribute to search architecture, data pipelines, and scalable APIs.',
    isHighlight: true,
    ctaText: "Let's build dependable systems",
    ctaHref: '#contact',
  },
];
