#!/usr/bin/env node

const { Command } = require("commander");
const chalk = require("chalk");
const path = require("path");
const pkg = require("../package.json");

const { devServer } = require("../src/core/dev-server");
const { exportPresentation } = require("../src/core/exporter");
const { createProject } = require("../src/core/scaffolder");

const logo = `
  ╔══════════════════════════════════════╗
  ║                                      ║
  ║   ▄▀▀▄ ▄▀▀▄ ▄▀▀▀ ▄▀▀▄ ▄ ▄▀▀▄      ║
  ║   █  █ █▄▄  █    █▀▀  █▄ █▄▄▀      ║
  ║   ▀▄▄▀ ▀▄▄▀ ▀▄▄▄ ▀  ▀ ▀  ▀▄▄▀     ║
  ║        D E C K F O R G E             ║
  ║   React-Powered Presentations        ║
  ║                                      ║
  ╚══════════════════════════════════════╝
`;

const program = new Command();

program
  .name("deckforge")
  .description(chalk.cyan("Remotion-style presentation framework — React components → HTML / PDF / PPTX"))
  .version(pkg.version);

// ── dev: live preview server ──────────────────────────────
program
  .command("dev")
  .description("Start live preview server with hot reload")
  .option("-p, --port <number>", "Port number", "3000")
  .option("-d, --deck <path>", "Path to deck config", "./deck.config.js")
  .action(async (opts) => {
    console.log(chalk.magenta(logo));
    console.log(chalk.green("  ▸ Starting dev server...\n"));
    await devServer({
      port: parseInt(opts.port),
      deckConfig: path.resolve(opts.deck),
    });
  });

// ── export: render to HTML / PDF / PPTX ──────────────────
program
  .command("export")
  .description("Export presentation to HTML, PDF, or PPTX")
  .requiredOption("-f, --format <type>", "Output format: html | pdf | pptx | all")
  .option("-d, --deck <path>", "Path to deck config", "./deck.config.js")
  .option("-o, --output <path>", "Output directory", "./dist")
  .option("-t, --theme <name>", "Override theme")
  .action(async (opts) => {
    console.log(chalk.magenta(logo));
    const formats = opts.format === "all" ? ["html", "pdf", "pptx"] : [opts.format];
    for (const fmt of formats) {
      console.log(chalk.yellow(`  ▸ Exporting ${fmt.toUpperCase()}...`));
      await exportPresentation({
        format: fmt,
        deckConfig: path.resolve(opts.deck),
        outputDir: path.resolve(opts.output),
        themeOverride: opts.theme,
      });
      console.log(chalk.green(`  ✓ ${fmt.toUpperCase()} exported to ${opts.output}/\n`));
    }
  });

// ── create: scaffold a new project ───────────────────────
program
  .command("create [name]")
  .description("Scaffold a new DeckForge presentation project")
  .option("-t, --template <name>", "Template: minimal | pitch | keynote", "minimal")
  .action(async (name, opts) => {
    console.log(chalk.magenta(logo));
    await createProject(name, opts.template);
  });

program.parse();
