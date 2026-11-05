function initNavigation(): void {
  const header = document.getElementById('site-header');
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('.header-nav .nav-link');
  const blueSections = Array.from(document.querySelectorAll<HTMLElement>('[data-nav-blue]'));
  const trackedIds = ['work', 'pipelines', 'practice', 'background', 'contact'];
  const trackedSections = trackedIds
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null);

  // Measure actual rendered navbar height and sync --navbar-height
  function syncNavbarHeight(): number {
    if (!header) return 49;
    const h = Math.round(header.getBoundingClientRect().height) || 49;
    document.documentElement.style.setProperty('--navbar-height', `${h}px`);
    return h;
  }

  // Reversible polarity check across all [data-nav-blue] surfaces
  function updateHeaderPolarity(): void {
    if (!header) return;
    const navMidY = Math.min(24, (header.getBoundingClientRect().height || 49) * 0.5);
    let isOverBlue = false;

    for (const sec of blueSections) {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= navMidY && rect.bottom >= navMidY) {
        isOverBlue = true;
        break;
      }
    }

    header.setAttribute('data-nav-inverted', isOverBlue ? 'true' : 'false');
  }

  // Highlight active section in header nav
  function updateActiveSection(): void {
    const probeY = window.innerHeight * 0.28;
    let activeId = '';

    for (const sec of trackedSections) {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= probeY && rect.bottom >= 80) {
        activeId = sec.id;
      }
    }

    navLinks.forEach((link) => {
      const secId = link.getAttribute('data-section');
      link.classList.toggle('is-active', secId === activeId);
    });
  }

  let ticking = false;
  function onScroll(): void {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateHeaderPolarity();
        updateActiveSection();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener(
    'resize',
    () => {
      syncNavbarHeight();
      updateHeaderPolarity();
      updateActiveSection();
    },
    { passive: true }
  );

  syncNavbarHeight();
  updateHeaderPolarity();
  updateActiveSection();

  // Mobile menu toggle
  const menuBtn = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-nav-drawer');
  const menuLabel = menuBtn?.querySelector('.menu-label');

  if (menuBtn && drawer) {
    menuBtn.addEventListener('click', () => {
      const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
      const next = !isExpanded;
      menuBtn.setAttribute('aria-expanded', String(next));
      if (menuLabel) {
        menuLabel.textContent = next ? 'CLOSE' : 'MENU';
      }
      if (next) {
        drawer.removeAttribute('hidden');
      } else {
        drawer.setAttribute('hidden', '');
      }
    });

    drawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menuBtn.setAttribute('aria-expanded', 'false');
        if (menuLabel) {
          menuLabel.textContent = 'MENU';
        }
        drawer.setAttribute('hidden', '');
      });
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavigation);
} else {
  initNavigation();
}
