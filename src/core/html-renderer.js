/**
 * DeckForge HTML Renderer
 *
 * Takes a deck config (slides, theme, metadata) and produces a
 * self-contained HTML file with keyboard nav, touch support,
 * presenter notes, progress bar, and slide transitions.
 */

const { getTheme, mergeTheme, themeToCSSVariables } = require("./theme-engine");
const { transitionCSS, getTransitionClass } = require("./transitions");

function renderHTML(deckConfig) {
  const theme = deckConfig.theme
    ? typeof deckConfig.theme === "string"
      ? getTheme(deckConfig.theme)
      : mergeTheme(getTheme(deckConfig.theme.extends || "minimal"), deckConfig.theme)
    : getTheme("minimal");

  const slides = deckConfig.slides || [];
  const meta = deckConfig.meta || {};
  const transType = theme.transition.type || "fade";

  const slidesHTML = slides
    .map((slide, i) => {
      const layoutClass = slide.layout ? \`df-layout-\${slide.layout}\` : "df-layout-default";
      const bgStyle = slide.background
        ? \`background: \${slide.background};\`
        : "";
      const notesData = slide.notes ? \`data-notes="\${escapeAttr(slide.notes)}"\` : "";

      return \`
      <section class="df-slide \${layoutClass} \${i === 0 ? "active" : ""}"
               id="slide-\${i}" data-index="\${i}" \${notesData}
               style="\${bgStyle}">
        <div class="df-slide-inner">
          \${slide.html}
        </div>
      </section>\`;
    })
    .join("\n");

  return \`<!DOCTYPE html>
<html lang="\${meta.lang || "en"}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>\${meta.title || "DeckForge Presentation"}</title>
  <meta name="author" content="\${meta.author || ""}">
  <meta name="description" content="\${meta.description || ""}">
  \${theme.fonts.importUrl ? \`<link rel="stylesheet" href="\${theme.fonts.importUrl}">\` : ""}
  <style>
    \${themeToCSSVariables(theme)}
    \${baseCSS}
    \${transitionCSS}
    \${deckConfig.customCSS || ""}
  </style>
</head>
<body class="\${getTransitionClass(transType)}">

  <div class="df-deck" id="deck">
    \${slidesHTML}
  </div>

  <div class="df-progress" id="progress"></div>

  <div class="df-controls">
    <div class="df-slide-number" id="slideNumber">1 / \${slides.length}</div>
  </div>

  <!-- Presenter Notes Overlay (toggle with 'N') -->
  <div class="df-notes-overlay" id="notesOverlay">
    <div class="df-notes-content" id="notesContent"></div>
  </div>

  <!-- Slide Overview (toggle with 'O') -->
  <div class="df-overview" id="overview">
    \${slides.map((s, i) => \`
      <div class="df-overview-thumb" data-goto="\${i}">
        <div class="df-overview-number">\${i + 1}</div>
      </div>
    \`).join("")}
  </div>

  <script>
    \${presenterJS(slides.length)}
  </script>
</body>
</html>\`;
}

// ── Base CSS ─────────────────────────────────────────────

const baseCSS = \`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body {
    width: 100%; height: 100%; overflow: hidden;
    background: var(--df-bg); color: var(--df-fg);
    font-family: var(--df-font-body);
    font-size: 18px; line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  .df-deck {
    width: 100vw; height: 100vh; position: relative;
  }

  .df-slide {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    padding: var(--df-slide-padding);
    pointer-events: none;
  }
  .df-slide.active { pointer-events: auto; z-index: 1; }

  .df-slide-inner {
    max-width: 1100px; width: 100%;
  }

  /* ── Layout Variants ─── */
  .df-layout-center .df-slide-inner { text-align: center; }
  .df-layout-title .df-slide-inner { display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
  .df-layout-split .df-slide-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
  .df-layout-image-left .df-slide-inner { display: grid; grid-template-columns: 45% 1fr; gap: 48px; align-items: center; }
  .df-layout-image-right .df-slide-inner { display: grid; grid-template-columns: 1fr 45%; gap: 48px; align-items: center; }
  .df-layout-quote .df-slide-inner { display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; max-width: 800px; }

  /* ── Typography ─── */
  h1, h2, h3 { font-family: var(--df-font-heading); font-weight: 700; line-height: 1.15; }
  h1 { font-size: 3.2rem; margin-bottom: 0.5em; letter-spacing: -0.03em; }
  h2 { font-size: 2.2rem; margin-bottom: 0.4em; letter-spacing: -0.02em; }
  h3 { font-size: 1.5rem; margin-bottom: 0.3em; color: var(--df-muted); }
  p  { font-size: 1.25rem; margin-bottom: 0.8em; color: var(--df-fg); }
  .subtitle { font-size: 1.4rem; color: var(--df-muted); font-weight: 300; }
  code, pre { font-family: var(--df-font-code); }
  pre {
    background: var(--df-code-bg); padding: 24px; border-radius: 12px;
    font-size: 0.9rem; overflow-x: auto; line-height: 1.7;
  }
  .accent { color: var(--df-accent); }
  .muted  { color: var(--df-muted); }
  .big    { font-size: 5rem; font-weight: 800; letter-spacing: -0.04em; }
  .medium { font-size: 2rem; }

  blockquote {
    border-left: 4px solid var(--df-accent);
    padding: 16px 24px; margin: 24px 0;
    font-style: italic; font-size: 1.4rem;
    color: var(--df-muted);
  }

  /* ── Lists ─── */
  ul, ol { padding-left: 1.5em; margin-bottom: 1em; }
  li { font-size: 1.2rem; margin-bottom: 0.5em; }

  /* ── Images ─── */
  img { max-width: 100%; height: auto; border-radius: 8px; }

  /* ── Controls ─── */
  .df-controls {
    position: fixed; bottom: 20px; right: 24px; z-index: 100;
    font-family: var(--df-font-body); font-size: 0.85rem;
    color: var(--df-muted); user-select: none;
  }

  /* ── Notes Overlay ─── */
  .df-notes-overlay {
    display: none; position: fixed; bottom: 0; left: 0; right: 0;
    background: rgba(0,0,0,0.9); color: #fff; padding: 24px 32px;
    font-size: 1rem; z-index: 200; max-height: 200px; overflow-y: auto;
  }
  .df-notes-overlay.visible { display: block; }

  /* ── Overview Grid ─── */
  .df-overview {
    display: none; position: fixed; inset: 0; z-index: 300;
    background: var(--df-bg); padding: 40px;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px;
    overflow-y: auto;
  }
  .df-overview.visible { display: grid; }
  .df-overview-thumb {
    aspect-ratio: 16/9; background: var(--df-surface); border: 2px solid var(--df-border);
    border-radius: 8px; cursor: pointer; display: flex; align-items: center;
    justify-content: center; font-size: 1.5rem; font-weight: 700; color: var(--df-muted);
    transition: border-color 0.2s, transform 0.2s;
  }
  .df-overview-thumb:hover { border-color: var(--df-accent); transform: scale(1.03); }
\`;

// ── Presenter JS ─────────────────────────────────────────

function presenterJS(totalSlides) {
  return \`
    (function() {
      let current = 0;
      const total = \${totalSlides};
      const slides = document.querySelectorAll('.df-slide');
      const progress = document.getElementById('progress');
      const slideNum = document.getElementById('slideNumber');
      const notesOverlay = document.getElementById('notesOverlay');
      const notesContent = document.getElementById('notesContent');
      const overview = document.getElementById('overview');
      let notesVisible = false;
      let overviewVisible = false;

      function goto(n) {
        if (n < 0 || n >= total) return;

        // Handle fragments first
        const activeSlide = slides[current];
        const fragments = activeSlide.querySelectorAll('.df-fragment:not(.visible)');
        if (n > current && fragments.length > 0) {
          fragments[0].classList.add('visible');
          return;
        }

        slides[current].classList.remove('active');
        current = n;
        slides[current].classList.add('active');
        progress.style.width = ((current + 1) / total * 100) + '%';
        slideNum.textContent = (current + 1) + ' / ' + total;

        // Update notes
        const notes = slides[current].getAttribute('data-notes');
        notesContent.textContent = notes || '(no notes)';

        // Trigger entrance animations
        const animEls = slides[current].querySelectorAll('.df-animate');
        animEls.forEach(el => el.classList.add('in-view'));
      }

      // Keyboard navigation
      document.addEventListener('keydown', e => {
        if (overviewVisible && e.key === 'Escape') { overview.classList.remove('visible'); overviewVisible = false; return; }
        switch(e.key) {
          case 'ArrowRight': case 'ArrowDown': case ' ': case 'PageDown':
            e.preventDefault(); goto(current + 1); break;
          case 'ArrowLeft': case 'ArrowUp': case 'PageUp':
            e.preventDefault(); goto(current - 1); break;
          case 'Home': goto(0); break;
          case 'End': goto(total - 1); break;
          case 'n': case 'N':
            notesVisible = !notesVisible;
            notesOverlay.classList.toggle('visible', notesVisible); break;
          case 'o': case 'O':
            overviewVisible = !overviewVisible;
            overview.classList.toggle('visible', overviewVisible); break;
          case 'f': case 'F':
            document.documentElement.requestFullscreen?.(); break;
        }
      });

      // Touch / swipe
      let touchX = 0;
      document.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; });
      document.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - touchX;
        if (Math.abs(dx) > 50) goto(current + (dx < 0 ? 1 : -1));
      });

      // Click navigation (left/right halves)
      document.addEventListener('click', e => {
        if (overviewVisible) return;
        const x = e.clientX / window.innerWidth;
        goto(current + (x > 0.5 ? 1 : -1));
      });

      // Overview click-to-jump
      document.querySelectorAll('.df-overview-thumb').forEach(el => {
        el.addEventListener('click', e => {
          e.stopPropagation();
          goto(parseInt(el.dataset.goto));
          overview.classList.remove('visible');
          overviewVisible = false;
        });
      });

      // Init
      progress.style.width = (1 / total * 100) + '%';
      const initNotes = slides[0].getAttribute('data-notes');
      notesContent.textContent = initNotes || '(no notes)';
    })();
  \`;
}

function escapeAttr(s) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

module.exports = { renderHTML };
