/**
 * DeckForge Animation & Transition System
 *
 * Provides CSS keyframes, slide transitions, and element-level
 * entrance/exit animations. These get injected into the HTML output.
 */

const transitionCSS = `
/* ═══════════════════════════════════════════════════════
   SLIDE TRANSITIONS
   ═══════════════════════════════════════════════════════ */

/* Fade */
.df-transition-fade .df-slide { opacity: 0; transition: opacity var(--df-transition-duration) var(--df-transition-easing); }
.df-transition-fade .df-slide.active { opacity: 1; }

/* Slide Up */
.df-transition-slide-up .df-slide {
  opacity: 0; transform: translateY(60px);
  transition: opacity var(--df-transition-duration) var(--df-transition-easing),
              transform var(--df-transition-duration) var(--df-transition-easing);
}
.df-transition-slide-up .df-slide.active { opacity: 1; transform: translateY(0); }

/* Slide Left */
.df-transition-slide-left .df-slide {
  opacity: 0; transform: translateX(100px);
  transition: opacity var(--df-transition-duration) var(--df-transition-easing),
              transform var(--df-transition-duration) var(--df-transition-easing);
}
.df-transition-slide-left .df-slide.active { opacity: 1; transform: translateX(0); }

/* Zoom */
.df-transition-zoom .df-slide {
  opacity: 0; transform: scale(0.85);
  transition: opacity var(--df-transition-duration) var(--df-transition-easing),
              transform var(--df-transition-duration) var(--df-transition-easing);
}
.df-transition-zoom .df-slide.active { opacity: 1; transform: scale(1); }

/* Cinematic (scale + fade from dark) */
.df-transition-cinematic .df-slide {
  opacity: 0; transform: scale(1.05); filter: brightness(0.7);
  transition: all var(--df-transition-duration) var(--df-transition-easing);
}
.df-transition-cinematic .df-slide.active {
  opacity: 1; transform: scale(1); filter: brightness(1);
}

/* Flip */
.df-transition-flip .df-slide {
  opacity: 0; transform: perspective(1200px) rotateY(-15deg);
  transition: all var(--df-transition-duration) var(--df-transition-easing);
}
.df-transition-flip .df-slide.active {
  opacity: 1; transform: perspective(1200px) rotateY(0deg);
}

/* ═══════════════════════════════════════════════════════
   ELEMENT ENTRANCE ANIMATIONS
   ═══════════════════════════════════════════════════════ */

@keyframes df-fadeIn    { from { opacity: 0; } to { opacity: 1; } }
@keyframes df-slideUp   { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes df-slideLeft { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
@keyframes df-scaleIn   { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
@keyframes df-blurIn    { from { opacity: 0; filter: blur(8px); } to { opacity: 1; filter: blur(0); } }
@keyframes df-typewriter { from { width: 0; } to { width: 100%; } }
@keyframes df-draw      { from { stroke-dashoffset: 1000; } to { stroke-dashoffset: 0; } }

/* Utility classes for staggered entrance */
.df-animate { opacity: 0; animation-fill-mode: forwards; }
.df-animate.in-view { animation-duration: 0.6s; animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); }

.df-anim-fade.in-view    { animation-name: df-fadeIn; }
.df-anim-up.in-view      { animation-name: df-slideUp; }
.df-anim-left.in-view    { animation-name: df-slideLeft; }
.df-anim-scale.in-view   { animation-name: df-scaleIn; }
.df-anim-blur.in-view    { animation-name: df-blurIn; }

/* Stagger delays */
.df-delay-1 { animation-delay: 0.1s; }
.df-delay-2 { animation-delay: 0.2s; }
.df-delay-3 { animation-delay: 0.35s; }
.df-delay-4 { animation-delay: 0.5s; }
.df-delay-5 { animation-delay: 0.7s; }
.df-delay-6 { animation-delay: 0.9s; }

/* ═══════════════════════════════════════════════════════
   FRAGMENT SUPPORT (reveal elements one-by-one)
   ═══════════════════════════════════════════════════════ */

.df-fragment { opacity: 0; transform: translateY(10px); transition: all 0.4s ease; }
.df-fragment.visible { opacity: 1; transform: translateY(0); }

/* ═══════════════════════════════════════════════════════
   PROGRESS BAR
   ═══════════════════════════════════════════════════════ */

.df-progress {
  position: fixed; bottom: 0; left: 0; height: 3px;
  background: var(--df-accent);
  transition: width 0.3s var(--df-transition-easing);
  z-index: 9999;
}
`;

function getTransitionClass(type) {
  return \`df-transition-\${type}\`;
}

module.exports = { transitionCSS, getTransitionClass };
