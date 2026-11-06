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
  badge: 'TEAM LEADER · JUL 2026 – AUG 2026',
  recognition: 'FPT Automotive Hackathon · Top 13/300+ teams',
  title: 'In-Cockpit Vehicle Copilot',
  subtitle: 'Hybrid RAG & Spatial OCR for Automotive Service Manuals',
  summary:
    'Built during the FPT Automotive Hackathon 2026: an embedded voice assistant prototype for Android Automotive OS designed to query 84 dense vehicle service manuals and return grounded page and part-number citations.',
  breakdown: [
    {
      num: '01',
      label: 'Dual-Path Ingestion',
      text: 'Bifurcated document ingestion: routed clean prose to dense embedding while isolating schematics and multi-column tables into RapidOCR for spatial layout reconstruction.',
    },
    {
      num: '02',
      label: 'Hybrid RRF & Reranking',
      text: 'Merged BM25 (exact fuse codes/part IDs) with ChromaDB dense embeddings via Reciprocal Rank Fusion, refined by a Cross-Encoder to guarantee pinpoint context accuracy.',
    },
    {
      num: '03',
      label: 'Cockpit Latency Budget',
      text: 'Decoupled the voice interaction loop from Cross-Encoder inference using an async FastAPI router with early intent classification and parallel chunk prefetching.',
    },
  ],
  evidence: [
    {
      label: 'INGESTION CORPUS',
      value: '84 Workshop Manuals (PDF Schematics & Wiring)',
    },
    {
      label: 'RETRIEVAL ALGORITHM',
      value: 'BM25 + ChromaDB Dense (Reciprocal Rank Fusion)',
    },
    {
      label: 'CITATION GROUNDING',
      value: '100% Verifiable Manual Page Numbers & Fuse IDs',
    },
    {
      label: 'INTENT ROUTING GATEWAY',
      value: '<80ms Asynchronous Classification & Prefetch',
      isLive: true,
    },
  ],
  notes: [
    {
      code: 'A',
      title: 'The practical challenge: Tabular data & schematics break naive RAG',
      content:
        'Standard RAG pipelines assume documents consist of linear, clean prose. Automotive workshop manuals are dominated by multi-column fuse assignments, wiring pinouts, and torque tables. Standard recursive character splitters shattered tabular structures across chunks, causing dense vector retrievers to hallucinate pin locations or drop exact alphanumeric identifiers during diagnostic lookups.',
      defaultOpen: true,
    },
    {
      code: 'B',
      title: 'Engineering the solution: Spatial OCR reconstruction & hybrid RRF',
      content:
        'We engineered a dual-stream parsing pipeline. Text-heavy sections passed directly to dense chunking, while structured diagrams were parsed through RapidOCR to preserve 2D coordinate bounding boxes and key-value pairings. For retrieval, BM25 captured exact part numbers and fuse codes that dense embeddings typically blur, while ChromaDB captured colloquial driver phrasing. Reciprocal Rank Fusion (RRF) synthesized both candidate pools before passing them to a Cross-Encoder for deep semantic scoring.',
    },
    {
      code: 'C',
      title: 'Latency budget engineering: Decoupled routing on edge automotive hardware',
      content:
        'Running Cross-Encoder rerankers directly within an automotive hardware environment introduces latency bottlenecks for real-time voice interactions. To keep the UI responsive, we designed an asynchronous FastAPI gateway that classifies driver intent within milliseconds, returning immediate state acknowledgment while prefetching candidate manual chunks and computing rerank scores concurrently in the background.',
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
      'Serving over 10,000 active students across university MOOC courses. Synchronous telemetry requests during interactive quiz loads were blocking the browser thread and slowing down page handshakes. Decoupled tracking into an asynchronous ingestion pipeline for xAPI (TinCan) event streams, optimized MySQL batch indexing and connection pooling for 152,714+ cumulative production events with p95 writes under 120ms, and validated system headroom using Apache JMeter simulating 500 concurrent users under peak quiz load.',
    systems: ['PYTHON', 'FASTAPI', 'MYSQL 8.0', 'XAPI (TINCAN)', 'DOCKER', 'APACHE JMETER', 'PLAYWRIGHT'],
    metrics: [
      { value: '152k+', label: 'Cumulative xAPI events' },
      { value: '<120ms', label: 'p95 MySQL write latency' },
      { value: '500', label: 'JMeter virtual users' },
    ],
  },
  {
    code: 'PROJECT 03 // JUN 2025 – JAN 2026',
    index: '03',
    title: 'WARP Multi-Agent Recommendation Engine',
    role: 'AI ENGINEER INTERN · HIPTECH',
    period: 'JUN 2025 – JAN 2026',
    description:
      'Built a semantic search and recommendation service covering a catalog of 50,000+ hardware SKUs. Orchestrated stateful agent workflows using LangGraph to handle user clarification turns and hardware compatibility checks. Integrated Milvus vector database with E5 embeddings, maintaining average semantic query turnaround times below 250ms across containerized FastAPI endpoints.',
    systems: ['PYTHON', 'LANGGRAPH', 'MILVUS', 'E5 EMBEDDINGS', 'FASTAPI', 'DOCKER'],
    metrics: [
      { value: '50k+', label: 'Hardware catalog SKUs' },
      { value: '<250ms', label: 'Average query latency' },
      { value: 'Milvus', label: 'E5 vector indexing' },
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
      { value: 'Pydantic', label: 'Strict v2 schema gates' },
      { value: ' Dedupe', label: 'SKU & pinout audit' },
      { value: 'Batch', label: 'PostgreSQL staging' },
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
      'FastAPI (asyncio / uvloop runtimes)',
      'Pydantic v2 (Strict Schema & Type Contracts)',
      'Uvicorn & Gunicorn Worker Concurrency',
      'Nginx Reverse Proxy & SSL Termination',
      'Asynchronous Background Tasks & WebSockets',
      'Database Connection Pooling & Async Session Lifecycles',
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
    period: '2022 – 2026',
    badge: 'ACADEMIC FOUNDATION',
    title: 'B.S. in Computer Science & Engineering · International University (VNU-HCM)',
    description:
      'Coursework centered on Distributed Systems, AI Algorithms, Computer Networks, and Database Internals. GPA: 3.0 / 4.0.',
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
    title: 'Team Leader · FPT Automotive Hackathon 2026',
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
      'Actively seeking AI Engineer or Backend Engineer roles in Ho Chi Minh City or remote to contribute to search architecture, data pipelines, and scalable APIs.',
    isHighlight: true,
    ctaText: 'Initiate Handshake',
    ctaHref: '#contact',
  },
];
