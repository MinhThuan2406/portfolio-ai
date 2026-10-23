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

export const projects: Project[] = [
  {
    code: 'PROJECT / 02',
    title: 'Capstone Learning Telemetry & Analytics Platform',
    role: 'ITP INTERNSHIP · CAPSTONE RESEARCH',
    description: 'Our MOOC platform tracked learner interactions via xAPI, but synchronous LTI 1.3 handshakes were slowing page loads to a crawl. I decoupled the handshake flow, built an asynchronous pipeline to ingest 152k+ events into MySQL under 120ms latency, and verified the TTFB reduction using Playwright CDP traces (Mann–Whitney U=0, p<0.01).',
    systems: ['xAPI TELEMETRY', 'MYSQL OPTIMIZATION', 'JMETER LOAD TESTING', 'CDP BENCHMARKS'],
  },
  {
    code: 'PROJECT / 03',
    title: 'WARP Multi-Agent Recommendation Engine',
    role: 'HIPTECH INTERNSHIP',
    description: 'Engineered an autonomous product recommendation service for 50,000+ hardware catalog items. Built stateful LangGraph agentic workflows, indexed E5 dense vector embeddings in Milvus, and sustained sub-250ms semantic query responses on live endpoints.',
    systems: ['LANGGRAPH', 'MILVUS VECTOR DB', 'E5 EMBEDDINGS', 'FASTAPI'],
  },
  {
    code: 'PROJECT / 04',
    title: 'Corsair Hardware Scanner & Anomaly Detector',
    role: 'HIPTECH INTERNSHIP',
    description: 'Designed a hybrid SQL and vector ingestion pipeline across 50,000+ hardware SKU specifications. Implemented real-time schema validation and anomaly detection to catch corrupted supplier spec sheets before they hit the search catalog.',
    systems: ['POSTGRESQL', 'ANOMALY DETECTION', 'VECTOR INGESTION', 'DOCKER'],
  },
];

export const capabilityGroups: CapabilityGroup[] = [
  {
    label: 'AI & Retrieval',
    items: ['PyTorch', 'LangGraph & LangChain', 'Qdrant & ChromaDB', 'Hugging Face / Transformers', 'Whisper & Ollama', 'PaddleOCR'],
  },
  {
    label: 'Backend & APIs',
    items: ['FastAPI (asyncio / uvloop)', 'Pydantic v2', 'Go & C++', 'Uvicorn & Gunicorn', 'Nginx', 'Postman'],
  },
  {
    label: 'Data & Storage',
    items: ['PostgreSQL & pgvector', 'MySQL 8.0', 'Redis', 'DuckDB', 'xAPI (TinCan)', 'SQLAlchemy & asyncpg'],
  },
  {
    label: 'DevOps & Systems',
    items: ['Docker & Docker Compose', 'Apache JMeter', 'OpenTelemetry', 'Linux / Bash', 'Git & GitHub Actions', 'Android Automotive OS'],
  },
];
