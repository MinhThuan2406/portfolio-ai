/**
 * NGUYEN MINH THUAN · PAGE-WIDE ARCHITECTURAL BLUEPRINT ANIMATION ENGINE
 * Inspired by Nualt (https://nualt.fr/en) interactive blueprint choreography:
 *  0. Nualt HomeLoaderCover (3 Tetris Piece Slots + Rotating Drop + Curtain Lowering)
 *  1. Native Momentum Smooth Scroll (Clean zero-dependency Inertia Scroll)
 *  2. Global Scroll-Velocity Accelerator (1x -> 3.5x stream & tetris boost)
 *  3. Slot-Machine Word-Mask Heading Reveals & Section Header Line Traces
 *  4. Radial 8px Pixel-Matrix Button Wave & Diagonal Arrow Nudge
 *  5. Live Hero Falling Tetris / Telemetry Block Matrix (O, T, L, I, J, S, Z)
 *  6. Live 2D Canvas Cubic-Bezier Hex Streams & 4x4 Data Packet Buses
 *  7. Isometric 2.5D Layer Assembly & Phase-Shifted Levitation
 *  8. Case-Study Blueprint Wipe & Falling Isometric Stat Cubes
 *  9. Workstation OS Window Shadow Separation & Live Canvas Dependency Tree
 * 10. Blueprint Frame Traces, Counter Roll-Ups & Smooth Accordions
 * 11. Live Self-Correcting Typewriter Code Window, Bento Wave & Footer Watermark Rise
 */

interface SmoothScrollState {
  targetY: number;
  currentY: number;
  isLocked: boolean;
  isMoving: boolean;
}

const smoothScroll: SmoothScrollState = {
  targetY: typeof window !== 'undefined' ? window.scrollY : 0,
  currentY: typeof window !== 'undefined' ? window.scrollY : 0,
  isLocked: false,
  isMoving: false,
};

function initSmoothScroll(): void {
  if (isLiteMotion()) return;

  smoothScroll.targetY = window.scrollY;
  smoothScroll.currentY = window.scrollY;

  function updateScroll(): void {
    if (smoothScroll.isLocked) {
      smoothScroll.isMoving = false;
      return;
    }

    const diff = smoothScroll.targetY - smoothScroll.currentY;
    if (Math.abs(diff) > 0.4) {
      smoothScroll.currentY += diff * 0.088;
      window.scrollTo(0, Math.round(smoothScroll.currentY));
      smoothScroll.isMoving = true;
      requestAnimationFrame(updateScroll);
    } else {
      smoothScroll.currentY = smoothScroll.targetY;
      window.scrollTo(0, smoothScroll.targetY);
      smoothScroll.isMoving = false;
    }
  }

  function smoothScrollTo(destY: number): void {
    const maxScroll = Math.max(0, document.body.scrollHeight - window.innerHeight);
    smoothScroll.targetY = Math.max(0, Math.min(maxScroll, destY));
    if (!smoothScroll.isMoving) {
      smoothScroll.isMoving = true;
      requestAnimationFrame(updateScroll);
    }
  }

  // Expose on window for keyboard navigation & external triggers
  (window as unknown as { __smoothScrollTo?: (y: number) => void }).__smoothScrollTo = smoothScrollTo;

  // Intercept all in-page anchor clicks for smooth momentum navigation
  document.addEventListener('click', (e: MouseEvent) => {
    const link = (e.target as HTMLElement)?.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href === '#' || href === '#!') return;

    let targetEl: HTMLElement | null = null;
    if (href === '#top') {
      targetEl = document.body;
    } else {
      targetEl = document.querySelector<HTMLElement>(href);
    }
    if (!targetEl) return;

    e.preventDefault();

    if (isLiteMotion()) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const navHeight =
      parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')) || 49;
    const destY =
      href === '#top' ? 0 : Math.max(0, targetEl.getBoundingClientRect().top + window.scrollY - navHeight);

    smoothScrollTo(destY);

    if (history.pushState) {
      history.pushState(null, '', href);
    }
  });

  window.addEventListener(
    'wheel',
    (e: WheelEvent) => {
      if (smoothScroll.isLocked) return;
      let target = e.target as HTMLElement | null;
      while (target && target !== document.body) {
        if (
          target.scrollHeight > target.clientHeight &&
          (getComputedStyle(target).overflowY === 'auto' ||
            getComputedStyle(target).overflowY === 'scroll')
        ) {
          return;
        }
        target = target.parentElement;
      }

      e.preventDefault();
      const maxScroll = Math.max(0, document.body.scrollHeight - window.innerHeight);
      const delta = e.deltaY;
      smoothScroll.targetY = Math.max(0, Math.min(maxScroll, smoothScroll.targetY + delta * 1.05));

      if (!smoothScroll.isMoving) {
        smoothScroll.isMoving = true;
        requestAnimationFrame(updateScroll);
      }
    },
    { passive: false }
  );

  window.addEventListener(
    'scroll',
    () => {
      if (!smoothScroll.isMoving) {
        smoothScroll.targetY = window.scrollY;
        smoothScroll.currentY = window.scrollY;
      }
    },
    { passive: true }
  );
}

function lockScroll(locked: boolean): void {
  smoothScroll.isLocked = locked;
  if (locked) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
    smoothScroll.targetY = window.scrollY;
    smoothScroll.currentY = window.scrollY;
  }
}

/* ==========================================================================
   0. NUALT HOMELOADERCOVER (Pixel Tetris Pieces Drop + Curtain Lowering)
   Exact decompiled choreography from Nualt (https://nualt.fr/en):
   - Pieces are visible from start, hovering at translate: 0 -64px
   - Slot 0 starts at 180deg (T-piece)
   - Slot 1 starts at 90deg (Z-piece)
   - Slot 2 starts at 270deg (L-piece)
   - Discrete 80ms 90deg step-rotation: mimics arcade Tetris button press
   - Hard drop into slot: translate: "0 -64px" -> "0 0" in 200ms with cubic-bezier(.55, 0, 1, .45)
   - Curtain drop: 800ms with cubic-bezier(.76, 0, .24, 1), delay 350ms
   ========================================================================== */
function initLoaderCover(): void {
  const cover = document.getElementById('home-loader-cover');
  const logo = document.getElementById('loader-logo');
  const slotsContainer = document.getElementById('loader-slots');
  if (!cover) return;

  if (isLiteMotion()) {
    document.documentElement.removeAttribute('data-loader');
    cover.style.display = 'none';
    return;
  }

  // Freeze smooth scroll while loader is active
  lockScroll(true);

  const pieces = Array.from(document.querySelectorAll<HTMLElement>('[data-piece]'));
  if (pieces.length < 3) return;

  // Nualt initial piece rotation configs
  const pieceConfigs = [
    { turn: 180 }, // Slot 0
    { turn: 90 },  // Slot 1
    { turn: 270 }, // Slot 2
  ];

  // Set initial visible state
  pieces.forEach((p, idx) => {
    p.style.translate = '0 -64px';
    p.style.rotate = `${pieceConfigs[idx].turn}deg`;
    p.style.opacity = '1';
  });

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  const easeDrop = 'cubic-bezier(.55, 0, 1, .45)';

  // Exact Nualt M(e) piece animation function:
  async function animatePiece(idx: number): Promise<void> {
    const el = pieces[idx];
    if (!el) return;

    // Discrete 80ms steps of 90deg rotation to 360deg (authentic arcade Tetris rotation)
    for (let r = pieceConfigs[idx].turn; r < 360; r += 90) {
      await sleep(80);
      el.style.rotate = `${r + 90}deg`;
    }

    // Brief pause before hard-drop
    await sleep(80);

    // Hard drop straight into slot (200ms with cubic-bezier(.55, 0, 1, .45))
    const drop = el.animate(
      [
        { translate: '0 -64px' },
        { translate: '0 0' },
      ],
      { duration: 200, easing: easeDrop, fill: 'forwards' }
    );
    await drop.finished;
    el.style.translate = '0 0';
  }

  // Execute sequence: Piece 0 -> Piece 1 -> Piece 2 with clean realistic cadence
  (async () => {
    // Small initial breath (160ms) while page loads
    await sleep(160);

    // Piece 0 (T-piece: 180 -> 270 -> 360, then drop)
    await animatePiece(0);
    await sleep(120);

    // Piece 1 (Z-piece: 90 -> 180 -> 270 -> 360, then drop)
    await animatePiece(1);
    await sleep(120);

    // Piece 2 (L-piece: 270 -> 360, then drop)
    await animatePiece(2);

    // 120ms pause after all 3 docked (exact Nualt timing)
    await sleep(120);

    // Exit logo and slots downward
    if (logo) {
      logo.animate(
        [{ transform: 'translateY(0)' }, { transform: 'translateY(110%)' }],
        { duration: 350, easing: easeDrop, fill: 'forwards' }
      );
    }
    if (slotsContainer) {
      slotsContainer.animate(
        [{ transform: 'translateY(0)' }, { transform: 'translateY(60vh)' }],
        { duration: 450, easing: easeDrop, fill: 'forwards' }
      );
    }

    // Curtain drop: translateY(0) -> translateY(100vh)
    const curtain = cover.animate(
      [
        { transform: 'translateY(0)' },
        { transform: 'translateY(100vh)' },
      ],
      { duration: 800, delay: 350, easing: 'cubic-bezier(.76, 0, .24, 1)', fill: 'forwards' }
    );

    // At 630ms: trigger hero reveal and unlock scroll
    setTimeout(() => {
      document.documentElement.setAttribute('data-loader', 'open');
      document.documentElement.removeAttribute('data-loader');
      lockScroll(false);
      triggerHeroReveal();
    }, 630);

    await curtain.finished;
    cover.classList.add('is-dismissed');
    cover.style.display = 'none';
  })();
}

function triggerHeroReveal(): void {
  const heroTitle = document.querySelector<HTMLElement>('.hero-section [data-rolling-title]');
  const heroAppears = document.querySelectorAll<HTMLElement>('[data-hero-appear]');
  const heroBoundary = document.querySelector<HTMLElement>('[data-hero-boundary]');

  heroTitle?.classList.add('is-revealed');
  heroBoundary?.classList.add('is-revealed');
  heroAppears.forEach((el, idx) => {
    el.style.transitionDelay = `${120 + idx * 90}ms`;
    el.classList.add('is-revealed');
  });

  // Nualt Hairline Boundary Clip-Path wipe
  document.querySelectorAll<HTMLElement>('[data-hero-boundary="vertical"]').forEach((el) => {
    el.animate(
      [{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0 0 0 0)' }],
      { duration: 550, easing: 'cubic-bezier(.65, 0, .35, 1)', fill: 'forwards' }
    );
  });
  document.querySelectorAll<HTMLElement>('[data-hero-boundary="horizontal"]').forEach((el) => {
    el.animate(
      [{ clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0)' }],
      { duration: 450, delay: 250, easing: 'cubic-bezier(.65, 0, .35, 1)', fill: 'forwards' }
    );
  });
}

function isLiteMotion(): boolean {
  if (typeof window === 'undefined') return true;
  // Always return false in development/preview unless specifically requested by user query
  if (window.location.search.includes('motion=lite')) return true;
  if (document.documentElement.getAttribute('data-motion') === 'lite') return true;
  return false;
}

/* ==========================================================================
   1. GLOBAL SCROLL VELOCITY TRACKER (Accelerates Canvas Streams & Tetris)
   ========================================================================== */
let scrollVelocity = 0;
let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
let lastScrollTime = typeof performance !== 'undefined' ? performance.now() : 0;

function initScrollVelocityTracker(): void {
  lastScrollY = window.scrollY;
  lastScrollTime = performance.now();

  window.addEventListener(
    'scroll',
    () => {
      const now = performance.now();
      const dt = now - lastScrollTime;
      if (dt > 8) {
        const dy = Math.abs(window.scrollY - lastScrollY);
        const instantVel = (dy / dt) * 1000;
        scrollVelocity = scrollVelocity * 0.6 + instantVel * 0.4;
        lastScrollY = window.scrollY;
        lastScrollTime = now;
      }
    },
    { passive: true }
  );
}

function getScrollBoost(): number {
  const age = performance.now() - lastScrollTime;
  const decay = age > 120 ? Math.max(0, 1 - (age - 120) / 350) : 1;
  const effectiveVel = scrollVelocity * decay;
  return Math.min(3.5, 1 + effectiveVel / 850);
}

/* ==========================================================================
   2. SLOT-MACHINE WORD-MASK HEADING REVEALS & SECTION ENTRANCES
   ========================================================================== */
function splitHeadingIntoWordMasks(heading: HTMLElement): HTMLElement[] {
  if (heading.dataset.wordsSplit === 'true') {
    return Array.from(heading.querySelectorAll<HTMLElement>('.word-inner'));
  }
  heading.dataset.wordsSplit = 'true';

  const wordSpans: HTMLElement[] = [];

  function processNode(node: Node, targetParent: HTMLElement): void {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      const tokens = text.split(/(\s+)/);
      for (const token of tokens) {
        if (!token) continue;
        if (/^\s+$/.test(token)) {
          targetParent.appendChild(document.createTextNode(token));
        } else {
          const mask = document.createElement('span');
          mask.className = 'word-mask';
          const inner = document.createElement('span');
          inner.className = 'word-inner';
          inner.textContent = token;
          mask.appendChild(inner);
          targetParent.appendChild(mask);
          wordSpans.push(inner);
        }
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const clone = el.cloneNode(false) as HTMLElement;
      targetParent.appendChild(clone);
      Array.from(el.childNodes).forEach((child) => processNode(child, clone));
    }
  }

  const originalChildren = Array.from(heading.childNodes);
  heading.innerHTML = '';
  originalChildren.forEach((child) => processNode(child, heading));

  wordSpans.forEach((word, idx) => {
    word.style.transitionDelay = `${idx * 24}ms`;
  });

  return wordSpans;
}

function initSectionAndHeadingEntrances(): void {
  const headings = document.querySelectorAll<HTMLElement>('[data-rolling-title]');
  if (isLiteMotion()) {
    headings.forEach((h) => h.classList.add('is-revealed'));
    document
      .querySelectorAll<HTMLElement>(
        '[data-section-header], [data-hero-appear], [data-contact-appear]'
      )
      .forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  headings.forEach((h) => splitHeadingIntoWordMasks(h));

  // Hero immediate entrance on load
  const heroTitle = document.querySelector<HTMLElement>('.hero-section [data-rolling-title]');
  const heroAppears = document.querySelectorAll<HTMLElement>('[data-hero-appear]');
  const heroBoundary = document.querySelector<HTMLElement>('[data-hero-boundary]');

  requestAnimationFrame(() => {
    heroTitle?.classList.add('is-revealed');
    heroBoundary?.classList.add('is-revealed');
    heroAppears.forEach((el, idx) => {
      el.style.transitionDelay = `${160 + idx * 110}ms`;
      el.classList.add('is-revealed');
    });
  });

  // Scroll-triggered section headers
  const sectionHeaders = document.querySelectorAll<HTMLElement>('[data-section-header]');
  const headerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting && entry.boundingClientRect.top > 0) return;
        const container = entry.target as HTMLElement;
        container.classList.add('is-revealed');
        const title = container.querySelector<HTMLElement>('[data-rolling-title]');
        title?.classList.add('is-revealed');
        headerObserver.unobserve(container);
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px -5% 0px' }
  );

  sectionHeaders.forEach((sec) => headerObserver.observe(sec));

  // Fallback scroll listener so fast jumps / anchor navigation never skip a section header
  function checkSkippedHeaders(): void {
    const triggerY = window.innerHeight * 0.92;
    sectionHeaders.forEach((container) => {
      if (container.classList.contains('is-revealed')) return;
      if (container.getBoundingClientRect().top <= triggerY) {
        container.classList.add('is-revealed');
        container.querySelector<HTMLElement>('[data-rolling-title]')?.classList.add('is-revealed');
        headerObserver.unobserve(container);
      }
    });
  }
  window.addEventListener('scroll', checkSkippedHeaders, { passive: true });
  checkSkippedHeaders();

  // Contact copy & title entrance
  const contactStage = document.querySelector<HTMLElement>('.contact-copy-col');
  if (contactStage) {
    const contactObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const title = contactStage.querySelector<HTMLElement>('[data-rolling-title]');
          title?.classList.add('is-revealed');
          contactStage.querySelectorAll<HTMLElement>('[data-contact-appear]').forEach((el, i) => {
            el.style.transitionDelay = `${150 + i * 110}ms`;
            el.classList.add('is-revealed');
          });
          contactObserver.unobserve(contactStage);
        });
      },
      { threshold: 0.2 }
    );
    contactObserver.observe(contactStage);
  }
}

/* ==========================================================================
   3. RADIAL 8PX PIXEL-MATRIX BUTTON WAVE (Nualt Button Transition Matrix)
   ========================================================================== */
function initPixelButtons(): void {
  if (isLiteMotion()) return;

  const buttons = document.querySelectorAll<HTMLElement>(
    '[data-pixel-btn], .nav-link, .header-cv, .header-cta, .header-github'
  );

  buttons.forEach((btn) => {
    if (btn.dataset.pixelBound) return;
    btn.dataset.pixelBound = 'true';

    let fill = btn.querySelector<HTMLElement>('.button-pixel-fill');
    if (!fill) {
      fill = document.createElement('span');
      fill.className = 'button-pixel-fill';
      fill.setAttribute('aria-hidden', 'true');
      btn.insertBefore(fill, btn.firstChild);
    }

    let isHovered = false;

    function buildRipple(clientX?: number, clientY?: number): void {
      const rect = btn.getBoundingClientRect();
      const w = btn.clientWidth;
      const h = btn.clientHeight;
      if (w === 0 || h === 0) return;

      const cursorX = clientX === undefined ? w / 2 : clientX - rect.left - btn.clientLeft;
      const cursorY = clientY === undefined ? h / 2 : clientY - rect.top - btn.clientTop;

      const cols = Math.ceil(w / 8);
      const rows = Math.ceil(h / 8);
      const centerCol = Math.max(0, Math.min(cols - 1, Math.floor(cursorX / 8)));
      const centerRow = Math.max(0, Math.min(rows - 1, Math.floor(cursorY / 8)));

      const maxHypot =
        Math.hypot(
          Math.max(centerCol, cols - 1 - centerCol),
          Math.max(centerRow, rows - 1 - centerRow)
        ) || 1;

      fill!.innerHTML = '';
      const fragment = document.createDocumentFragment();

      for (let i = 0; i < cols * rows; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const dist = Math.hypot(col - centerCol, row - centerRow);
        const delay = Math.round((dist / maxHypot) * 360);

        const span = document.createElement('span');
        span.style.left = `${col * 8}px`;
        span.style.top = `${row * 8}px`;
        span.style.setProperty('--delay', `${delay}ms`);
        fragment.appendChild(span);
      }

      fill!.appendChild(fragment);
    }

    let leaveTimer: number | null = null;

    btn.addEventListener('pointerenter', (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      if (leaveTimer) {
        clearTimeout(leaveTimer);
        leaveTimer = null;
      }
      fill!.classList.remove('is-leaving');
      btn.classList.add('has-pixel-hover');
      buildRipple(e.clientX, e.clientY);
    });

    btn.addEventListener('pointerleave', () => {
      btn.classList.remove('has-pixel-hover');
      fill!.classList.add('is-leaving');
      leaveTimer = window.setTimeout(() => {
        fill!.innerHTML = '';
        fill!.classList.remove('is-leaving');
      }, 300);
    });

    btn.addEventListener('focus', () => {
      if (btn.matches(':focus-visible')) {
        buildRipple();
      }
    });
  });
}

/* ==========================================================================
   4. HERO LIVE FALLING TETRIS / TELEMETRY BLOCK MATRIX
   ========================================================================== */
interface TetrominoDef {
  cells: [number, number][];
  fillOpacity: number;
  dashed?: boolean;
}

const TETROMINOES: TetrominoDef[] = [
  // O piece
  {
    cells: [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ],
    fillOpacity: 0.85,
  },
  // T piece
  {
    cells: [
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
    ],
    fillOpacity: 0.42,
  },
  // L piece
  {
    cells: [
      [0, 0],
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    fillOpacity: 0.85,
  },
  // I piece (3-block compact bar for 8-col board)
  {
    cells: [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
    fillOpacity: 0.55,
  },
  // S piece
  {
    cells: [
      [1, 0],
      [2, 0],
      [0, 1],
      [1, 1],
    ],
    fillOpacity: 0.65,
  },
  // Z piece
  {
    cells: [
      [0, 0],
      [1, 0],
      [1, 1],
      [2, 1],
    ],
    fillOpacity: 0.85,
  },
];

function initHeroTetris(): void {
  const boardGroup = document.getElementById('hero-tetris-board');
  if (!boardGroup || isLiteMotion()) return;

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const COLS = 8;
  const ROWS = 5;
  const CELL_SIZE = 14;
  const STEP = 16; // 14px + 2px gap

  // Remove static fallback
  const fallback = boardGroup.querySelector('[data-tetris-fallback]');
  if (fallback) fallback.remove();

  interface GridCell {
    rect: SVGRectElement;
    fillOpacity: number;
  }

  const grid: (GridCell | null)[][] = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => null)
  );

  function createBlockRect(col: number, row: number, def: TetrominoDef): SVGRectElement {
    const rect = document.createElementNS(SVG_NS, 'rect');
    rect.setAttribute('x', String(col * STEP));
    rect.setAttribute('y', String(row * STEP));
    rect.setAttribute('width', String(CELL_SIZE));
    rect.setAttribute('height', String(CELL_SIZE));
    rect.setAttribute('fill', 'currentColor');
    rect.setAttribute('fill-opacity', String(def.fillOpacity));
    rect.setAttribute('stroke', 'currentColor');
    rect.setAttribute('stroke-width', '1.1');
    if (def.dashed) {
      rect.setAttribute('stroke-dasharray', '2 2');
    }
    boardGroup!.appendChild(rect);
    return rect;
  }

  // Seed initial bottom rows so the matrix looks populated immediately
  const initialSeeds: [number, number, number][] = [
    [0, 4, 0],
    [1, 4, 0],
    [2, 4, 1],
    [4, 4, 2],
    [5, 4, 2],
    [6, 4, 4],
    [0, 3, 3],
    [1, 3, 5],
    [5, 3, 0],
  ];
  for (const [c, r, tIdx] of initialSeeds) {
    const def = TETROMINOES[tIdx % TETROMINOES.length];
    grid[r][c] = {
      rect: createBlockRect(c, r, def),
      fillOpacity: def.fillOpacity,
    };
  }

  let activePiece: {
    def: TetrominoDef;
    col: number;
    row: number;
    rects: SVGRectElement[];
  } | null = null;

  let pieceCounter = 0;
  let isClearing = false;
  let isVisible = true;
  let lastTick = performance.now();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        isVisible = e.isIntersecting;
      });
    },
    { threshold: 0.05 }
  );
  observer.observe(boardGroup);

  function canMoveTo(cells: [number, number][], baseCol: number, baseRow: number): boolean {
    for (const [dx, dy] of cells) {
      const c = baseCol + dx;
      const r = baseRow + dy;
      if (c < 0 || c >= COLS || r >= ROWS) return false;
      if (r >= 0 && grid[r][c] !== null) return false;
    }
    return true;
  }

  function spawnPiece(): void {
    const def = TETROMINOES[pieceCounter % TETROMINOES.length];
    pieceCounter++;
    const maxDx = Math.max(...def.cells.map((c) => c[0]));

    // Pick a column with lowest stack height to keep gameplay balanced
    let bestCol = (pieceCounter * 3) % (COLS - maxDx);
    let bestFreeDepth = -1;
    for (let candidate = 0; candidate <= COLS - 1 - maxDx; candidate++) {
      let depth = 0;
      while (depth < ROWS && canMoveTo(def.cells, candidate, depth)) {
        depth++;
      }
      if (depth > bestFreeDepth) {
        bestFreeDepth = depth;
        bestCol = candidate;
      }
    }

    if (!canMoveTo(def.cells, bestCol, 0)) {
      // Board reached top: flash-clear bottom two rows to keep continuous telemetry flow
      clearRows([ROWS - 1, ROWS - 2]);
      return;
    }

    const rects = def.cells.map(([dx, dy]) => createBlockRect(bestCol + dx, dy, def));
    activePiece = { def, col: bestCol, row: 0, rects };
  }

  function clearRows(rowsToClear: number[]): void {
    isClearing = true;
    const uniqueRows = Array.from(new Set(rowsToClear)).sort((a, b) => a - b);
    const dyingRects: SVGRectElement[] = [];

    for (const r of uniqueRows) {
      for (let c = 0; c < COLS; c++) {
        const cell = grid[r][c];
        if (cell) {
          dyingRects.push(cell.rect);
          grid[r][c] = null;
        }
      }
    }

    dyingRects.forEach((rect) => {
      rect.animate(
        [
          { opacity: 1 },
          { opacity: 0.55, offset: 0.45 },
          { opacity: 0.85, offset: 0.7 },
          { opacity: 0 },
        ],
        { duration: 480, easing: 'ease-in-out', fill: 'forwards' }
      );
    });

    setTimeout(() => {
      dyingRects.forEach((r) => r.remove());

      // Shift remaining rows down
      for (const clearedRow of uniqueRows) {
        for (let r = clearedRow; r > 0; r--) {
          for (let c = 0; c < COLS; c++) {
            grid[r][c] = grid[r - 1][c];
            if (grid[r][c]) {
              grid[r][c]!.rect.setAttribute('y', String(r * STEP));
            }
          }
        }
        for (let c = 0; c < COLS; c++) {
          grid[0][c] = null;
        }
      }

      isClearing = false;
    }, 470);
  }

  function stepTetris(now: number): void {
    requestAnimationFrame(stepTetris);
    if (!isVisible || isClearing) return;

    const interval = 230 / getScrollBoost();
    if (now - lastTick < interval) return;
    lastTick = now;

    if (!activePiece) {
      spawnPiece();
      return;
    }

    const nextRow = activePiece.row + 1;
    if (canMoveTo(activePiece.def.cells, activePiece.col, nextRow)) {
      activePiece.row = nextRow;
      activePiece.def.cells.forEach(([dx, dy], idx) => {
        activePiece!.rects[idx].setAttribute('x', String((activePiece!.col + dx) * STEP));
        activePiece!.rects[idx].setAttribute('y', String((activePiece!.row + dy) * STEP));
      });
    } else {
      // Lock piece into grid
      activePiece.def.cells.forEach(([dx, dy], idx) => {
        const c = activePiece!.col + dx;
        const r = activePiece!.row + dy;
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
          grid[r][c] = {
            rect: activePiece!.rects[idx],
            fillOpacity: activePiece!.def.fillOpacity,
          };
        } else {
          activePiece!.rects[idx].remove();
        }
      });
      activePiece = null;

      // Check for full or near-full rows (7+ of 8 cells filled) to trigger Nualt line-clear flash
      const completedRows: number[] = [];
      for (let r = 0; r < ROWS; r++) {
        const filledCount = grid[r].filter((cell) => cell !== null).length;
        if (filledCount >= COLS - 1) {
          completedRows.push(r);
        }
      }

      // Also if top row (row 0 or 1) has blocks, clear bottom row to keep cycle alive
      const topOccupied =
        grid[0].some((cell) => cell !== null) || grid[1].some((cell) => cell !== null);
      if (completedRows.length > 0) {
        clearRows(completedRows);
      } else if (topOccupied) {
        clearRows([ROWS - 1]);
      }
    }
  }

  requestAnimationFrame(stepTetris);
}

/* ==========================================================================
   5. LIVE 2D CANVAS BEZIER HEX STREAMS & DATA PACKET BUSES (Nualt MethodFlow)
   ========================================================================== */
interface Point2D {
  x: number;
  y: number;
}

function evalCubicBezier(t: number, p0: Point2D, p1: Point2D, p2: Point2D, p3: Point2D): Point2D {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;
  return {
    x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
    y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y,
  };
}

function attachPipelineStreamCanvas(
  canvas: HTMLCanvasElement,
  options: {
    leftEntryRatioX: number;
    midNode1RatioX: number;
    midNode2RatioX: number;
    rightExitRatioX: number;
    centerYRatio: number;
    pulseOutputCells?: NodeListOf<SVGRectElement>;
  }
): void {
  if (isLiteMotion()) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const HEX_CHARS = '0123456789abcdef';
  const FAN_CURVES = 4;
  const CHARS_PER_CURVE = 5;

  interface HexParticle {
    curveIdx: number;
    t: number;
    speed: number;
    char: string;
  }

  interface SquarePacket {
    segment: 'bus1' | 'bus2' | 'fanOut';
    curveIdx: number;
    t: number;
    speed: number;
  }

  const hexParticles: HexParticle[] = [];
  for (let c = 0; c < FAN_CURVES; c++) {
    for (let i = 0; i < CHARS_PER_CURVE; i++) {
      hexParticles.push({
        curveIdx: c,
        t: i / CHARS_PER_CURVE + Math.random() * 0.12,
        speed: 0.16 + Math.random() * 0.06,
        char: HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)],
      });
    }
  }

  const packets: SquarePacket[] = [];
  for (let i = 0; i < 4; i++) {
    packets.push({ segment: 'bus1', curveIdx: 0, t: i / 4, speed: 0.42 });
    packets.push({ segment: 'bus2', curveIdx: 0, t: (i + 0.5) / 4, speed: 0.42 });
  }
  for (let c = 0; c < FAN_CURVES; c++) {
    for (let i = 0; i < 2; i++) {
      packets.push({
        segment: 'fanOut',
        curveIdx: c,
        t: i * 0.5 + c * 0.11,
        speed: 0.24 + Math.random() * 0.05,
      });
    }
  }

  let width = 0;
  let height = 0;
  let isVisible = true;
  let lastFrame = performance.now();

  function resize(): void {
    const parent = canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  const ro = new ResizeObserver(resize);
  if (canvas.parentElement) ro.observe(canvas.parentElement);
  resize();

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        isVisible = e.isIntersecting;
        if (isVisible) lastFrame = performance.now();
      });
    },
    { threshold: 0.05 }
  );
  io.observe(canvas);

  function render(now: number): void {
    requestAnimationFrame(render);
    if (!isVisible || width < 40 || height < 40) return;

    const dt = Math.min((now - lastFrame) / 1000, 0.08) * getScrollBoost();
    lastFrame = now;

    ctx!.clearRect(0, 0, width, height);

    const style = getComputedStyle(canvas);
    const strokeColor = style.color || '#f4f2e8';

    const cy = height * options.centerYRatio;
    const xEntry = width * options.leftEntryRatioX;
    const xBus1Start = width * options.midNode1RatioX;
    const xBus1End = width * (options.midNode1RatioX + 0.11);
    const xBus2Start = width * options.midNode2RatioX;
    const xBus2End = width * (options.midNode2RatioX + 0.11);
    const xExit = width * options.rightExitRatioX;

    // Build left fan-in and right fan-out Bezier control points
    const leftCurves: [Point2D, Point2D, Point2D, Point2D][] = [];
    const rightCurves: [Point2D, Point2D, Point2D, Point2D][] = [];

    for (let i = 0; i < FAN_CURVES; i++) {
      const ratio = (i + 0.5) / FAN_CURVES;
      const ySpread = height * (0.14 + ratio * 0.72);
      leftCurves.push([
        { x: 0, y: ySpread },
        { x: xEntry * 0.45, y: ySpread },
        { x: xEntry * 0.65, y: cy },
        { x: xEntry, y: cy },
      ]);
      rightCurves.push([
        { x: xExit, y: cy },
        { x: xExit + (width - xExit) * 0.35, y: cy },
        { x: xExit + (width - xExit) * 0.55, y: ySpread },
        { x: width, y: ySpread },
      ]);
    }

    // Draw dashed Bezier fan-in and fan-out lines
    ctx!.save();
    ctx!.strokeStyle = strokeColor;
    ctx!.globalAlpha = 0.28;
    ctx!.lineWidth = 1;
    ctx!.setLineDash([2, 3]);

    for (const [p0, p1, p2, p3] of leftCurves) {
      ctx!.beginPath();
      ctx!.moveTo(p0.x, p0.y);
      ctx!.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
      ctx!.stroke();
    }

    for (const [p0, p1, p2, p3] of rightCurves) {
      ctx!.beginPath();
      ctx!.moveTo(p0.x, p0.y);
      ctx!.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
      ctx!.stroke();
    }
    ctx!.restore();

    // Update & draw streaming hexadecimal characters along left fan-in curves
    ctx!.save();
    ctx!.fillStyle = strokeColor;
    ctx!.font = '600 10px "IBM Plex Mono", monospace';
    ctx!.textAlign = 'center';
    ctx!.textBaseline = 'middle';

    for (const hp of hexParticles) {
      hp.t += hp.speed * dt;
      if (hp.t >= 1) {
        hp.t %= 1;
        hp.char = HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
      }
      const [p0, p1, p2, p3] = leftCurves[hp.curveIdx];
      const pt = evalCubicBezier(hp.t, p0, p1, p2, p3);
      const alpha = hp.t < 0.15 ? hp.t / 0.15 : hp.t > 0.85 ? (1 - hp.t) / 0.15 : 1;
      ctx!.globalAlpha = alpha * 0.78;
      ctx!.fillText(hp.char, pt.x, pt.y);
    }
    ctx!.restore();

    // Update & draw 4x4 square data packets along inter-stage buses & right fan-out
    ctx!.save();
    ctx!.fillStyle = strokeColor;
    for (const pkt of packets) {
      pkt.t += pkt.speed * dt;
      if (pkt.t >= 1) {
        pkt.t %= 1;
        // Subtle pulse on output cells when a bus2 packet finishes
        if (pkt.segment === 'bus2' && options.pulseOutputCells && options.pulseOutputCells.length) {
          const targetCell =
            options.pulseOutputCells[Math.floor(Math.random() * options.pulseOutputCells.length)];
          targetCell?.animate([{ opacity: 1 }, { opacity: 0.35 }, { opacity: 1 }], {
            duration: 360,
            easing: 'ease-out',
          });
        }
      }

      let pt: Point2D;
      if (pkt.segment === 'bus1') {
        pt = { x: xBus1Start + (xBus1End - xBus1Start) * pkt.t, y: cy };
      } else if (pkt.segment === 'bus2') {
        pt = { x: xBus2Start + (xBus2End - xBus2Start) * pkt.t, y: cy };
      } else {
        const [p0, p1, p2, p3] = rightCurves[pkt.curveIdx];
        pt = evalCubicBezier(pkt.t, p0, p1, p2, p3);
      }

      ctx!.globalAlpha = 0.92;
      ctx!.fillRect(pt.x - 2.5, pt.y - 2.5, 5, 5);
    }
    ctx!.restore();
  }

  requestAnimationFrame(render);
}

function initPipelineCanvases(): void {
  const heroCanvas = document.querySelector<HTMLCanvasElement>('canvas[data-hero-stream]');
  const outputCells = document.querySelectorAll<SVGRectElement>('[data-output-cell]');
  if (heroCanvas) {
    attachPipelineStreamCanvas(heroCanvas, {
      leftEntryRatioX: 0.05,
      midNode1RatioX: 0.265,
      midNode2RatioX: 0.625,
      rightExitRatioX: 0.96,
      centerYRatio: 0.5,
      pulseOutputCells: outputCells,
    });
  }

  const dossierCanvas = document.querySelector<HTMLCanvasElement>('canvas[data-dossier-stream]');
  if (dossierCanvas) {
    attachPipelineStreamCanvas(dossierCanvas, {
      leftEntryRatioX: 0.06,
      midNode1RatioX: 0.305,
      midNode2RatioX: 0.665,
      rightExitRatioX: 0.95,
      centerYRatio: 0.38,
    });
  }
}

/* ==========================================================================
   6. ISOMETRIC 2.5D LAYER ASSEMBLY & CONTINUOUS LEVITATION (assembleIso)
   ========================================================================== */
function initIsometricAssemblies(): void {
  const groups = document.querySelectorAll<SVGGElement>('[data-iso-assembly]');
  if (!groups.length || isLiteMotion()) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const group = entry.target as SVGGElement;
        const layers = Array.from(group.querySelectorAll<SVGGElement>('[data-iso-layer]'));

        layers.forEach((layer, idx) => {
          const offsetY = -(18 + idx * 14);
          const anim = layer.animate(
            [
              { transform: `translateY(${offsetY}px)`, opacity: 0 },
              { transform: 'translateY(0px)', opacity: 1 },
            ],
            {
              duration: 680,
              delay: idx * 140,
              easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
              fill: 'both',
            }
          );

          anim.onfinish = () => {
            layer.animate(
              [{ transform: 'translateY(0px)' }, { transform: 'translateY(-4px)' }],
              {
                duration: 2200 + idx * 240,
                direction: 'alternate',
                iterations: Infinity,
                easing: 'ease-in-out',
              }
            );
          };
        });

        io.unobserve(group);
      });
    },
    { threshold: 0.25 }
  );

  groups.forEach((g) => io.observe(g));
}

/* ==========================================================================
   7. PRODUCTION PIPELINES CASE ROWS & FALLING ISOMETRIC STAT CUBES
   ========================================================================== */
function initCaseStudyRows(): void {
  const rows = document.querySelectorAll<HTMLElement>('[data-case-row]');
  if (!rows.length) return;

  if (isLiteMotion()) {
    rows.forEach((r) => r.classList.add('is-revealed'));
    return;
  }

  function revealRow(row: HTMLElement): void {
    if (row.classList.contains('is-revealed')) return;
    row.classList.add('is-revealed');

    // Animate the 3 Isometric Stat Cubes dropping from above (Nualt WorkEntrance)
    const cubes = Array.from(row.querySelectorAll<SVGGElement>('[data-stat-cube]'));
    cubes.forEach((cube, idx) => {
      const drop = cube.animate(
        [
          { transform: 'translateY(-56px)', opacity: 0 },
          { transform: 'translateY(0px)', opacity: 1 },
        ],
        {
          duration: 820,
          delay: 120 + idx * 170,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          fill: 'both',
        }
      );

      drop.onfinish = () => {
        cube.animate(
          [{ transform: 'translateY(0px)' }, { transform: 'translateY(-3.5px)' }],
          {
            duration: 2100 + idx * 260,
            direction: 'alternate',
            iterations: Infinity,
            easing: 'ease-in-out',
          }
        );
      };
    });

    // Stagger copy blocks on the right
    const copies = row.querySelectorAll<HTMLElement>('[data-case-copy], [data-cube-metric]');
    copies.forEach((el, idx) => {
      el.style.transitionDelay = `${160 + idx * 75}ms`;
      el.classList.add('is-revealed');
    });

    io.unobserve(row);
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting && entry.boundingClientRect.top > 0) return;
        revealRow(entry.target as HTMLElement);
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px -5% 0px' }
  );

  rows.forEach((r) => io.observe(r));
  window.addEventListener(
    'scroll',
    () => {
      const triggerY = window.innerHeight * 0.92;
      rows.forEach((r) => {
        if (!r.classList.contains('is-revealed') && r.getBoundingClientRect().top <= triggerY) {
          revealRow(r);
        }
      });
    },
    { passive: true }
  );
}

/* ==========================================================================
   8. WORKSTATION OS WINDOW SEPARATION & LIVE CANVAS DEPENDENCY TREE
   ========================================================================== */
function initOsWindowAndTree(): void {
  const wrap = document.querySelector<HTMLElement>('[data-os-window-wrap]');
  const canvas = document.querySelector<HTMLCanvasElement>('canvas[data-os-tree-canvas]');
  if (!wrap) return;

  if (isLiteMotion()) {
    wrap.classList.add('is-revealed');
    wrap.querySelectorAll<HTMLElement>('[data-tree-node], [data-tree-leaf]').forEach((el) => {
      el.classList.add('is-revealed');
    });
    return;
  }

  let treeStarted = false;
  let branchProgress = 0;

  function triggerOsTree(): void {
    if (treeStarted) return;
    treeStarted = true;
    wrap!.classList.add('is-revealed');

    // Stagger the 4 architectural layer columns and their leaf modules
    const nodes = wrap!.querySelectorAll<HTMLElement>('[data-tree-node]');
    nodes.forEach((node, nIdx) => {
      node.style.transitionDelay = `${360 + nIdx * 110}ms`;
      node.classList.add('is-revealed');
      const leaves = node.querySelectorAll<HTMLElement>('[data-tree-leaf]');
      leaves.forEach((leaf, lIdx) => {
        leaf.style.transitionDelay = `${520 + nIdx * 110 + lIdx * 45}ms`;
        leaf.classList.add('is-revealed');
      });
    });

    // Animate branchProgress 0 -> 1 over 850ms
    const start = performance.now();
    function growBranches(now: number): void {
      const elapsed = now - start;
      branchProgress = Math.min(1, elapsed / 850);
      if (branchProgress < 1) {
        requestAnimationFrame(growBranches);
      }
    }
    requestAnimationFrame(growBranches);
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting && entry.boundingClientRect.top > 0) return;
        triggerOsTree();
      });
    },
    { threshold: 0.05 }
  );

  io.observe(wrap);
  window.addEventListener(
    'scroll',
    () => {
      if (!treeStarted && wrap.getBoundingClientRect().top <= window.innerHeight * 0.92) {
        triggerOsTree();
      }
    },
    { passive: true }
  );

  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let isVisible = false;
  let lastTime = performance.now();

  const packets = [
    { col: 0, t: 0.05, speed: 0.48 },
    { col: 1, t: 0.32, speed: 0.52 },
    { col: 2, t: 0.61, speed: 0.46 },
    { col: 3, t: 0.84, speed: 0.5 },
    { col: 0, t: 0.55, speed: 0.48 },
    { col: 2, t: 0.15, speed: 0.46 },
  ];

  function resize(): void {
    const parent = canvas!.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas!.width = Math.max(1, Math.floor(width * dpr));
    canvas!.height = Math.max(1, Math.floor(height * dpr));
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  const ro = new ResizeObserver(resize);
  if (canvas.parentElement) ro.observe(canvas.parentElement);
  resize();

  const canvasIo = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        isVisible = e.isIntersecting;
        if (isVisible) lastTime = performance.now();
      });
    },
    { threshold: 0.05 }
  );
  canvasIo.observe(canvas);

  function sampleOrthogonalBranch(
    t: number,
    rootX: number,
    busY: number,
    targetX: number,
    endY: number
  ): Point2D {
    const seg1 = busY;
    const seg2 = Math.abs(targetX - rootX);
    const seg3 = Math.max(1, endY - busY);
    const total = seg1 + seg2 + seg3 || 1;
    const dist = t * total;

    if (dist <= seg1) {
      return { x: rootX, y: dist };
    }
    if (dist <= seg1 + seg2) {
      const p = (dist - seg1) / (seg2 || 1);
      return { x: rootX + (targetX - rootX) * p, y: busY };
    }
    const p = (dist - seg1 - seg2) / seg3;
    return { x: targetX, y: busY + (endY - busY) * p };
  }

  function renderTree(now: number): void {
    requestAnimationFrame(renderTree);
    if (!isVisible || width < 40 || height < 16) return;

    const dt = Math.min((now - lastTime) / 1000, 0.08) * getScrollBoost();
    lastTime = now;

    ctx!.clearRect(0, 0, width, height);
    if (branchProgress <= 0.01) return;

    const color = getComputedStyle(canvas!).color || '#f4f2e8';
    const rootX = Math.min(width * 0.22, 180);
    const busY = height * 0.48;
    const colCenters = [0.125, 0.375, 0.625, 0.875].map((r) => width * r);

    ctx!.save();
    ctx!.strokeStyle = color;
    ctx!.fillStyle = color;
    ctx!.lineWidth = 1.2;
    ctx!.setLineDash([2, 3]);
    ctx!.globalAlpha = 0.55;

    // Draw orthogonal branches from rootX -> busY -> each column center -> height
    for (const cx of colCenters) {
      ctx!.beginPath();
      ctx!.moveTo(rootX, 0);
      ctx!.lineTo(rootX, busY * Math.min(1, branchProgress * 2));
      if (branchProgress > 0.35) {
        const horizP = Math.min(1, (branchProgress - 0.35) / 0.4);
        const curX = rootX + (cx - rootX) * horizP;
        ctx!.lineTo(curX, busY);
      }
      if (branchProgress > 0.75) {
        const vertP = Math.min(1, (branchProgress - 0.75) / 0.25);
        ctx!.lineTo(cx, busY + (height - busY) * vertP);
      }
      ctx!.stroke();

      // Draw junction squares
      if (branchProgress >= 0.95) {
        ctx!.fillRect(cx - 2.5, height - 5, 5, 5);
      }
    }

    // Root origin square
    ctx!.fillRect(rootX - 3, 0, 6, 5);
    ctx!.restore();

    // Stream live 4x4 telemetry packets along the orthogonal branches
    if (branchProgress >= 0.95) {
      ctx!.save();
      ctx!.fillStyle = color;
      ctx!.globalAlpha = 0.95;
      for (const pkt of packets) {
        pkt.t = (pkt.t + pkt.speed * dt) % 1;
        const pt = sampleOrthogonalBranch(pkt.t, rootX, busY, colCenters[pkt.col], height);
        ctx!.fillRect(pt.x - 2.5, pt.y - 2.5, 5, 5);
      }
      ctx!.restore();
    }
  }

  requestAnimationFrame(renderTree);
}

/* ==========================================================================
   9. BLUEPRINT FRAME TRACES, COUNTER ROLL-UPS & SMOOTH ACCORDIONS
   ========================================================================== */
function initBlueprintFramesAndAccordions(): void {
  // Number Count-Up for Hero Pixel Stats (TOP 13, 152,714+)
  const counters = document.querySelectorAll<HTMLElement>('[data-count-target]');
  if (!isLiteMotion()) {
    counters.forEach((el) => {
      const target = Number(el.getAttribute('data-count-target') || '0');
      const prefix = el.getAttribute('data-count-prefix') || '';
      const suffix = el.getAttribute('data-count-suffix') || '';
      if (!target) return;

      const duration = 1250;
      const start = performance.now();
      function tick(now: number): void {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 4);
        const current = Math.max(1, Math.round(target * eased));
        el.textContent = `${prefix}${current.toLocaleString('en-US')}${suffix}`;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  // Hero Ledger Cells stagger
  const ledgerCells = document.querySelectorAll<HTMLElement>('[data-ledger-cell]');
  ledgerCells.forEach((cell, idx) => {
    if (isLiteMotion()) {
      cell.classList.add('is-revealed');
    } else {
      setTimeout(() => cell.classList.add('is-revealed'), 180 + idx * 110);
    }
  });

  // Dossier Frame, Trajectory Ledger & Discipline Rows
  const revealBlocks = document.querySelectorAll<HTMLElement>(
    '[data-dossier-frame], [data-ledger-frame], [data-faq-section]'
  );

  if (isLiteMotion()) {
    revealBlocks.forEach((b) => b.classList.add('is-revealed'));
    document
      .querySelectorAll<HTMLElement>(
        '[data-step-row], [data-evidence-cell], [data-dossier-copy], [data-trace-row], [data-faq-item]'
      )
      .forEach((el) => el.classList.add('is-revealed'));
  } else {
    function revealBlock(block: HTMLElement): void {
      if (block.classList.contains('is-revealed')) return;
      block.classList.add('is-revealed');

      const children = block.querySelectorAll<HTMLElement>(
        '[data-dossier-copy], [data-step-row], [data-evidence-cell], [data-trace-row], [data-faq-item]'
      );
      children.forEach((child, idx) => {
        child.style.transitionDelay = `${100 + idx * 80}ms`;
        child.classList.add('is-revealed');
      });

      blockObserver.unobserve(block);
    }

    const blockObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && entry.boundingClientRect.top > 0) return;
          revealBlock(entry.target as HTMLElement);
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -5% 0px' }
    );

    revealBlocks.forEach((b) => blockObserver.observe(b));
    window.addEventListener(
      'scroll',
      () => {
        const triggerY = window.innerHeight * 0.92;
        revealBlocks.forEach((b) => {
          if (!b.classList.contains('is-revealed') && b.getBoundingClientRect().top <= triggerY) {
            revealBlock(b);
          }
        });
      },
      { passive: true }
    );
  }

  // Smooth Web Animations API Accordion for <details class="blueprint-details">
  const detailsList = document.querySelectorAll<HTMLDetailsElement>('details.blueprint-details');
  detailsList.forEach((details) => {
    const summary = details.querySelector<HTMLElement>('summary');
    const body = details.querySelector<HTMLElement>('.details-body');
    if (!summary || !body) return;

    let currentAnim: Animation | null = null;

    summary.addEventListener('click', (e) => {
      if (isLiteMotion()) return;
      e.preventDefault();
      if (currentAnim) currentAnim.cancel();

      const startHeight = details.offsetHeight;
      if (details.open) {
        const endHeight = summary.offsetHeight;
        currentAnim = details.animate(
          [{ height: `${startHeight}px` }, { height: `${endHeight}px` }],
          { duration: 280, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
        );
        details.style.overflow = 'hidden';
        currentAnim.onfinish = () => {
          details.open = false;
          details.style.height = '';
          details.style.overflow = '';
          currentAnim = null;
        };
      } else {
        details.open = true;
        const endHeight = details.offsetHeight;
        details.style.overflow = 'hidden';
        currentAnim = details.animate(
          [{ height: `${startHeight}px` }, { height: `${endHeight}px` }],
          { duration: 320, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
        );
        currentAnim.onfinish = () => {
          details.style.height = '';
          details.style.overflow = '';
          currentAnim = null;
        };
      }
    });
  });
}

/* ==========================================================================
   10. LIVE SELF-CORRECTING TYPEWRITER CODE WINDOW, BENTO WAVE & FOOTER RISE
   ========================================================================== */
interface CodeToken {
  text: string;
  cls?: string;
}

type TypewriterOp =
  | { type: 'tokens'; list: CodeToken[] }
  | { type: 'pause'; ms: number }
  | { type: 'delete'; count: number };

function initContactAnimations(): void {
  const codeWrap = document.querySelector<HTMLElement>('[data-code-window-wrap]');
  const typingStage = document.getElementById('cta-code-typing');
  const codePre = document.getElementById('cta-code-pre');
  const replayBtn = document.getElementById('replay-typing-btn');
  const bentoGrid = document.querySelector<HTMLElement>('[data-cta-icons]');
  const footerWrap = document.querySelector<HTMLElement>('[data-footer-logo-wrap]');
  const footerLogo = document.querySelector<HTMLElement>('[data-footer-logo]');

  if (isLiteMotion()) {
    codeWrap?.classList.add('is-revealed');
    footerLogo?.classList.add('is-revealed');
    return;
  }

  // 1. Code Window Shadow Separation & Live Self-Correcting Typewriter (Nualt CtaCodeTyping)
  if (codeWrap && typingStage && codePre) {
    // Create a hidden layout-locking sizer clone so card height never jumps during typing
    const sizer = codePre.cloneNode(true) as HTMLElement;
    sizer.removeAttribute('id');
    sizer.className = 'code-pre code-pre-sizer mono';
    sizer.setAttribute('aria-hidden', 'true');
    typingStage.insertBefore(sizer, codePre);
    codePre.classList.add('code-pre-live');

    // Exact Nualt-style sequence with 2 realistic engineering self-corrections:
    // Correction 1: latencyBudget: "300ms" -> pause -> backspace 7 -> "<5ms"
    // Correction 2: hallucinationRate: 0.24 -> pause -> backspace 4 -> 0.0
    const scriptOps: TypewriterOp[] = [
      {
        type: 'tokens',
        list: [
          { text: 'interface', cls: 'c-kw' },
          { text: ' ' },
          { text: 'EngineerProfile', cls: 'c-type' },
          { text: ' {\n  ' },
          { text: 'candidate', cls: 'c-prop' },
          { text: ': ' },
          { text: '"Nguyen Minh Thuan"', cls: 'c-str' },
          { text: ';\n  ' },
          { text: 'university', cls: 'c-prop' },
          { text: ': ' },
          { text: '"International University (VNU-HCM)"', cls: 'c-str' },
          { text: ';\n  ' },
          { text: 'graduation', cls: 'c-prop' },
          { text: ': ' },
          { text: '"Late 2026 (B.S. CSE · GPA 3.0/4.0)"', cls: 'c-str' },
          { text: ';\n  ' },
          { text: 'focus', cls: 'c-prop' },
          { text: ': [' },
          { text: '"Hybrid RAG"', cls: 'c-str' },
          { text: ', ' },
          { text: '"FastAPI"', cls: 'c-str' },
          { text: ', ' },
          { text: '"High-Load Telemetry"', cls: 'c-str' },
          { text: '];\n}\n\n' },
          { text: 'export async function', cls: 'c-kw' },
          { text: ' ' },
          { text: 'initiateHandshake', cls: 'c-fn' },
          { text: '(\n  ' },
          { text: 'role', cls: 'c-prop' },
          { text: ': ' },
          { text: '"AI Engineer"', cls: 'c-str' },
          { text: ' | ' },
          { text: '"Backend Engineer"', cls: 'c-str' },
          { text: '\n) {\n  ' },
          { text: 'return await', cls: 'c-kw' },
          { text: ' ' },
          { text: 'dispatchOffer', cls: 'c-fn' },
          { text: '({\n    ' },
          { text: 'email', cls: 'c-prop' },
          { text: ': ' },
          { text: '"thuanmm0426@gmail.com"', cls: 'c-str' },
          { text: ',\n    ' },
          { text: 'phone', cls: 'c-prop' },
          { text: ': ' },
          { text: '"+84 819-786-704"', cls: 'c-str' },
          { text: ',\n    ' },
          { text: 'latencyBudget', cls: 'c-prop' },
          { text: ': ' },
          { text: '"300ms"', cls: 'c-str' },
        ],
      },
      { type: 'pause', ms: 420 },
      { type: 'delete', count: 7 }, // deletes "300ms"
      {
        type: 'tokens',
        list: [
          { text: '"<5ms"', cls: 'c-str' },
          { text: ',\n    ' },
          { text: 'hallucinationRate', cls: 'c-prop' },
          { text: ': ' },
          { text: '0.24', cls: 'c-num' },
        ],
      },
      { type: 'pause', ms: 450 },
      { type: 'delete', count: 4 }, // deletes 0.24
      {
        type: 'tokens',
        list: [
          { text: '0.0', cls: 'c-num' },
          { text: ',\n  });\n}' },
        ],
      },
    ];

    let activeRunId = 0;

    function runTypewriter(): void {
      activeRunId++;
      const runId = activeRunId;

      const codeEl = codePre!.querySelector('code') || codePre!;
      codeEl.innerHTML = '';

      const cursor = document.createElement('span');
      cursor.className = 'cta-cursor';
      cursor.textContent = '|';
      codeEl.appendChild(cursor);

      interface CharRecord {
        node: Text;
        span?: HTMLElement;
      }
      const typedChars: CharRecord[] = [];

      let opIdx = 0;
      let tokenIdx = 0;
      let charIdx = 0;
      let deleteRemaining = -1;
      let currentSpan: HTMLElement | null = null;
      let currentTextNode: Text | null = null;
      let nextActionAt = performance.now() + 140;

      function advanceOneAction(now: number): boolean {
        if (opIdx >= scriptOps.length) return false;
        const op = scriptOps[opIdx];

        if (op.type === 'pause') {
          opIdx++;
          nextActionAt = now + op.ms;
          return true;
        }

        if (op.type === 'delete') {
          if (deleteRemaining < 0) {
            deleteRemaining = op.count;
          }
          if (deleteRemaining > 0 && typedChars.length > 0) {
            const last = typedChars.pop()!;
            last.node.textContent = (last.node.textContent || '').slice(0, -1);
            if (!last.node.textContent && last.span && last.span.parentNode) {
              last.span.remove();
            }
            deleteRemaining--;
            currentSpan = null;
            currentTextNode = null;
            nextActionAt = now + 55;
            return true;
          }
          deleteRemaining = -1;
          opIdx++;
          nextActionAt = now + 110;
          return true;
        }

        // op.type === 'tokens'
        if (tokenIdx >= op.list.length) {
          opIdx++;
          tokenIdx = 0;
          charIdx = 0;
          currentSpan = null;
          currentTextNode = null;
          nextActionAt = now + 6;
          return true;
        }

        const token = op.list[tokenIdx];
        if (charIdx === 0) {
          if (token.cls) {
            currentSpan = document.createElement('span');
            currentSpan.className = token.cls;
            currentTextNode = document.createTextNode('');
            currentSpan.appendChild(currentTextNode);
            codeEl.insertBefore(currentSpan, cursor);
          } else {
            currentSpan = null;
            currentTextNode = document.createTextNode('');
            codeEl.insertBefore(currentTextNode, cursor);
          }
        }

        const ch = token.text[charIdx];
        currentTextNode!.textContent += ch;
        typedChars.push({ node: currentTextNode!, span: currentSpan || undefined });
        charIdx++;

        if (charIdx >= token.text.length) {
          tokenIdx++;
          charIdx = 0;
        }

        nextActionAt += 5.5;
        return true;
      }

      function frame(now: number): void {
        if (runId !== activeRunId) return;
        let safety = 0;
        while (now >= nextActionAt && opIdx < scriptOps.length && safety < 24) {
          safety++;
          if (!advanceOneAction(now)) break;
        }
        if (opIdx < scriptOps.length) {
          requestAnimationFrame(frame);
        }
      }

      requestAnimationFrame(frame);
    }

    let triggeredOnce = false;
    function triggerCodeWindow(): void {
      if (triggeredOnce) return;
      triggeredOnce = true;
      codeWrap!.classList.add('is-revealed');
      runTypewriter();
      codeIo.unobserve(codeWrap!);
    }

    const codeIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && entry.boundingClientRect.top > 0) return;
          triggerCodeWindow();
        });
      },
      { threshold: 0.05 }
    );
    codeIo.observe(codeWrap);
    window.addEventListener(
      'scroll',
      () => {
        if (!triggeredOnce && codeWrap.getBoundingClientRect().top <= window.innerHeight * 0.92) {
          triggerCodeWindow();
        }
      },
      { passive: true }
    );

    replayBtn?.addEventListener('click', () => {
      runTypewriter();
    });
  }

  // 2. Social Bento Row Viewport-Entry Spring Wave Hint (Nualt CtaIconsHint)
  if (bentoGrid) {
    const cells = bentoGrid.querySelectorAll<HTMLElement>('[data-bento-cell]');
    const bentoIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          cells.forEach((cell, idx) => {
            setTimeout(() => {
              cell.setAttribute('data-hint', 'true');
              setTimeout(() => cell.removeAttribute('data-hint'), 650);
            }, 220 + idx * 150);
          });
          bentoIo.unobserve(bentoGrid);
        });
      },
      { threshold: 0.6 }
    );
    bentoIo.observe(bentoGrid);
  }

  // 3. Rising Architectural Footer Watermark ([data-footer-logo])
  if (footerWrap && footerLogo) {
    const footerIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          footerLogo.classList.add('is-revealed');
          footerIo.unobserve(footerWrap);
        });
      },
      { threshold: 0.15 }
    );
    footerIo.observe(footerWrap);
  }
}

/* ==========================================================================
   MASTER BOOTSTRAP
   ========================================================================== */
function initAllAnimations(): void {
  initSmoothScroll();
  initLoaderCover();
  initScrollVelocityTracker();
  initSectionAndHeadingEntrances();
  initPixelButtons();
  initHeroTetris();
  initPipelineCanvases();
  initIsometricAssemblies();
  initCaseStudyRows();
  initOsWindowAndTree();
  initBlueprintFramesAndAccordions();
  initContactAnimations();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllAnimations);
} else {
  initAllAnimations();
}
