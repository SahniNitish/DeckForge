/**
 * DeckForge PPTX Exporter
 *
 * Converts slides into PowerPoint format using PptxGenJS.
 * Maps theme colors/fonts to PPTX master slides.
 */

const PptxGenJS = require("pptxgenjs");
const { getTheme, mergeTheme } = require("./theme-engine");

function hexToRGB(hex) {
  return hex.replace("#", "");
}

async function exportPPTX(deckConfig, outputPath) {
  const theme = deckConfig.theme
    ? typeof deckConfig.theme === "string"
      ? getTheme(deckConfig.theme)
      : mergeTheme(getTheme(deckConfig.theme.extends || "minimal"), deckConfig.theme)
    : getTheme("minimal");

  const pptx = new PptxGenJS();
  const meta = deckConfig.meta || {};

  pptx.author = meta.author || "DeckForge";
  pptx.title = meta.title || "Presentation";
  pptx.subject = meta.description || "";
  pptx.layout = "LAYOUT_WIDE"; // 16:9

  // Define master slide with theme
  pptx.defineSlideMaster({
    title: "DECKFORGE_MASTER",
    background: { color: hexToRGB(theme.colors.bg) },
    objects: [
      // Progress bar at bottom
      {
        rect: {
          x: 0, y: "95%", w: "100%", h: "0.05",
          fill: { color: hexToRGB(theme.colors.accent) },
        },
      },
    ],
  });

  const slides = deckConfig.slides || [];

  for (const slide of slides) {
    const pptSlide = pptx.addSlide({ masterName: "DECKFORGE_MASTER" });

    // Custom background per-slide
    if (slide.background) {
      if (slide.background.startsWith("http")) {
        pptSlide.background = { path: slide.background };
      } else {
        pptSlide.background = { color: hexToRGB(slide.background) };
      }
    }

    // Convert pptx-specific content
    const elements = slide.pptx || slide.elements || [];

    for (const el of elements) {
      switch (el.type) {
        case "title":
          pptSlide.addText(el.text, {
            x: el.x || "5%",
            y: el.y || "15%",
            w: el.w || "90%",
            fontSize: el.fontSize || 40,
            fontFace: theme.fonts.heading.split(",")[0].replace(/'/g, ""),
            color: hexToRGB(el.color || theme.colors.fg),
            bold: true,
            align: el.align || "left",
          });
          break;

        case "subtitle":
          pptSlide.addText(el.text, {
            x: el.x || "5%",
            y: el.y || "40%",
            w: el.w || "90%",
            fontSize: el.fontSize || 24,
            fontFace: theme.fonts.body.split(",")[0].replace(/'/g, ""),
            color: hexToRGB(el.color || theme.colors.muted),
            align: el.align || "left",
          });
          break;

        case "text":
          pptSlide.addText(el.text, {
            x: el.x || "5%",
            y: el.y || "20%",
            w: el.w || "90%",
            h: el.h,
            fontSize: el.fontSize || 18,
            fontFace: theme.fonts.body.split(",")[0].replace(/'/g, ""),
            color: hexToRGB(el.color || theme.colors.fg),
            align: el.align || "left",
            lineSpacing: el.lineSpacing || 28,
          });
          break;

        case "bullet":
          pptSlide.addText(
            el.items.map((item) => ({
              text: item,
              options: {
                bullet: true,
                fontSize: el.fontSize || 20,
                color: hexToRGB(el.color || theme.colors.fg),
              },
            })),
            {
              x: el.x || "5%",
              y: el.y || "25%",
              w: el.w || "90%",
              fontFace: theme.fonts.body.split(",")[0].replace(/'/g, ""),
              lineSpacing: el.lineSpacing || 32,
            }
          );
          break;

        case "image":
          const imgOpts = {
            x: el.x || "10%",
            y: el.y || "15%",
            w: el.w || "80%",
            h: el.h || "70%",
          };
          if (el.src.startsWith("http")) {
            imgOpts.path = el.src;
          } else {
            imgOpts.path = el.src;
          }
          pptSlide.addImage(imgOpts);
          break;

        case "code":
          pptSlide.addText(el.text, {
            x: el.x || "5%",
            y: el.y || "20%",
            w: el.w || "90%",
            fontSize: el.fontSize || 14,
            fontFace: theme.fonts.code.split(",")[0].replace(/'/g, ""),
            color: hexToRGB(theme.colors.fg),
            fill: { color: hexToRGB(theme.colors.codeBackground) },
            lineSpacing: 22,
          });
          break;

        case "shape":
          pptSlide.addShape(pptx.shapes[el.shape || "RECTANGLE"], {
            x: el.x, y: el.y, w: el.w, h: el.h,
            fill: { color: hexToRGB(el.fill || theme.colors.accent) },
            line: el.line ? { color: hexToRGB(el.line), width: el.lineWidth || 1 } : undefined,
          });
          break;

        default:
          // Treat unknown as text
          if (el.text) {
            pptSlide.addText(el.text, {
              x: el.x || "5%", y: el.y || "20%", w: el.w || "90%",
              fontSize: 18,
              fontFace: theme.fonts.body.split(",")[0].replace(/'/g, ""),
              color: hexToRGB(theme.colors.fg),
            });
          }
      }
    }

    // Add notes
    if (slide.notes) {
      pptSlide.addNotes(slide.notes);
    }
  }

  await pptx.writeFile({ fileName: outputPath });
}

module.exports = { exportPPTX };
