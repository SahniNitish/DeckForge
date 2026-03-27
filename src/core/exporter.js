/**
 * DeckForge Export Orchestrator
 *
 * Routes export commands to the appropriate renderer.
 */

const path = require("path");
const fs = require("fs-extra");
const { renderHTML } = require("./html-renderer");
const { exportPPTX } = require("../exporters/pptx-exporter");
const { exportPDF } = require("../exporters/pdf-exporter");

async function exportPresentation({ format, deckConfig, outputDir, themeOverride }) {
  // Load deck config
  const config = require(deckConfig);

  if (themeOverride) {
    config.theme = themeOverride;
  }

  await fs.ensureDir(outputDir);

  const baseName = config.meta?.slug || "presentation";

  switch (format) {
    case "html": {
      const html = renderHTML(config);
      const outPath = path.join(outputDir, `${baseName}.html`);
      await fs.writeFile(outPath, html, "utf-8");
      return outPath;
    }

    case "pdf": {
      const outPath = path.join(outputDir, `${baseName}.pdf`);
      await exportPDF(config, outPath);
      return outPath;
    }

    case "pptx": {
      const outPath = path.join(outputDir, `${baseName}.pptx`);
      await exportPPTX(config, outPath);
      return outPath;
    }

    default:
      throw new Error(`Unknown format: ${format}. Use html, pdf, pptx, or all.`);
  }
}

module.exports = { exportPresentation };
