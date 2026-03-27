/**
 * DeckForge Project Scaffolder
 *
 * Creates a new presentation project with a starter deck config,
 * theme, and example slides.
 */

const path = require("path");
const fs = require("fs-extra");
const chalk = require("chalk");
const inquirer = require("inquirer");

async function createProject(name, template) {
  if (!name) {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "projectName",
        message: "Project name:",
        default: "my-deck",
      },
      {
        type: "list",
        name: "template",
        message: "Choose a template:",
        choices: [
          { name: "Minimal — Clean and simple", value: "minimal" },
          { name: "Pitch — Bold startup deck", value: "pitch" },
          { name: "Keynote — Cinematic dark theme", value: "keynote" },
        ],
      },
      {
        type: "list",
        name: "theme",
        message: "Theme:",
        choices: ["minimal", "dark", "pitch", "keynote"],
      },
    ]);
    name = answers.projectName;
    template = answers.template;
  }

  const projectDir = path.resolve(name);
  await fs.ensureDir(projectDir);
  await fs.ensureDir(path.join(projectDir, "assets"));

  // Generate deck.config.js
  const deckConfig = generateDeckConfig(template, name);
  await fs.writeFile(path.join(projectDir, "deck.config.js"), deckConfig, "utf-8");

  // Package.json
  const pkg = {
    name: name,
    version: "1.0.0",
    private: true,
    scripts: {
      dev: "deckforge dev",
      "build:html": "deckforge export --format html",
      "build:pdf": "deckforge export --format pdf",
      "build:pptx": "deckforge export --format pptx",
      "build:all": "deckforge export --format all",
    },
    dependencies: {
      deckforge: "^1.0.0",
    },
  };
  await fs.writeJson(path.join(projectDir, "package.json"), pkg, { spaces: 2 });

  // README
  const readme = `# ${name}

Built with [DeckForge](https://github.com/deckforge) — React-powered presentations.

## Commands

\`\`\`bash
npm run dev          # Live preview at localhost:3000
npm run build:html   # Export to interactive HTML
npm run build:pdf    # Export to PDF
npm run build:pptx   # Export to PowerPoint
npm run build:all    # Export all formats
\`\`\`

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| ← → / Space | Navigate slides |
| O | Slide overview |
| N | Toggle presenter notes |
| F | Fullscreen |

## Customization

Edit \`deck.config.js\` to modify slides, themes, and metadata.
`;
  await fs.writeFile(path.join(projectDir, "README.md"), readme, "utf-8");

  console.log("");
  console.log(chalk.green("  ✓ Project created: ") + chalk.white.bold(name));
  console.log("");
  console.log(chalk.gray("  Next steps:"));
  console.log(chalk.cyan(`    cd ${name}`));
  console.log(chalk.cyan("    npm install"));
  console.log(chalk.cyan("    npm run dev"));
  console.log("");
}

function generateDeckConfig(template, name) {
  const templates = {
    minimal: `/**
 * DeckForge Deck Configuration
 * Template: Minimal
 */

module.exports = {
  meta: {
    title: "${name}",
    author: "Your Name",
    description: "A DeckForge presentation",
    slug: "${name}",
    date: "${new Date().toISOString().split("T")[0]}",
    aspectRatio: "16:9",
  },

  theme: "minimal",  // "minimal" | "dark" | "pitch" | "keynote" | { extends: "minimal", colors: {...} }

  slides: [
    // ── Title Slide ──────────────────────────
    {
      layout: "title",
      html: \\\`
        <h1>Welcome to <span class="accent">${name}</span></h1>
        <p class="subtitle">Built with DeckForge</p>
      \\\`,
      notes: "Welcome everyone. This is the opening slide.",
      // PPTX elements (for PowerPoint export)
      pptx: [
        { type: "title", text: "Welcome to ${name}", y: "30%", align: "center" },
        { type: "subtitle", text: "Built with DeckForge", y: "50%", align: "center" },
      ],
    },

    // ── Content Slide ────────────────────────
    {
      layout: "default",
      html: \\\`
        <h2>What is DeckForge?</h2>
        <div class="df-animate df-anim-up df-delay-1">
          <p>A <strong>Remotion-style</strong> framework for presentations.</p>
        </div>
        <div class="df-animate df-anim-up df-delay-2">
          <p>Write your slides as code, export to HTML / PDF / PPTX.</p>
        </div>
        <div class="df-animate df-anim-up df-delay-3">
          <p>Themes, animations, and live preview included.</p>
        </div>
      \\\`,
      notes: "DeckForge lets you build presentations programmatically.",
      pptx: [
        { type: "title", text: "What is DeckForge?", fontSize: 32 },
        { type: "bullet", items: [
          "A Remotion-style framework for presentations",
          "Write your slides as code, export to HTML / PDF / PPTX",
          "Themes, animations, and live preview included",
        ], y: "35%" },
      ],
    },

    // ── Split Layout ─────────────────────────
    {
      layout: "split",
      html: \\\`
        <div>
          <h2>Features</h2>
          <ul>
            <li class="df-fragment">4 built-in themes</li>
            <li class="df-fragment">6 transition styles</li>
            <li class="df-fragment">Staggered animations</li>
            <li class="df-fragment">Presenter notes</li>
            <li class="df-fragment">Multi-format export</li>
          </ul>
        </div>
        <div>
          <pre><code>module.exports = {
  theme: "dark",
  slides: [
    {
      layout: "title",
      html: \\\\\\\`&lt;h1&gt;Hello&lt;/h1&gt;\\\\\\\`,
    }
  ]
}</code></pre>
        </div>
      \\\`,
      notes: "Here we show both the feature list and a code example.",
      pptx: [
        { type: "title", text: "Features", x: "5%", w: "40%", fontSize: 32 },
        { type: "bullet", items: [
          "4 built-in themes",
          "6 transition styles",
          "Staggered animations",
          "Presenter notes",
          "Multi-format export",
        ], x: "5%", y: "30%", w: "40%" },
        { type: "code", text: 'module.exports = {\\n  theme: "dark",\\n  slides: [...]\\n}', x: "52%", y: "20%", w: "44%", fontSize: 13 },
      ],
    },

    // ── Quote Slide ──────────────────────────
    {
      layout: "quote",
      html: \\\`
        <blockquote class="df-animate df-anim-blur">
          "The best presentations are built, not designed."
        </blockquote>
        <p class="muted df-animate df-anim-fade df-delay-2">— Every developer, probably</p>
      \\\`,
      pptx: [
        { type: "text", text: '"The best presentations are built, not designed."', y: "35%", fontSize: 28, align: "center" },
        { type: "subtitle", text: "— Every developer, probably", y: "55%", align: "center" },
      ],
    },

    // ── End Slide ────────────────────────────
    {
      layout: "center",
      html: \\\`
        <h1 class="big df-animate df-anim-scale">Thanks!</h1>
        <p class="subtitle df-animate df-anim-fade df-delay-2">Start building → <code>deckforge create</code></p>
      \\\`,
      pptx: [
        { type: "title", text: "Thanks!", y: "35%", fontSize: 60, align: "center" },
        { type: "subtitle", text: "Start building → deckforge create", y: "55%", align: "center" },
      ],
    },
  ],
};
`,

    pitch: `/**
 * DeckForge Deck Configuration
 * Template: Pitch Deck
 */

module.exports = {
  meta: {
    title: "${name}",
    author: "Your Name",
    description: "A pitch deck built with DeckForge",
    slug: "${name}",
  },

  theme: "pitch",

  slides: [
    {
      layout: "center",
      background: "linear-gradient(135deg, #FF3366 0%, #FF6B35 100%)",
      html: \\\`
        <h1 style="color: white" class="big df-animate df-anim-scale">${name}</h1>
        <p style="color: rgba(255,255,255,0.8)" class="subtitle df-animate df-anim-fade df-delay-2">The future of presentations</p>
      \\\`,
      pptx: [
        { type: "title", text: "${name}", y: "30%", fontSize: 54, align: "center", color: "FFFFFF" },
        { type: "subtitle", text: "The future of presentations", y: "52%", align: "center", color: "FFFFFF" },
      ],
    },
    {
      layout: "default",
      html: \\\`
        <h3 class="muted">THE PROBLEM</h3>
        <h1 class="df-animate df-anim-up">Presentations are <span class="accent">broken</span>.</h1>
        <p class="df-animate df-anim-up df-delay-2">Drag-and-drop tools are slow. Markdown tools are ugly. There has to be a better way.</p>
      \\\`,
      pptx: [
        { type: "text", text: "THE PROBLEM", y: "15%", fontSize: 16, color: "999999" },
        { type: "title", text: "Presentations are broken.", y: "28%", fontSize: 40 },
        { type: "text", text: "Drag-and-drop tools are slow. Markdown tools are ugly. There has to be a better way.", y: "50%", fontSize: 22 },
      ],
    },
    {
      layout: "default",
      html: \\\`
        <h3 class="muted">THE SOLUTION</h3>
        <h1 class="df-animate df-anim-up">Code your slides. <span class="accent">Ship everywhere.</span></h1>
        <div class="df-animate df-anim-up df-delay-2">
          <p>Write React components. Export to HTML, PDF, and PPTX with one command.</p>
        </div>
      \\\`,
      pptx: [
        { type: "text", text: "THE SOLUTION", y: "15%", fontSize: 16, color: "999999" },
        { type: "title", text: "Code your slides. Ship everywhere.", y: "28%", fontSize: 38 },
        { type: "text", text: "Write React components. Export to HTML, PDF, and PPTX with one command.", y: "52%", fontSize: 22 },
      ],
    },
    {
      layout: "center",
      html: \\\`
        <h1 class="big df-animate df-anim-scale" style="color: var(--df-accent)">Let's talk.</h1>
        <p class="subtitle df-animate df-anim-fade df-delay-2">you@email.com</p>
      \\\`,
      pptx: [
        { type: "title", text: "Let's talk.", y: "35%", fontSize: 54, align: "center", color: "FF3366" },
        { type: "subtitle", text: "you@email.com", y: "55%", align: "center" },
      ],
    },
  ],
};
`,

    keynote: `/**
 * DeckForge Deck Configuration
 * Template: Keynote
 */

module.exports = {
  meta: {
    title: "${name}",
    author: "Your Name",
    description: "A keynote presentation",
    slug: "${name}",
  },

  theme: "keynote",

  slides: [
    {
      layout: "center",
      html: \\\`
        <h1 class="big df-animate df-anim-blur" style="background: linear-gradient(135deg, #0A84FF, #5E5CE6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${name}</h1>
      \\\`,
      pptx: [
        { type: "title", text: "${name}", y: "38%", fontSize: 60, align: "center", color: "0A84FF" },
      ],
    },
    {
      layout: "default",
      html: \\\`
        <p class="muted">Introducing</p>
        <h1 class="df-animate df-anim-up">Something <span class="accent">incredible</span>.</h1>
      \\\`,
      pptx: [
        { type: "text", text: "Introducing", y: "25%", fontSize: 18, color: "8E8E93" },
        { type: "title", text: "Something incredible.", y: "38%", fontSize: 44 },
      ],
    },
    {
      layout: "center",
      html: \\\`
        <h1 class="big df-animate df-anim-scale">One more thing...</h1>
      \\\`,
      pptx: [
        { type: "title", text: "One more thing...", y: "40%", fontSize: 50, align: "center" },
      ],
    },
  ],
};
`,
  };

  return templates[template] || templates.minimal;
}

module.exports = { createProject };
