---
name: "Nguyen Minh Thuan Engineering Portfolio"
description: "Technical Editorial and Monospace Systems design language for authentic engineering portfolios"
colors:
  primary: "#1c52b0"
  primary-hover: "#133e8a"
  primary-wash: "#edf3fc"
  accent-green: "#235841"
  accent-green-wash: "#e6f2eb"
  neutral-paper: "#f7f8fa"
  neutral-card: "#fcfdfe"
  neutral-ink: "#141619"
  neutral-muted: "#494d56"
  neutral-faint: "#5e6470"
  neutral-rule: "#d6d9df"
  neutral-rule-strong: "#9da3af"
  dark-surface: "#181a1f"
typography:
  display:
    fontFamily: "'Source Serif 4', Georgia, serif"
    fontSize: "clamp(54px, 6.2vw, 84px)"
    fontWeight: 500
    lineHeight: 1.01
    letterSpacing: "-0.034em"
  headline:
    fontFamily: "'Source Serif 4', Georgia, serif"
    fontSize: "clamp(40px, 4.2vw, 56px)"
    fontWeight: 500
    lineHeight: 1.02
    letterSpacing: "-0.032em"
  title:
    fontFamily: "'Source Serif 4', Georgia, serif"
    fontSize: "24px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "'Work Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "'DM Mono', 'Courier New', monospace"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0.06em"
rounded:
  sm: "2px"
  md: "4px"
  full: "9999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "64px"
components:
  button-link:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
  dossier-card:
    backgroundColor: "{colors.neutral-card}"
    textColor: "{colors.neutral-ink}"
    rounded: "{rounded.sm}"
    padding: "24px"
---

# Design System: Nguyen Minh Thuan Portfolio

## Overview

**Creative North Star: "The Engineering Whitepaper & Dossier"**

This visual system treats software engineering as an empirical discipline. It deliberately rejects the neon gradients, floating 3D spheres, and arbitrary proficiency percentage bars common to generic tech portfolios. Instead, it mirrors the typography, precision hairline grids, and functional diagrams found in peer-reviewed technical publications and architecture dossiers.

The interface prioritizes clarity, intellectual restraint, and verified technical outcomes. System flows and evaluation benchmarks lead the presentation, backed by high-contrast serif headlines and legible monospace technical annotations.

**Key Characteristics:**

- Off-white paper reading surface (`#f7f8fa`) paired with crisp ink (`#141619`) and technical cobalt (`#1c52b0`).
- Hairline rules (1px) establish structure and hierarchy without heavy card containers.
- Strict typography division: Book serif for editorial titles, clean sans-serif for reading text, and monospace reserved exclusively for telemetry, codes, and metrics.
- Unbroken visual rhythm: cohesive paper canvas with a grounding dark terminal footer (`#181a1f`).

## Colors

The palette is derived from technical drafting paper, printer's ink, and mathematical blueprint accents.

### Primary

- **Technical Cobalt Blue** (`#1c52b0`): Primary accent for action links, active state indicators, and directional vectors in architecture diagrams. Contrast ratio > 5.5:1 on paper background.
- **Cobalt Wash** (`#edf3fc`): High-transparency tint for active pipeline processing nodes and table highlights.

### Secondary

- **Verification Green** (`#235841`): Specialized semantic color reserved exclusively for successful checkmarks and verified benchmark assertions.

### Neutral

- **Drafting Paper** (`#f7f8fa`): Base canvas hue. Warmer and less fatiguing to the eye than pure `#ffffff`.
- **Card Paper** (`#fcfdfe`): Subtle elevated neutral for technical diagram frames and code inspection blocks.
- **Deep Printer's Ink** (`#141619`): High-contrast typographic ink for headlines and primary text.
- **Technical Slate** (`#494d56`): Secondary text for system descriptions and metadata labels (passes WCAG AA at > 4.5:1).
- **Hairline Rule** (`#d6d9df`): 1px boundary dividing systems and timeline entries.
- **Dark Grounding Surface** (`#181a1f`): Deep graphite neutral used only for the global status banner and grounding footer.

### Named Rules

**The Monospace-for-Measurement Rule.** Monospace type is reserved exclusively for code, measurements, status badges, and system identifiers. It is never used as ornamental body text.
**The No-Halo Rule.** No glowing text or zero-blur neon halos. Visual prominence is achieved strictly through scale contrast, weight, and deliberate negative space.

## Typography

**Display & Headline Font:** Source Serif 4 (500 weight, optical sizes enabled).  
**Body Font:** Work Sans (400 / 600 weights).  
**Technical/Label Font:** DM Mono (400 / 500 weights).

**Character:** The pairing of an academic editorial serif with a legible neo-grotesque sans and tabular monospace creates an authoritative, research-grade voice.

### Hierarchy

- **Display** (500 weight, `clamp(54px, 6.2vw, 84px)`, line-height 1.01, tracking -0.034em): Main hero thesis statement.
- **Headline** (500 weight, `clamp(40px, 4.2vw, 56px)`, line-height 1.02, tracking -0.032em): Case study titles and section headers.
- **Title** (500 weight, 24px - 26px, line-height 1.2, tracking -0.02em): Component subheadings and secondary project titles.
- **Body** (400 weight, 14px - 15.5px, line-height 1.6, max measure 65ch): Case study narrative, problem definitions, and retrospective analysis.
- **Label / Monospace** (500 weight, 10.5px - 11px, line-height 1.5, uppercase, letter-spacing 0.06em): Metadata tags, latency figures, and timeline indices.

### Named Rules

**The Eyebrow Ban.** Never place decorative kicker labels or floating micro-tags directly above primary titles. Let titles carry their own semantic weight.

## Layout

- **Spatial Model:** A single contained column (`max-width: 1200px`) centered with generous inline padding (`min(1200px, calc(100% - 96px))`).
- **Rhythm:** Generous vertical sections separated by 80px to 94px of negative space.
- **Grid Architecture:** Multi-column asymmetric grids (e.g., 0.92fr copy / 1.08fr diagram in Dossier; 4-column equal split in Competencies).
- **Mobile Adaptation:** Collapses cleanly from multi-column grids to linear 1-column reading cards below 640px without losing diagram fidelity.

## Elevation & Depth

**The Tonal Layering Rule.** The system is flat by default and uses hairline borders (`1px solid var(--rule)`) and tonal background shifts rather than drop shadows to convey structural layering.

## Shapes

- **Corner Strategy:** Precise and sharp. Default border-radius is `2px` or `4px` for cards and badges; buttons retain clean geometric corners.
- **Borders:** Continuous 1px hairline rules define structural divisions.
- **Micro-accents:** Circular status dots (`6px` to `7px` diameter) indicate live operational and verification states.

## Components

### Action Links

- **Primary:** Inline text link with a 1.6px stroke directional vector arrow (`12x12 SVG`). Smooth translation on hover (`translate(2px, -2px)` for external, `translateY(2px)` for down-anchors).
- **Secondary:** Slate-toned variant for secondary communication channels.

### System Diagram Map

- **Frame:** 1px hairline container with a slightly elevated `#fcfdfe` canvas.
- **Flow:** Monospace caption header, source node glyph, directional vector line with 45-degree arrow head, process box with highlighted blue border, and circular green checkmark badge.

### Expandable System Notes

- **Control:** Native HTML `<details>` and `<summary>` elements with animated plus/minus icons (`transform: rotate(90deg)` transition).
- **Content:** Strict 3-part retrospective structure: Problem, Architecture, Trade-offs & Limits.

## Do's and Don'ts

### Do

- **Do** state exact quantitative metrics and verified conditions (e.g., "76% → 100% on evaluation benchmark", "Latency <5ms").
- **Do** represent system architecture with clean geometric vectors and explicit data flows.
- **Do** keep all system areas on a unified paper background, anchoring the composition with the dark footer.

### Don't

- **Don't** use arbitrary percentage skill bars (e.g., "Python 90%"). Group skills by architectural system layer instead.
- **Don't** use neon purple/cyan glowing gradients or decorative AI badge tropes.
- **Don't** introduce floating cards or heavy drop shadows outside the hairline technical design system.
