/**
 * DeckForge — Remotion-style Presentation Framework
 *
 * Public API for programmatic usage.
 *
 * Usage:
 *   const { renderHTML, exportPPTX, exportPDF, themes, getTheme } = require('deckforge');
 */

const { renderHTML } = require("./core/html-renderer");
const { exportPresentation } = require("./core/exporter");
const { devServer } = require("./core/dev-server");
const { themes, getTheme, mergeTheme, themeToCSSVariables } = require("./core/theme-engine");
const { transitionCSS, getTransitionClass } = require("./core/transitions");
const { exportPPTX } = require("./exporters/pptx-exporter");
const { exportPDF } = require("./exporters/pdf-exporter");

module.exports = {
  // Core
  renderHTML,
  exportPresentation,
  devServer,

  // Themes
  themes,
  getTheme,
  mergeTheme,
  themeToCSSVariables,

  // Transitions
  transitionCSS,
  getTransitionClass,

  // Exporters
  exportPPTX,
  exportPDF,
};
