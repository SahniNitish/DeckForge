/**
 * DeckForge PDF Exporter
 *
 * Renders the HTML presentation in headless Chromium, captures
 * each slide as a page in a PDF.
 */

const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs-extra");
const { renderHTML } = require("../core/html-renderer");

async function exportPDF(deckConfig, outputPath) {
  // First render to HTML
  const html = renderHTML(deckConfig);
  const tmpHtml = path.join(path.dirname(outputPath), "_deckforge_tmp.html");
  await fs.writeFile(tmpHtml, html, "utf-8");

  const totalSlides = (deckConfig.slides || []).length;

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(\`file://\${tmpHtml}\`, { waitUntil: "networkidle0" });

  // Capture each slide as a separate PDF page
  const slideBuffers = [];

  for (let i = 0; i < totalSlides; i++) {
    // Navigate to slide
    await page.evaluate((idx) => {
      const slides = document.querySelectorAll(".df-slide");
      slides.forEach((s) => s.classList.remove("active"));
      slides[idx].classList.add("active");
      // Trigger animations
      slides[idx].querySelectorAll(".df-animate").forEach((el) => el.classList.add("in-view"));
      slides[idx].querySelectorAll(".df-fragment").forEach((el) => el.classList.add("visible"));
    }, i);

    await page.waitForTimeout(200); // let transitions settle

    const buf = await page.pdf({
      width: "1920px",
      height: "1080px",
      printBackground: true,
      pageRanges: "1",
    });
    slideBuffers.push(buf);
  }

  // For simplicity, re-render with all slides visible in print mode
  await page.evaluate(() => {
    document.body.innerHTML += \`<style>
      .df-slide { position: relative !important; opacity: 1 !important;
                  transform: none !important; filter: none !important;
                  pointer-events: auto !important; page-break-after: always;
                  width: 100vw; height: 100vh; display: flex !important; }
      .df-progress, .df-controls, .df-notes-overlay, .df-overview { display: none !important; }
      .df-fragment { opacity: 1 !important; transform: none !important; }
      .df-animate { opacity: 1 !important; }
    </style>\`;
    // Make all slides visible
    document.querySelectorAll(".df-slide").forEach((s) => {
      s.classList.add("active");
      s.querySelectorAll(".df-animate").forEach((el) => el.classList.add("in-view"));
      s.querySelectorAll(".df-fragment").forEach((el) => el.classList.add("visible"));
    });
  });

  await page.waitForTimeout(300);

  await page.pdf({
    path: outputPath,
    width: "1920px",
    height: "1080px",
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  await browser.close();
  await fs.remove(tmpHtml);
}

module.exports = { exportPDF };
