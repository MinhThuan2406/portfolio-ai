# Security Policy & Hardening Documentation

## Reporting a Vulnerability

If you discover a security issue in this repository, please report it privately via email to **<thuannm0426@gmail.com>** rather than opening a public GitHub issue. Include:

- A description of the vulnerability and its potential impact.
- Steps to reproduce or the affected file/line locations.

---

## Environment Variables & Secrets Management

1. **Local Environment Files**:
   - Use `.env.example` as a template for local development.
   - `.env`, `.env.*` (except `.env.example`), private keys (`*.pem`, `*.key`, `*.p12`, `*.pfx`), certificates (`*.crt`, `*.cer`, `*.jks`), and local tooling directories (`.vercel/`, `.gemini/`, `.agent/`, etc.) are ignored via `.gitignore` and verified by automated CI checks.
2. **Client vs. Server Variables in Astro**:
   - Variables prefixed with `PUBLIC_` in Astro are bundled into client-side browser bundles. Never prefix private API keys, database credentials, or secret tokens with `PUBLIC_`.
3. **Deployment Secrets**:
   - Deployment configuration should be managed exclusively through Vercel Project Environment Variables or GitHub Actions Encrypted Secrets.

---

## Implemented Codebase Security Measures

- **HTTP Security Headers (`vercel.json`)**:
  - `Content-Security-Policy`: Restricts scripts and styles to `'self'` and required inline blocks, fonts to `'self'` and `data:`, images to `'self'` and `data:`/`blob:`, objects to `'none'`, frame ancestors to `'none'`, and disables external third-party origins.
  - `Strict-Transport-Security`: Enforces HTTPS via `max-age=63072000; includeSubDomains; preload`.
  - `Permissions-Policy`: Explicitly disables sensitive browser features (`camera=()`, `microphone=()`, `geolocation=()`, `payment=()`, `usb=()`, `interest-cohort=()`).
  - `Cross-Origin-Opener-Policy`: Set to `same-origin`.
  - `X-Content-Type-Options`: Set to `nosniff`.
  - `X-Frame-Options`: Set to `DENY` to prevent clickjacking attacks.
  - `Referrer-Policy`: Set to `strict-origin-when-cross-origin`.
- **Static Generation & DOM Hardening (`src/`)**:
  - Pure static HTML/CSS/TS build (`output: 'static'`) with zero runtime server attack surface.
  - Safe DOM manipulations using bounded properties (`textContent`, `setAttribute`), avoiding dynamic HTML string injections.
  - Safe external link relationships (`rel="noopener noreferrer"`) and safe programmatic navigation via `window.open('/cv.pdf', '_blank', 'noopener,noreferrer')`.
- **Dependency Security (`package.json`, `package-lock.json`)**:
  - Pinned transitive overrides for `esbuild` (`^0.28.2`) and `sharp` (`^0.35.5`) to eliminate known native and dev-server vulnerabilities.
  - Minimal dependency footprint (only Astro runtime and build utilities).
- **CI/CD Security Automation (`.github/`)**:
  - `.github/workflows/security.yml`: Executes on push/PR with least-privilege permissions (`contents: read`) and `persist-credentials: false`. Scans tracked files for forbidden environment patterns and recognized secret token signatures, enforces deterministic installs (`npm ci`), runs dependency audit, and verifies static build output.
  - `.github/dependabot.yml`: Automates weekly vulnerability and update tracking for `npm` packages and `github-actions`.

---

## Manual GitHub Repository Settings Checklist

Because repository-level administrative controls cannot be enforced purely through committed files, the repository owner should configure the following in **GitHub Repository Settings**:

1. **Secret Scanning & Push Protection** (`Settings` → `Code security`):
   - Enable **Secret scanning** and **Push protection** to reject pushes containing exposed tokens or credentials.
2. **Dependabot Alerts & Security Updates** (`Settings` → `Code security`):
   - Enable **Dependabot alerts** and **Dependabot security updates**.
3. **Branch Protection / Rulesets for `main`** (`Settings` → `Rules` → `Rulesets` or `Branches`):
   - Require a Pull Request before merging to `main`.
   - Require status checks to pass (`Secret Scan, Dependency Audit & Static Build`) before merging.
   - Restrict force pushes and branch deletion on `main`.
4. **GitHub Actions Permissions** (`Settings` → `Actions` → `General`):
   - Set **Workflow permissions** to **Read repository contents and packages permissions**.
