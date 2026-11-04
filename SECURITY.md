# Security Policy & Hardening Documentation

## Reporting a Vulnerability

If you discover a security issue in this repository, please report it privately via email to **thuanmm0426@gmail.com** rather than opening a public GitHub issue. Include:

- A description of the vulnerability and its potential impact.
- Steps to reproduce or the affected file/line locations.

---

## Environment Variables & Secrets Management

1. **Local Environment Files**:
   - Use `.env.example` as a reference template (`cp .env.example .env`).
   - `.env` and `.env.*` (except `.env.example`), private keys (`*.pem`, `*.key`, `*.p12`, `*.pfx`), and local tool directories (`.playwright-mcp/`, `.vercel/`, etc.) are ignored via `.gitignore` and verified by CI.
2. **Client vs. Server Variables in Astro**:
   - Any environment variable prefixed with `PUBLIC_` in Astro is bundled into client-side JavaScript and visible in the browser.
   - **Never** prefix API keys, tokens, database URLs, or private credentials with `PUBLIC_`.
3. **Deployment Secrets**:
   - Store deployment environment variables exclusively in Vercel Project Settings (Environment Variables) or GitHub Actions Encrypted Secrets.

---

## Implemented Codebase Security Measures

- **HTTP Security Headers (`vercel.json`)**:
  - `Content-Security-Policy` restricting script, style, font, image, media, worker (`blob:` for Three.js Draco WebAssembly decoder), frame-ancestors (`'none'`), and object sources (`'none'`).
  - `Strict-Transport-Security` (`max-age=63072000; includeSubDomains; preload`).
  - `Permissions-Policy` explicitly disabling `camera`, `microphone`, `geolocation`, `payment`, and `usb`.
  - `Cross-Origin-Opener-Policy` (`same-origin`), `X-Content-Type-Options` (`nosniff`), `X-Frame-Options` (`DENY`), and `Referrer-Policy` (`strict-origin-when-cross-origin`).
- **DOM & Storage Hardening (`src/`)**:
  - Strict allowlist validation (`'dark' | 'light'`) and `try/catch` wrapping around `localStorage` access in `src/pages/index.astro` and `src/scripts/theme.ts`.
  - Removal of global `window.__switch3d` controller exposure and addition of runtime allowlist checks (`Object.prototype.hasOwnProperty`) for switch colors (`src/scripts/switch-3d.ts`, `src/scripts/boot.ts`) and keyboard navigation shortcuts (`src/scripts/interactive.ts`).
  - Input validation and hex-color regex sanitization on canvas dataset attributes (`src/scripts/tech-sphere.ts`).
  - Sanitized warning messages without leaking raw error objects or stack traces to the browser console.
- **Dependency Security (`package.json`, `package-lock.json`)**:
  - Pinned transitive `overrides` for `esbuild` (`^0.28.2`) and `sharp` (`^0.35.5`) to remediate Windows dev-server arbitrary file read (`GHSA-g7r4-m6w7-qqqr`) and native image-processing vulnerabilities (`libvips`, `libheif`, `librsvg`).
- **CI/CD & Dependency Automation (`.github/`)**:
  - `.github/workflows/security.yml`: Automated check with least-privilege permissions (`contents: read`) and `persist-credentials: false` to scan for tracked secret files/tokens, run `npm ci`, audit dependencies, and verify the static build.
  - `.github/dependabot.yml`: Weekly automated checks for `npm` and `github-actions` updates.

---

## Manual GitHub Repository Settings Checklist

Because repository-level administrative settings cannot be enforced solely from files inside the Git repository, the repository owner should enable the following in **GitHub Repository Settings**:

1. **Secret Scanning & Push Protection** (`Settings` → `Code security`):
   - Enable **Secret scanning** and **Push protection** to block commits containing recognized secret formats before they reach the remote repository.
2. **Dependabot Alerts & Security Updates** (`Settings` → `Code security`):
   - Enable **Dependabot alerts** and **Dependabot security updates**.
3. **Branch Protection / Rulesets for `main`** (`Settings` → `Rules` → `Rulesets` or `Branches`):
   - Require a Pull Request before merging to `main`.
   - Require status checks to pass (`Secret Scan, Dependency Audit & Static Build`) before merging.
   - Block force pushes and branch deletion on `main`.
4. **GitHub Actions Permissions** (`Settings` → `Actions` → `General`):
   - Set **Workflow permissions** to **Read repository contents and packages permissions**.
