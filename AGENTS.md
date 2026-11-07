# Agent Guidelines: Code Quality, Codebase Structure & Security

This document establishes the mandatory engineering and security rules that every AI agent must strictly follow when working in this codebase.

---

## 1. Code Quality & Codebase Structure

- **Minimal, Consistent & Maintainable**: Keep code clean, simple, and readable. Prioritize intuitive naming conventions, consistent file and directory hierarchy, and adherence to existing framework patterns (Astro v5, TypeScript, Scoped CSS).
- **Zero Extraneous Content**: Never include unnecessary inline comments, docstrings, decorative banners, or emojis in source code. Code must be self-documenting. Explanatory comments are only permitted for genuinely non-obvious algorithms or external constraint workarounds.
- **No Over-Engineering**: Do not introduce unnecessary abstractions, layers, helper wrappers, or design patterns that do not provide immediate, tangible value.
- **Preserve Business Logic**: Never alter business logic, user-facing behavior, public interfaces, or component contracts unless explicitly requested.
- **Eliminate Dead Code**: When components, data files, or assets are verified to be orphaned and unused, remove them cleanly along with their associated styles and imports.

---

## 2. Sensitive Data Protection

- **Zero Hardcoded Secrets**: Never hardcode API keys, access tokens, passwords, private keys, or credentials in any source file, configuration, script, or test fixture.
- **Strict Environment Segregation**: Use environment variables for runtime configuration. Only variables intended for public client-side bundling in Astro may use the `PUBLIC_` prefix. Never prefix sensitive server-side variables with `PUBLIC_`.
- **Ignore Rules**: Ensure `.gitignore` comprehensively excludes `.env`, `.env.*`, `*.local`, `*.pem`, `*.key`, `*.p12`, `*.pfx`, `*.crt`, `*.jks`, and credential directories. Maintain `!.env.example` as a safe, committed template.
- **Template Discipline**: Maintain `.env.example` containing only variable keys and non-sensitive placeholder values.
- **No Leakage**: Never expose credentials or sensitive values in console logs, client bundles, error responses, or agent output messages.

---

## 3. Git & GitHub Security

- **Tracked File Discipline**: Never stage or commit environment files, private keys, local databases, build artifacts (`dist/`, `.astro/`), IDE caches, or AI agent runtime directories (`.agent/`, `.gemini/`, `.codex/`, `.impeccable/`, `.opencode/`, `.vercel/`).
- **Git History Integrity**: Never rewrite, rebase, or force-push Git history without explicit, confirmed user authorization.
- **Least-Privilege Actions**: GitHub Actions workflows must specify explicit, least-privilege permissions (e.g., `permissions: contents: read`) and `persist-credentials: false`.
- **Platform Hardening**: Recommend and support GitHub platform security features including Secret Scanning, Push Protection, Dependabot Alerts, and Branch Protection rulesets on `main`.

---

## 4. Dependency Security

- **Deterministic Installs**: Always maintain lockfile consistency (`package-lock.json`). Use `npm ci` in CI environments.
- **Minimal Dependency Footprint**: Do not add new packages, tools, or libraries if existing dependencies or native browser/language capabilities suffice.
- **Vulnerability Remediation**: Resolve supply-chain vulnerabilities through targeted, non-breaking overrides (e.g., `overrides` in `package.json`) rather than reckless major version jumps that break backward compatibility.

---

## 5. Source Code Security

- **Injection Prevention**: Avoid dynamic code evaluation (`eval`, `Function()`, `document.write`). When mutating the DOM, use safe APIs (`textContent`, `setAttribute`, typed properties) rather than inserting unvalidated strings into `innerHTML`.
- **Safe External Navigation**: Always supply `rel="noopener noreferrer"` for external anchor links and pass `'noopener,noreferrer'` to programmatic window openings (`window.open`).
- **HTTP Security Headers**: Enforce strict security headers via `vercel.json`, including a restrictive `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `Permissions-Policy`.
- **Information Exposure**: Never expose internal filesystem paths, stack traces, or debug environment dumps in client-facing output.

---

## 6. Security Automation & CI/CD

- Maintain automated security checks in `.github/workflows/security.yml`:
  - Scan tracked files for prohibited `.env*` or private key formats.
  - Scan tracked source files for recognizable secret token signatures.
  - Enforce deterministic dependency installation (`npm ci`).
  - Run non-blocking vulnerability audit (`npm audit`).
  - Verify static production build output (`npm run build`).

---

## 7. Verification & Validation Protocol

Before completing any coding task:

1. Verify codebase formatting and clean structure.
2. Confirm `.gitignore` accurately blocks sensitive local files.
3. Validate that no secrets or tokens exist in source files or git diff.
4. Execute `npm run build` and ensure zero errors or warnings occur.
5. Review `git diff` to confirm only strictly necessary, task-scoped changes are made.
