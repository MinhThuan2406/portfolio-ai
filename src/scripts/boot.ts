/**
 * System Ignition Boot Sequence with 3D Mechanical Switch
 * Full Three.js WebGL interactive 3D switch, explode anatomy view,
 * sound synthesis / authentic samples, and zero-hallucination boot sequence.
 * 
 * Built with fault-tolerant defensive fallbacks: emergency skip, escape keys,
 * auto-boot countdown, and CSS tactile switch fallback if WebGL is unavailable.
 */

import { Switch3DController, type SwitchColor } from './switch-3d';

const STORAGE_KEY = 'thuan_portfolio_boot_ts';
const BOOT_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days TTL

export function initBootSequence(): void {
  const overlay = document.getElementById('system-boot-overlay');
  const mainApp = document.getElementById('main-app');
  const container3D = document.getElementById('boot-switch-3d-container');
  const skipBtn = document.getElementById('boot-skip-btn');
  const muteBtn = document.getElementById('boot-mute-btn') as HTMLButtonElement | null;
  const terminalLog = document.getElementById('boot-terminal-log');
  const replayBtn = document.getElementById('replay-boot-btn');
  const explodeToggleBtn = document.getElementById('boot-explode-toggle');
  const explodeText = document.getElementById('boot-explode-text');
  const keycapToggleBtn = document.getElementById('boot-keycap-toggle');
  const keycapText = document.getElementById('boot-keycap-text');
  const specText = document.getElementById('boot-switch-spec-text');
  const colorPills = document.querySelectorAll<HTMLButtonElement>('.switch-color-pills .switch-pill');
  const countdownEl = overlay?.querySelector('.boot-foot span:first-child');

  if (!overlay || !mainApp) return;

  let isMuted = false;
  let isBooted = false;
  let autoBootTimer: number | null = null;
  let countdownInterval: number | null = null;
  let remainingSeconds = 25;
  let audioCtx: AudioContext | null = null;
  let switch3d: Switch3DController | null = null;

  // Safe localStorage helper for Safari Private Mode
  function isPreviouslyBooted(): boolean {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return false;
      const timestamp = parseInt(stored, 10);
      return !isNaN(timestamp) && Date.now() - timestamp < BOOT_TTL_MS;
    } catch {
      return false;
    }
  }

  function markBooted(): void {
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      // Safe ignore in restricted sandbox / private browsing
    }
  }

  // Synthesized mechanical thock sound
  function playThockSound(): void {
    if (isMuted) return;
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

      // Bottom-out resonator (145Hz down to 36Hz)
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(145, now);
      osc.frequency.exponentialRampToValueAtTime(36, now + 0.055);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.06);

      // Contact leaf click transient (860Hz down to 120Hz)
      const clickOsc = audioCtx.createOscillator();
      const clickGain = audioCtx.createGain();
      clickOsc.type = 'triangle';
      clickOsc.frequency.setValueAtTime(860, now);
      clickOsc.frequency.exponentialRampToValueAtTime(120, now + 0.022);
      clickGain.gain.setValueAtTime(0.18, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
      clickOsc.connect(clickGain);
      clickGain.connect(audioCtx.destination);
      clickOsc.start(now);
      clickOsc.stop(now + 0.025);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // Dismiss overlay and reveal portfolio with fluid choreographed transition
  function dismissOverlay(immediate = false): void {
    if (isBooted) return;
    isBooted = true;

    clearTimers();
    markBooted();

    if (immediate) {
      document.body.classList.remove('has-boot-overlay');
      document.body.classList.add('boot-ignited');
      overlay.style.display = 'none';
      overlay.setAttribute('inert', '');
      mainApp.removeAttribute('inert');
      return;
    }

    // Phase 1: Ignition flare and shockwave start immediately (T = 0ms)
    overlay.classList.add('is-ignited');

    // Phase 2: Switch springs back up and the fluid dissolve begins (T = 160ms)
    setTimeout(() => {
      document.body.classList.remove('has-boot-overlay');
      document.body.classList.add('boot-ignited');
      overlay.classList.add('is-dismissing');
      mainApp.removeAttribute('inert');
    }, 160);

    // Phase 3: Cleanup and focus transfer once transition completes (T = 820ms)
    setTimeout(() => {
      overlay.style.display = 'none';
      overlay.setAttribute('inert', '');
      const firstTarget = document.querySelector('h1') || document.querySelector('a');
      (firstTarget as HTMLElement)?.focus();
    }, 820);
  }

  // Rapid boot sequence
  function runBootSequence(): void {
    if (isBooted) return;

    clearTimers();

    // Haptic feedback for supported devices (Android)
    try {
      if ('vibrate' in navigator) {
        navigator.vibrate([24, 40, 28]);
      }
    } catch {
      // Safe ignore
    }

    playThockSound();

    const statusText = overlay?.querySelector('.boot-status span:last-child');
    if (statusText) {
      statusText.textContent = 'ONLINE · IGNITION CONFIRMED';
    }
    if (terminalLog) {
      terminalLog.textContent = 'SYSTEM ONLINE · WELCOME TO DOSSIER';
    }

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      dismissOverlay(true);
      return;
    }

    dismissOverlay(false);
  }

  function clearTimers(): void {
    if (autoBootTimer) {
      clearTimeout(autoBootTimer);
      autoBootTimer = null;
    }
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
  }

  function pauseAutoBoot(): void {
    clearTimers();
    if (countdownEl) {
      countdownEl.textContent = 'INTERACTIVE 3D INSPECTION · MANUAL IGNITION';
    }
    // Hard fallback after 60s even during inspection
    autoBootTimer = window.setTimeout(() => {
      if (!isBooted) {
        isMuted = true;
        runBootSequence();
      }
    }, 60000);
  }

  function setupReplayListener(): void {
    if (!replayBtn) return;
    replayBtn.addEventListener('click', () => {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Safe ignore
      }
      window.location.hash = '';
      window.location.reload();
    });
  }

  // Deep-link check: if URL has an anchor hash or search query, skip immediately
  const hasDeepLink = window.location.hash.length > 1 || window.location.search.length > 1;

  if (hasDeepLink || isPreviouslyBooted()) {
    dismissOverlay(true);
    setupReplayListener();
    return;
  }

  // 1. CRITICAL: Attach emergency navigation handlers FIRST
  skipBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    dismissOverlay(false);
  });

  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (isBooted) return;

    if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      if (switch3d) {
        switch3d.pressSwitch();
      } else {
        runBootSequence();
      }
    } else if (e.key === 'Escape' || e.key === 'Esc') {
      e.preventDefault();
      dismissOverlay(false);
    }
  });

  muteBtn?.addEventListener('click', () => {
    isMuted = !isMuted;
    muteBtn.setAttribute('aria-pressed', String(isMuted));
    muteBtn.classList.toggle('is-muted', isMuted);
    const label = muteBtn.querySelector('.mute-label');
    if (label) {
      label.textContent = isMuted ? 'UNMUTE' : 'AUDIO ON';
    }
  });

  setupReplayListener();

  // 2. Start visible countdown and auto-boot watchdog
  countdownInterval = window.setInterval(() => {
    remainingSeconds--;
    if (countdownEl && remainingSeconds > 0) {
      countdownEl.textContent = `AUTO-BOOT IN ${remainingSeconds}S IF IDLE`;
    }
    if (remainingSeconds <= 0) {
      clearTimers();
      if (!isBooted) {
        isMuted = true; // silent auto-boot
        runBootSequence();
      }
    }
  }, 1000);

  // Active state: isolate main background from accessibility tree and tab order
  document.body.classList.add('has-boot-overlay');
  mainApp.setAttribute('inert', '');
  overlay.removeAttribute('inert');

  // 3. Fallback CSS Switch renderer in case 3D/WebGL fails
  function renderFallbackSwitch(target: HTMLElement): void {
    target.innerHTML = `
      <div class="fallback-switch-wrapper">
        <button type="button" class="fallback-switch-button" aria-label="Mechanical Switch - Click to initialize">
          <div class="fallback-switch-cap">
            <span class="fallback-switch-stem"></span>
            <span class="fallback-switch-label mono">IGNITE</span>
          </div>
          <div class="fallback-switch-base"></div>
        </button>
      </div>
    `;

    const btn = target.querySelector('.fallback-switch-button');
    btn?.addEventListener('click', () => {
      runBootSequence();
    });
  }

  // 4. Safe 3D Switch Initialization
  if (container3D) {
    try {
      switch3d = new Switch3DController(container3D, {
        initialColor: 'blue',
        initialMode: 'assembled',
        showKeycap: false,
        onPress: () => {
          runBootSequence();
        }
      });

      // Postpone auto-boot if user is actively inspecting the 3D model
      container3D.addEventListener('pointerdown', pauseAutoBoot);
    } catch {
      console.warn('3D WebGL Switch initialization encountered an issue. Rendering tactile fallback.');
      renderFallbackSwitch(container3D);
    }

    // Direct click fallback on container
    container3D.addEventListener('click', () => {
      if (!switch3d) {
        runBootSequence();
      }
    });
  }

  // 5. Connect UI toolbars (safe against null / failures)
  keycapToggleBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    pauseAutoBoot();
    if (!switch3d) return;
    const hasKeycap = switch3d.toggleKeycap();
    if (keycapText) {
      keycapText.textContent = hasKeycap ? 'KEYCAP: ON' : 'KEYCAP: OFF';
    }
    keycapToggleBtn.classList.toggle('is-active', hasKeycap);
  });

  explodeToggleBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    pauseAutoBoot();
    if (!switch3d) return;
    const isNowExploded = switch3d.toggleExploded();
    if (explodeText) {
      explodeText.textContent = isNowExploded ? 'ASSEMBLE' : 'EXPLODE';
    }
    explodeToggleBtn.classList.toggle('is-exploded', isNowExploded);
  });

  colorPills.forEach((pill) => {
    pill.addEventListener('click', (e) => {
      e.stopPropagation();
      pauseAutoBoot();
      const rawColor = pill.dataset.color;
      if (rawColor !== 'blue' && rawColor !== 'red' && rawColor !== 'brown') return;
      const color: SwitchColor = rawColor;

      colorPills.forEach((p) => p.classList.remove('is-active'));
      pill.classList.add('is-active');

      if (switch3d) {
        switch3d.setColor(color);
        const info = switch3d.getColorInfo();
        if (specText) {
          specText.textContent = `${info.name} · ${info.force} ACTUATION (${info.type.toUpperCase()}) · KRYTOX 205G0 LUBED`;
        }
      }
    });
  });

  // Instruction and terminal click helpers
  terminalLog?.parentElement?.addEventListener('click', () => {
    runBootSequence();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBootSequence);
} else {
  initBootSequence();
}
