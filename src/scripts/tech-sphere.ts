interface TechIcon {
  name: string;
  hex: string;
  path: string;
}

interface SphereNode {
  name: string;
  hex: string;
  path2d: Path2D;
  x: number;
  y: number;
  z: number;
  projX: number;
  projY: number;
  projZ: number;
  scale: number;
  alpha: number;
  radiusBadge: number;
}

function initSphere() {
  const canvas = document.getElementById('tech-sphere') as HTMLCanvasElement | null;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let rawIcons: TechIcon[] = [];
  try {
    rawIcons = JSON.parse(canvas.dataset.icons || '[]');
  } catch {
    return;
  }
  if (!rawIcons.length) return;

  const count = rawIcons.length;
  const sphereRadius = 136;
  const nodes: SphereNode[] = rawIcons.map((t, i) => {
    const phi = Math.acos(-1 + (2 * i + 1) / count);
    const theta = Math.sqrt(count * Math.PI) * phi;
    return {
      name: t.name,
      hex: t.hex,
      path2d: new Path2D(t.path),
      x: sphereRadius * Math.cos(theta) * Math.sin(phi),
      y: sphereRadius * Math.sin(theta) * Math.sin(phi),
      z: sphereRadius * Math.cos(phi),
      projX: 0,
      projY: 0,
      projZ: 0,
      scale: 1,
      alpha: 1,
      radiusBadge: 18,
    };
  });

  let width = 0;
  let height = 0;
  const dpr = window.devicePixelRatio || 1;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width || 430;
    height = rect.height || 380;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }
  resize();
  window.addEventListener('resize', resize);

  let rotX = 0.22;
  let rotY = 0.45;
  let velX = 0.0008;
  let velY = 0.0024;
  let isDragging = false;
  let lastMouseX = 0;
  let lastMouseY = 0;
  let hoveredNode: SphereNode | null = null;

  const wrapper = canvas.parentElement;
  if (!wrapper) return;

  wrapper.addEventListener('pointerdown', (e) => {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    wrapper.setPointerCapture?.(e.pointerId);
    canvas.style.cursor = 'grabbing';
  });

  wrapper.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (isDragging) {
      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      velY = dx * 0.0045;
      velX = -dy * 0.0045;
      rotY += velY;
      rotX += velX;
      canvas.style.cursor = 'grabbing';
    } else {
      hoveredNode = null;
      for (let i = nodes.length - 1; i >= 0; i--) {
        const n = nodes[i];
        if (n.projZ > 5) {
          const dist = Math.hypot(mouseX - n.projX, mouseY - n.projY);
          if (dist <= (n.radiusBadge || 18) * n.scale + 6) {
            hoveredNode = n;
            break;
          }
        }
      }
      canvas.style.cursor = hoveredNode ? 'pointer' : 'grab';
    }
  });

  const stopDrag = (e?: PointerEvent) => {
    if (!isDragging) return;
    isDragging = false;
    if (e?.pointerId) {
      try {
        wrapper.releasePointerCapture?.(e.pointerId);
      } catch {
        // Ignored
      }
    }
    canvas.style.cursor = hoveredNode ? 'pointer' : 'grab';
  };

  wrapper.addEventListener('pointerup', stopDrag);
  wrapper.addEventListener('pointercancel', stopDrag);
  window.addEventListener('pointerup', stopDrag);

  const cameraDistance = 330;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function render() {
    if (!isDragging) {
      velX *= 0.94;
      velY *= 0.94;

      if (!prefersReducedMotion) {
        const t = performance.now() * 0.0006;
        const autoVelY = Math.cos(t * 0.7) * 0.001 + Math.sin(t * 1.5) * 0.0008 + 0.0018;
        const autoVelX = Math.sin(t * 0.85) * 0.0011 + Math.cos(t * 1.3) * 0.0006 + 0.0003;

        const userSpeed = Math.hypot(velX, velY);
        const blend = Math.max(0, 1 - userSpeed / 0.0025);
        const hoverDamping = hoveredNode ? 0.25 : 1;

        rotX += velX + autoVelX * blend * hoverDamping;
        rotY += velY + autoVelY * blend * hoverDamping;
      }
    }

    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);

    // Guide wireframes
    ctx.save();
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 5]);
    ctx.strokeStyle = 'rgba(28, 82, 176, 0.12)';
    ctx.beginPath();
    ctx.ellipse(cx, cy, sphereRadius * 0.98, sphereRadius * 0.32, rotX, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(20, 22, 25, 0.07)';
    ctx.beginPath();
    ctx.ellipse(cx, cy, sphereRadius * 0.35, sphereRadius * 0.98, rotY, 0, Math.PI * 2);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.strokeStyle = 'rgba(28, 82, 176, 0.08)';
    ctx.beginPath();
    ctx.arc(cx, cy, sphereRadius * 1.05, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // 3D projection
    nodes.forEach((n) => {
      const x1 = n.x * cosY + n.z * sinY;
      const z1 = -n.x * sinY + n.z * cosY;
      const y2 = n.y * cosX - z1 * sinX;
      const z2 = n.y * sinX + z1 * cosX;

      const scale = cameraDistance / (cameraDistance + z2);
      n.projX = cx + x1 * scale;
      n.projY = cy + y2 * scale;
      n.projZ = z2;
      n.scale = scale;
      const normZ = (z2 + sphereRadius) / (2 * sphereRadius);
      n.alpha = Math.max(0.2, Math.min(1, 0.25 + normZ * 0.75));
    });

    const sorted = [...nodes].sort((a, b) => a.projZ - b.projZ);

    sorted.forEach((n) => {
      const isFront = n.projZ >= -12;
      const isHovered = hoveredNode === n;
      const currentScale = 0.82 + (n.scale - 0.7) * 0.42;

      if (isFront) {
        const badgeRadius = (isHovered ? 21 : 18) * currentScale;

        ctx.save();
        ctx.shadowColor = isHovered ? 'rgba(28, 82, 176, 0.35)' : 'rgba(20, 22, 25, 0.08)';
        ctx.shadowBlur = isHovered ? 12 : 5;
        ctx.shadowOffsetY = isHovered ? 2 : 1;
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = isHovered ? '#1c52b0' : `rgba(216, 222, 232, ${Math.min(1, n.alpha + 0.15)})`;
        ctx.lineWidth = isHovered ? 2 : 1.2;
        ctx.beginPath();
        ctx.arc(n.projX, n.projY, badgeRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.translate(n.projX, n.projY);
        const iconScale = ((isHovered ? 24 : 21) / 24) * currentScale;
        ctx.scale(iconScale, iconScale);
        ctx.translate(-12, -12);
        ctx.fillStyle = n.hex;
        ctx.fill(n.path2d);
        ctx.restore();

        ctx.save();
        ctx.fillStyle = isHovered ? '#1c52b0' : `rgba(20, 22, 25, ${Math.min(1, n.alpha + 0.1)})`;
        ctx.font = `${isHovered ? '600' : '500'} ${10.5 * currentScale}px "DM Mono", monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(n.name, n.projX, n.projY + badgeRadius + 4);
        ctx.restore();
      } else {
        ctx.save();
        ctx.translate(n.projX, n.projY);
        const iconScale = (17 / 24) * currentScale;
        ctx.scale(iconScale, iconScale);
        ctx.translate(-12, -12);
        ctx.fillStyle = `rgba(130, 140, 155, ${n.alpha * 0.45})`;
        ctx.fill(n.path2d);
        ctx.restore();
      }
    });

    requestAnimationFrame(render);
  }

  canvas.style.cursor = 'grab';
  requestAnimationFrame(render);
}

function initNavigation() {
  const stickyHeader = document.querySelector('.site-header-sticky');
  const navLinks = document.querySelectorAll('.main-nav .nav-link');
  const sectionIds = ['work', 'practice', 'background', 'contact'];
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];

  const onScroll = () => {
    if (stickyHeader) {
      stickyHeader.classList.toggle('is-scrolled', window.scrollY > 20);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const activeId = entry.target.id;
            navLinks.forEach((link) => {
              const href = link.getAttribute('href');
              link.classList.toggle('is-active', href === '#' + activeId);
            });
          }
        });
      },
      { rootMargin: '-20% 0px -65% 0px' }
    );

    sections.forEach((sec) => observer.observe(sec));
  }
}

let isInitialized = false;
function setup() {
  if (isInitialized) return;
  isInitialized = true;
  initSphere();
  initNavigation();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setup);
} else {
  setup();
}

