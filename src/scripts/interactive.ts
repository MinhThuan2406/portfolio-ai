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
  const modalBody = document.getElementById('cv-modal-body');
  const downloadBtn = document.getElementById('cv-download-btn');
  const newTabBtn = document.getElementById('cv-newtab-btn');
  if (!modal) return;

  downloadBtn?.addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = '/cv.pdf';
    a.download = 'Nguyen_Minh_Thuan_Resume.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });

  newTabBtn?.addEventListener('click', () => {
    window.open('/cv.pdf', '_blank', 'noopener,noreferrer');
  });

  function openModal(): void {
    modal!.classList.add('is-open');
    modal!.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (modalBody) {
      modalBody.scrollTop = 0;
    }
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

function initBackToTop(): void {
  const btn = document.getElementById('floating-back-to-top');
  if (!btn) return;

  function updateVisibility(): void {
    if (window.scrollY > 300) {
      btn?.classList.add('is-visible');
    } else {
      btn?.classList.remove('is-visible');
    }
  }

  window.addEventListener('scroll', updateVisibility, { passive: true });
  updateVisibility();

  btn.addEventListener('click', (e: MouseEvent) => {
    e.preventDefault();
    const smoothFn = (window as unknown as { __smoothScrollTo?: (y: number) => void }).__smoothScrollTo;
    if (typeof smoothFn === 'function') {
      smoothFn(0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (history.pushState) {
      history.pushState(null, '', '#top');
    }
  });
}

function initAll(): void {
  initCopyEmail();
  initCvModal();
  initBackToTop();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}
