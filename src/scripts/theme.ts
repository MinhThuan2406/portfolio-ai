export function initTheme(): void {
  const toggleBtn = document.getElementById('theme-toggle');
  const metaTheme = document.querySelector('meta[name="theme-color"]');

  function updateMetaColor(theme: string): void {
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#0b0d14' : '#f8fafc');
    }
  }

  function getStoredTheme(): 'dark' | 'light' | null {
    try {
      const val = localStorage.getItem('theme');
      return val === 'dark' || val === 'light' ? val : null;
    } catch {
      return null;
    }
  }

  function applyTheme(newTheme: 'dark' | 'light'): void {
    document.documentElement.setAttribute('data-theme', newTheme);
    try {
      localStorage.setItem('theme', newTheme);
    } catch {
      // Safe ignore in restricted sandbox / private browsing
    }
    updateMetaColor(newTheme);
    window.dispatchEvent(
      new CustomEvent('theme-change', { detail: { theme: newTheme } })
    );
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e: MouseEvent) => {
      const current =
        document.documentElement.getAttribute('data-theme') === 'light'
          ? 'light'
          : 'dark';
      const next: 'dark' | 'light' = current === 'dark' ? 'light' : 'dark';

      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Use View Transitions API if supported for a buttery-smooth circular ripple
      const doc = document as Document & {
        startViewTransition?: (callback: () => void) => { ready: Promise<void> };
      };

      if (!isReduced && typeof doc.startViewTransition === 'function') {
        const x = e.clientX || window.innerWidth - 48;
        const y = e.clientY || 36;
        const endRadius = Math.hypot(
          Math.max(x, window.innerWidth - x),
          Math.max(y, window.innerHeight - y)
        );

        const transition = doc.startViewTransition(() => {
          applyTheme(next);
        });

        transition.ready.then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 420,
              easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
              pseudoElement: '::view-transition-new(root)',
            }
          );
        });
      } else {
        // Fallback smooth transition for browsers without View Transitions
        document.documentElement.classList.add('theme-transitioning');
        applyTheme(next);
        setTimeout(() => {
          document.documentElement.classList.remove('theme-transitioning');
        }, 400);
      }
    });
  }

  // Follow system theme changes if user has no saved preference
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (e) => {
      if (!getStoredTheme()) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTheme);
} else {
  initTheme();
}
