export function initTheme(): void {
  const toggleBtn = document.getElementById('theme-toggle');
  const metaTheme = document.querySelector('meta[name="theme-color"]');

  function updateMetaColor(theme: string): void {
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#071324' : '#f4f2e8');
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
    toggleBtn.addEventListener('click', () => {
      const current =
        document.documentElement.getAttribute('data-theme') === 'dark'
          ? 'dark'
          : 'light';
      const next: 'dark' | 'light' = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTheme);
} else {
  initTheme();
}
