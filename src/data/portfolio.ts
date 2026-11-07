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
  code: 'PROJECT 01',
  badge: 'JUL 2026 – AUG 2026',
  recognition: 'FPT Automotive Hackathon',
  title: 'In-Cockpit Vehicle Copilot',
  subtitle: 'Hybrid RAG & Document Layout Parsing for Automotive Manuals',
  summary:
    'A hackathon prototype exploring how to ground LLM responses in dense, non-linear service manuals while respecting edge device latency constraints.',
  breakdown: [
    {
      num: '01',
      label: 'Document Ingestion',
      text: 'Separated standard text paragraphs from schematics and multi-column pinout tables using RapidOCR to preserve structural layout.',
    },
    {
      num: '02',
      label: 'Hybrid Search',
      text: 'Combined BM25 (for exact fuse codes and part numbers) with ChromaDB dense embeddings via Reciprocal Rank Fusion (RRF), refined with a Cross-Encoder for context precision.',
    },
    {
      num: '03',
      label: 'Latency Considerations',
      text: 'Decoupled voice audio streaming from heavier model inference using an async FastAPI router with early intent classification.',
    },
  ],
  evidence: [
    {
      label: 'CORPUS',
      value: '84 Workshop Manuals (PDF Schematics & Tables)',
    },
    {
      label: 'RETRIEVAL',
      value: 'BM25 + ChromaDB (Reciprocal Rank Fusion)',
    },
    {
      label: 'GROUNDING',
      value: 'Verifiable manual page numbers & fuse IDs',
    },
    {
      label: 'ROUTER',
      value: 'Asynchronous classification & chunk prefetch',
      isLive: true,
    },
  ],
  notes: [
    {
      code: 'A',
      title: 'The Problem: Naive text splitting broke table structures',
      content:
        'Naive text splitting broke table structures across chunks, causing dense embedding models to lose exact alphanumeric part IDs.',
      defaultOpen: true,
    },
    {
      code: 'B',
      title: 'The Approach: Spatial OCR extraction and hybrid retrieval',
      content:
        'Experimented with spatial OCR extraction to keep table rows intact and layered BM25 keyword matching on top of vector search.',
    },
    {
      code: 'C',
      title: 'The Trade-off: Balanced reranker accuracy against edge latency',
      content:
        'Balanced reranker accuracy against edge latency limits by filtering candidate chunks early in the pipeline.',
    },
  ] as SystemNote[],
};

export const projects: Project[] = [
  {
    code: 'PROJECT 02 // FEB 2026 – JUL 2026',
    index: '02',
    title: 'High-Throughput Learning Telemetry Pipeline',
    role: 'SOFTWARE ENGINEER INTERN & RESEARCHER · ITP (VNU-HCM)',
    period: 'FEB 2026 – JUL 2026',
    description:
      'Assisted in upgrading telemetry ingestion for online course quizzes. Decoupled synchronous tracking into an asynchronous xAPI event queue, optimized MySQL indexes and connection pools for 152k+ recorded events, and benchmarked system behavior under peak loads using Apache JMeter.',
    systems: ['Python', 'FastAPI', 'MySQL 8.0', 'Docker', 'Apache JMeter', 'xAPI'],
    metrics: [
      { value: '152k+', label: 'Events Logged' },
      { value: '<120ms', label: 'p95 Writes' },
      { value: '500', label: 'Virtual Users (JMeter)' },
    ],
  },
  {
    code: 'PROJECT 03 // JUN 2025 – JAN 2026',
    index: '03',
    title: 'WARP Catalog Search & Recommendation Service',
    role: 'AI ENGINEER INTERN · HIPTECH',
    period: 'JUN 2025 – JAN 2026',
    description:
      'Assisted in building a semantic search service across a catalog of 50,000+ hardware components. Integrated Milvus with E5 embeddings and explored stateful agent workflows with LangGraph to handle user clarification questions.',
    systems: ['Python', 'FastAPI', 'Milvus', 'LangGraph', 'Docker'],
    metrics: [
      { value: '50k+', label: 'Catalog SKUs' },
      { value: '<250ms', label: 'Average Query Time' },
      { value: 'Milvus', label: 'Vector Search' },
    ],
  },
  {
    code: 'PROJECT 04 // JUN 2025 – JAN 2026',
    index: '04',
    title: 'Component Spec Sheet Ingestion & Validator',
    role: 'AI ENGINEER INTERN · HIPTECH',
    period: 'JUN 2025 – JAN 2026',
    description:
      'Built data cleaning scripts and validation pipelines to audit raw supplier specification sheets before indexing, using Pydantic v2 and PostgreSQL to filter out duplicate SKUs and malformed electrical units.',
    systems: ['Python', 'PostgreSQL', 'Pydantic v2', 'Docker'],
    metrics: [
      { value: 'Pydantic v2', label: 'Strict Validation' },
      { value: 'Dedupe', label: 'Data Cleaning' },
      { value: 'PostgreSQL', label: 'Staging Database' },
    ],
  },
];

export const capabilityGroups: CapabilityGroup[] = [
  {
    code: 'LAYER 01',
    label: 'RETRIEVAL & AI',
    summary: 'Hybrid search, ranking, vector stores, and layout parsing.',
    items: [
      'Hybrid Search (BM25 + Dense Embeddings)',
      'Reciprocal Rank Fusion (RRF) & Cross-Encoder Reranking',
      'Vector Databases: Milvus, ChromaDB',
      'Layout & OCR Parsing: RapidOCR',
      'Workflow Orchestration: LangGraph, LangChain',
    ],
  },
  {
    code: 'LAYER 02',
    label: 'BACKEND & APIS',
    summary: 'Async I/O, strict validation contracts, and robust service design.',
    items: [
      'Python / FastAPI (Async I/O & Concurrency)',
      'Pydantic v2 (Data Validation & Contracts)',
      'Database Sessions & Connection Pooling',
      'RESTful API Design & Background Tasks',
    ],
  },
  {
    code: 'LAYER 03',
    label: 'DATA & STORAGE',
    summary: 'Relational schemas, caching layers, and telemetry standards.',
    items: [
      'PostgreSQL',
      'MySQL 8.0',
      'Redis (Basic Caching & Session State)',
      'Event Telemetry (xAPI Standards)',
    ],
  },
  {
    code: 'LAYER 04',
    label: 'INFRASTRUCTURE & TOOLS',
    summary: 'Containerization, load simulation, and system workflows.',
    items: [
      'Docker & Docker Compose',
      'Apache JMeter (Load Simulation & Bottleneck Profiling)',
      'Linux (Ubuntu / WSL2) & Git Workflows',
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
      'Relevant coursework in Database Systems, Distributed Systems, Computer Networks, and AI. Cumulative GPA: 3.0 / 4.0.',
  },
  {
    id: 'checkpoint-01',
    index: '01',
    period: 'JUN 2025 – JAN 2026',
    badge: 'INTERNSHIP',
    title: 'AI Engineer Intern · HIPTECH Co., Ltd.',
    description:
      'Gained initial industry experience working with semantic search microservices, vector databases (Milvus), and catalog data validation.',
  },
  {
    id: 'checkpoint-02',
    index: '02',
    period: 'FEB 2026 – JUL 2026',
    badge: 'INTERNSHIP & CAPSTONE',
    title: 'Software Engineer Intern & Researcher · ITP (VNU-HCM)',
    description:
      'Practiced backend optimization by decoupling quiz telemetry ingestion and profiling database throughput with JMeter.',
  },
  {
    id: 'checkpoint-03',
    index: '03',
    period: 'JUL 2026 – AUG 2026',
    badge: 'HACKATHON',
    title: 'Team Leader · FPT Automotive Hackathon 2026',
    description:
      'Collaborated with a 5-member team to reach Top 13 out of over 300 teams nationwide, prototyping an embedded RAG assistant for vehicle technical manuals.',
  },
  {
    id: 'checkpoint-04',
    index: '04',
    period: 'LATE 2026 →',
    badge: "WHAT'S NEXT",
    title: 'Fresher / Junior AI & Backend Engineer',
    description:
      'Actively seeking opportunities in Ho Chi Minh City or remote to learn from experienced engineering teams, solve real data challenges, and grow.',
    isHighlight: true,
    ctaText: 'Get in touch',
    ctaHref: '#contact',
  },
];
