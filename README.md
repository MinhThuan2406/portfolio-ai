# Nguyen Minh Thuan — Engineering Portfolio

Personal engineering portfolio of **Nguyen Minh Thuan**, focused on AI Systems, Hybrid Retrieval (RAG), and Asynchronous Backend Services.

Built with **Astro v5**, **TypeScript**, and **Vanilla Scoped CSS** for static delivery, minimal runtime footprint, and high-performance technical storytelling.

---

## Design Inspiration & Acknowledgements

The visual identity and design system of this portfolio draw inspiration from the **[Nualt](https://www.awwwards.com/sites/nualt)** digital platform (designed by **Thomas Sarazin / Nualt Studio**, nominated on [Awwwards](https://www.awwwards.com/sites/nualt)).

Special thanks and appreciation to the original authors for pioneering this aesthetic:

- **Technical Blueprint Aesthetic**: The pairing of warm ivory drafting paper (`#f4f2e8`), deep cobalt ink (`#0755b5`), and verification green accents (`#15803d`).
- **Precision Grid & Hairline Structure**: Mathematical 24-column grid layout, 1px dashed/solid structural borders, and sharp zero-radius geometry.
- **Typographic Balance**: High-contrast display serif/grotesque pairing alongside monospace labels reserved strictly for telemetry, latency metrics, and data indices.
- **Dynamic Telemetry & Wireframe Flows**: Interactive SVG diagrams, canvas-driven packet streams, and interactive system dossiers that treat software engineering as an empirical craft.

> **Note**: While the aesthetic language, layout rhythm, and interactive direction are inspired by Nualt, all software implementations, backend case studies, project metrics, and source code are original work.

---

## Core Focus Areas

- **Hybrid RAG & Document Grounding**: Multi-column PDF layout parsing via RapidOCR, BM25 keyword matching fused with dense embeddings (Milvus / ChromaDB) through Reciprocal Rank Fusion (RRF), and cross-encoder reranking.
- **High-Throughput Telemetry & Backends**: Asynchronous FastAPI endpoints, connection pooling, xAPI event queuing, and high-load stress testing profiled with Apache JMeter.
- **Deterministic Contracts & Data Validation**: Schema validation using Pydantic v2, clean relational modeling (PostgreSQL / MySQL 8.0), and containerized development (Docker Compose).

---

## Tech Stack & Architecture

- **Framework**: [Astro v5](https://astro.build/) (Static Site Generation — 100% pre-rendered HTML)
- **Language**: TypeScript (strict data contracts in `src/data/portfolio.ts`)
- **Styling**: Scoped CSS with architectural design tokens (`src/styles/global.css`)
- **Graphics & Motion**: Native HTML5 Canvas and inline SVGs with `prefers-reduced-motion` compliance
- **Asset Pipeline**: High-efficiency WebP image generation for resume previews (`scripts/sync-cv.mjs`)
- **Hosting & Security**: Vercel with strict HTTP security headers (CSP, HSTS, X-Frame-Options: DENY, Permissions-Policy)

---

## Project Structure

```text
.
├── .agent/                    # Agent rules & skills
├── .gemini/                   # Gemini CLI agent rules
├── public/                    # Static assets, fonts, and resume PDFs
├── scripts/
│   └── sync-cv.mjs            # Automates PDF to WebP conversion for CV modal
├── src/
│   ├── components/            # Astro components
│   │   ├── ContactHandshake.astro
│   │   ├── CvModal.astro
│   │   ├── FeaturedDossier.astro
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── IconArrow.astro
│   │   ├── LoaderCover.astro
│   │   ├── ProductionPipelines.astro
│   │   ├── StackArchitecture.astro
│   │   └── TrajectoryLedger.astro
│   ├── data/
│   │   └── portfolio.ts       # Typed content data and project metrics
│   ├── pages/
│   │   └── index.astro        # Portfolio single-page layout
│   ├── scripts/
│   │   ├── animations.ts      # Canvas streams and interactive visualizers
│   │   ├── interactive.ts     # Modal, clipboard, and navigation listeners
│   │   └── navigation.ts     # Smooth section scrolling and header state
│   └── styles/
│       └── global.css         # Global tokens, typography, and utility classes
├── AGENTS.md                  # Mandatory codebase, security, and anti-slop guidelines
├── DESIGN.md                  # Formal design tokens and blueprint specifications
└── vercel.json                # Deployment configuration and security headers
```

---

## Getting Started

### Prerequisites

- Node.js 18+ (Node.js 20+ recommended)
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/MinhThuan2406/Portfolio.git
cd Portfolio

# Install dependencies deterministically
npm ci
```

### Development

```bash
# Start local development server (default: http://localhost:4321)
npm run dev
```

### Production Build

```bash
# Validate static build output
npm run build

# Preview production build locally
npm run preview
```

### Synchronize Resume Pages

If you update `public/cv.pdf`, regenerate the rendered WebP pages used by the interactive viewer:

```bash
npm run sync:cv
```

---

## Code Quality & Security Standards

This project enforces strict engineering practices outlined in [`AGENTS.md`](AGENTS.md) and [`DESIGN.md`](DESIGN.md):

- **Zero Hardcoded Secrets**: Strict environment variable discipline and comprehensive `.gitignore` protection.
- **Anti-AI-Slop Rules**: Zero filler badges, no arbitrary italics, tabular numbers for metrics, and high WCAG AA contrast.
- **Automated CI/CD**: Automated GitHub Actions security workflow verifying lockfile integrity, dependency auditing, secret scanning, and static build validity.

---

## License

Source code is available under the [MIT License](LICENSE) (or personal portfolio copyright). Design inspiration credited to [Nualt](https://www.awwwards.com/sites/nualt).

