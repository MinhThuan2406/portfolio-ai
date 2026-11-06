function initCopyEmail(): void {
  const copyBtn = document.getElementById('copy-email-btn');
  const copyLabel = document.getElementById('copy-email-label');
  if (!copyBtn || !copyLabel) return;

  copyBtn.addEventListener('click', async () => {
    const email = copyBtn.getAttribute('data-email') || 'thuannm0426@gmail.com';
    try {
      await navigator.clipboard.writeText(email);
      copyLabel.textContent = 'COPIED TO CLIPBOARD ✓';
      setTimeout(() => {
        copyLabel.textContent = 'COPY EMAIL';
      }, 2200);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  });
}

function initCvModal(): void {
  const modal = document.getElementById('cv-modal');
  const backdrop = document.getElementById('cv-modal-backdrop');
  const closeBtn = document.getElementById('cv-modal-close');
  const iframe = document.getElementById('cv-iframe') as HTMLIFrameElement | null;
  if (!modal) return;

  function openModal(): void {
    if (iframe && !iframe.src.includes('cv.pdf')) {
      const dataSrc = iframe.getAttribute('data-src') || '/cv.pdf#view=FitH&toolbar=1';
      iframe.src = dataSrc;
    }
    modal!.classList.add('is-open');
    modal!.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(): void {
    modal!.classList.remove('is-open');
    modal!.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.addEventListener('click', (e: MouseEvent) => {
    const trigger = (e.target as HTMLElement)?.closest('[data-open-cv]');
    if (trigger) {
      e.preventDefault();
      openModal();
    }
  });

  closeBtn?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}

function initKeyboardShortcuts(): void {
  const sectionMap: Record<string, string> = {
    '1': '#work',
    '2': '#pipelines',
    '3': '#practice',
    '4': '#background',
    '5': '#contact',
  };

  window.addEventListener('keydown', (e: KeyboardEvent) => {
    const activeEl = document.activeElement;
    if (
      activeEl instanceof HTMLElement &&
      (activeEl.tagName === 'INPUT' ||
        activeEl.tagName === 'TEXTAREA' ||
        activeEl.isContentEditable)
    ) {
      return;
    }

    if (e.metaKey || e.ctrlKey || e.altKey) {
      return;
    }

    const key = e.key.toLowerCase();

    if (Object.prototype.hasOwnProperty.call(sectionMap, key)) {
      const targetEl = document.querySelector<HTMLElement>(sectionMap[key]);
      if (targetEl) {
        const smoothFn = (window as unknown as { __smoothScrollTo?: (y: number) => void }).__smoothScrollTo;
        if (typeof smoothFn === 'function') {
          const navHeight =
            parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')) || 49;
          const destY = Math.max(0, targetEl.getBoundingClientRect().top + window.scrollY - navHeight);
          smoothFn(destY);
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  });
}

function initAll(): void {
  initCopyEmail();
  initCvModal();
  initKeyboardShortcuts();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}
