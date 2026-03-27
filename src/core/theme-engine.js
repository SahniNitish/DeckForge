/**
 * DeckForge Theme Engine
 *
 * Themes are plain objects that define colors, typography, spacing,
 * transitions, and component styles. Users can extend built-in themes
 * or create entirely custom ones.
 */

// ── Built-in Themes ──────────────────────────────────────

const themes = {
  // ── Minimal: clean, typographic, editorial ──────────
  minimal: {
    name: "Minimal",
    fonts: {
      heading: "'IBM Plex Sans', sans-serif",
      body: "'IBM Plex Sans', sans-serif",
      code: "'IBM Plex Mono', monospace",
      importUrl: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap",
    },
    colors: {
      bg: "#FAFAFA",
      fg: "#1A1A1A",
      accent: "#0066FF",
      accentLight: "#E6F0FF",
      muted: "#888888",
      surface: "#FFFFFF",
      border: "#E5E5E5",
      codeBackground: "#F5F5F5",
      gradientStart: "#FAFAFA",
      gradientEnd: "#F0F0F0",
    },
    spacing: { slide: "80px", element: "24px" },
    transition: {
      type: "fade",
      duration: "0.5s",
      easing: "cubic-bezier(0.25, 0.1, 0.25, 1)",
    },
    slideStyles: {
      borderRadius: "0",
      boxShadow: "none",
    },
  },

  // ── Dark: sleek, modern, developer-friendly ─────────
  dark: {
    name: "Dark",
    fonts: {
      heading: "'Space Grotesk', sans-serif",
      body: "'Inter', sans-serif",
      code: "'JetBrains Mono', monospace",
      importUrl: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
    },
    colors: {
      bg: "#0A0A0F",
      fg: "#E8E8ED",
      accent: "#6C63FF",
      accentLight: "#1A1730",
      muted: "#6B6B80",
      surface: "#12121A",
      border: "#2A2A3A",
      codeBackground: "#16161E",
      gradientStart: "#0A0A0F",
      gradientEnd: "#141420",
    },
    spacing: { slide: "80px", element: "28px" },
    transition: {
      type: "slide-up",
      duration: "0.6s",
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    },
    slideStyles: {
      borderRadius: "0",
      boxShadow: "none",
    },
  },

  // ── Pitch: bold, startup-energy, impactful ──────────
  pitch: {
    name: "Pitch",
    fonts: {
      heading: "'Outfit', sans-serif",
      body: "'Plus Jakarta Sans', sans-serif",
      code: "'Fira Code', monospace",
      importUrl: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&family=Plus+Jakarta+Sans:wght@300;400;500;600&family=Fira+Code:wght@400;500&display=swap",
    },
    colors: {
      bg: "#FFFFFF",
      fg: "#111111",
      accent: "#FF3366",
      accentLight: "#FFF0F4",
      muted: "#999999",
      surface: "#F8F8F8",
      border: "#EEEEEE",
      codeBackground: "#1E1E2E",
      gradientStart: "#FF3366",
      gradientEnd: "#FF6B35",
    },
    spacing: { slide: "64px", element: "20px" },
    transition: {
      type: "zoom",
      duration: "0.5s",
      easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    },
    slideStyles: {
      borderRadius: "0",
      boxShadow: "none",
    },
  },

  // ── Keynote: dramatic, cinematic, Apple-esque ───────
  keynote: {
    name: "Keynote",
    fonts: {
      heading: "'DM Sans', sans-serif",
      body: "'DM Sans', sans-serif",
      code: "'SF Mono', 'Fira Code', monospace",
      importUrl: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&display=swap",
    },
    colors: {
      bg: "#000000",
      fg: "#FFFFFF",
      accent: "#0A84FF",
      accentLight: "#0A1A2F",
      muted: "#8E8E93",
      surface: "#1C1C1E",
      border: "#38383A",
      codeBackground: "#1C1C1E",
      gradientStart: "#0A84FF",
      gradientEnd: "#5E5CE6",
    },
    spacing: { slide: "100px", element: "32px" },
    transition: {
      type: "cinematic",
      duration: "0.8s",
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    },
    slideStyles: {
      borderRadius: "0",
      boxShadow: "none",
    },
  },
};

// ── Theme Utilities ──────────────────────────────────────

function getTheme(name) {
  return themes[name] || themes.minimal;
}

function mergeTheme(base, overrides) {
  return {
    ...base,
    fonts: { ...base.fonts, ...overrides.fonts },
    colors: { ...base.colors, ...overrides.colors },
    spacing: { ...base.spacing, ...overrides.spacing },
    transition: { ...base.transition, ...overrides.transition },
    slideStyles: { ...base.slideStyles, ...overrides.slideStyles },
  };
}

function themeToCSSVariables(theme) {
  return `
    :root {
      /* Colors */
      --df-bg: ${theme.colors.bg};
      --df-fg: ${theme.colors.fg};
      --df-accent: ${theme.colors.accent};
      --df-accent-light: ${theme.colors.accentLight};
      --df-muted: ${theme.colors.muted};
      --df-surface: ${theme.colors.surface};
      --df-border: ${theme.colors.border};
      --df-code-bg: ${theme.colors.codeBackground};
      --df-gradient-start: ${theme.colors.gradientStart};
      --df-gradient-end: ${theme.colors.gradientEnd};

      /* Typography */
      --df-font-heading: ${theme.fonts.heading};
      --df-font-body: ${theme.fonts.body};
      --df-font-code: ${theme.fonts.code};

      /* Spacing */
      --df-slide-padding: ${theme.spacing.slide};
      --df-element-gap: ${theme.spacing.element};

      /* Transitions */
      --df-transition-duration: ${theme.transition.duration};
      --df-transition-easing: ${theme.transition.easing};
    }
  `;
}

module.exports = { themes, getTheme, mergeTheme, themeToCSSVariables };
