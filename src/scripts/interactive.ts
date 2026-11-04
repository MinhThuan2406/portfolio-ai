function initMechanicalSwitch(): void {
  const switchBtn = document.getElementById('mech-switch-btn');
  const clickCountEl = document.getElementById('switch-clicks');
  if (!switchBtn) return;

  const btn = switchBtn;
  let clickCount = 0;
  let audioCtx: AudioContext | null = null;

  function playThock(): void {
    try {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return;

      if (!audioCtx) {
        audioCtx = new AudioCtxClass();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const now = audioCtx.currentTime;

      // Bottom-out thock resonator
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(145, now);
      osc.frequency.exponentialRampToValueAtTime(36, now + 0.055);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.06);

      // Tactile contact click transient
      const clickOsc = audioCtx.createOscillator();
      const clickGain = audioCtx.createGain();
      clickOsc.type = 'triangle';
      clickOsc.frequency.setValueAtTime(860, now);
      clickOsc.frequency.exponentialRampToValueAtTime(120, now + 0.022);

      clickGain.gain.setValueAtTime(0.2, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      clickOsc.connect(clickGain);
      clickGain.connect(audioCtx.destination);
      clickOsc.start(now);
      clickOsc.stop(now + 0.025);
    } catch {
      // Audio playback silently fails if autoplay restricted by browser policy
    }
  }

  function triggerClick(): void {
    clickCount++;
    if (clickCountEl) {
      clickCountEl.textContent = clickCount.toString();
    }
    playThock();

    btn.classList.add('is-pressed');
    setTimeout(() => {
      btn.classList.remove('is-pressed');
    }, 120);
  }

  btn.addEventListener('click', triggerClick);

  // Expose trigger for keyboard shortcut
  (window as unknown as { __triggerThock?: () => void }).__triggerThock = triggerClick;
}

function initSpotlightCards(): void {
  // Only enable on desktop pointer devices to preserve mobile performance
  if (window.matchMedia('(hover: none) or (pointer: coarse)').matches) {
    return;
  }

  const cards = document.querySelectorAll<HTMLElement>('.spotlight-card');
  if (!cards.length) return;

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mouse-x', `-999px`);
      card.style.setProperty('--mouse-y', `-999px`);
    });
  });
}

function initKeyboardShortcuts(): void {
  const sectionMap: Record<string, string> = {
    '1': '#top',
    '2': '#work',
    '3': '#background',
    '4': '#rest-stop',
  };

  window.addEventListener('keydown', (e: KeyboardEvent) => {
    // Ignore when user is focusing an input, textarea, or contentEditable element
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
      const targetId = sectionMap[key];
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (key === 'k') {
      const triggerThock = (window as unknown as { __triggerThock?: () => void }).__triggerThock;
      if (typeof triggerThock === 'function') {
        triggerThock();
      }
    }
  });
}

function initAll(): void {
  initMechanicalSwitch();
  initSpotlightCards();
  initKeyboardShortcuts();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}
