function initNavigation(): void {
  const stickyHeader = document.querySelector<HTMLElement>('.site-header-sticky');
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('.main-nav .nav-link');
  const sectionIds = ['work', 'practice', 'background', 'contact'];
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter((sec): sec is HTMLElement => sec !== null);

  const handleScroll = (): void => {
    if (stickyHeader) {
      stickyHeader.classList.toggle('is-scrolled', window.scrollY > 20);
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const activeId = entry.target.id;
            navLinks.forEach((link) => {
              const href = link.getAttribute('href');
              link.classList.toggle('is-active', href === `#${activeId}`);
            });
          }
        });
      },
      { rootMargin: '-20% 0px -65% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavigation);
} else {
  initNavigation();
}
