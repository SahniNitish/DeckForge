# DeckForge

**Remotion-style CLI framework for building presentations with code.**

Write slides as structured objects (or React components). Preview live in the browser. Export to **HTML**, **PDF**, and **PPTX** with a single command.

---

## Quick Start

```bash
# Install globally
npm install -g deckforge

# Scaffold a new project
deckforge create my-talk

# Start live preview
cd my-talk
npm install
npm run dev
# → opens at http://localhost:3000

# Export
npm run build:html   # Interactive HTML presentation
npm run build:pdf    # PDF slides
npm run build:pptx   # PowerPoint
npm run build:all    # All formats at once
```

---

## How It Works

Your entire presentation lives in a single `deck.config.js` file:

```js
module.exports = {
  meta: {
    title: "My Talk",
    author: "Jane Doe",
  },

  theme: "dark",  // minimal | dark | pitch | keynote

  slides: [
    {
      layout: "title",
      html: `<h1>Hello <span class="accent">World</span></h1>`,
      notes: "This is a speaker note",
      pptx: [
        { type: "title", text: "Hello World", align: "center" },
      ],
    },
    // ...more slides
  ],
};
```

### Slide Properties

| Property | Type | Description |
|----------|------|-------------|
| `layout` | string | `default` · `title` · `center` · `split` · `image-left` · `image-right` · `quote` |
| `html` | string | HTML content for the slide (used in HTML and PDF export) |
| `pptx` | array | Element array for PowerPoint export (see PPTX Elements below) |
| `background` | string | CSS background value or hex color |
| `notes` | string | Presenter notes |

### PPTX Elements

```js
pptx: [
  { type: "title", text: "Hello", fontSize: 40, align: "center" },
  { type: "subtitle", text: "World", y: "50%" },
  { type: "text", text: "Body text here", fontSize: 18 },
  { type: "bullet", items: ["Point 1", "Point 2", "Point 3"] },
  { type: "image", src: "https://example.com/photo.png", x: "10%", y: "15%", w: "80%", h: "70%" },
  { type: "code", text: "const x = 42;", fontSize: 14 },
  { type: "shape", shape: "RECTANGLE", x: 1, y: 1, w: 3, h: 2, fill: "#FF3366" },
]
```

---

## Themes

Four built-in themes, fully customizable:

| Theme | Style | Best For |
|-------|-------|----------|
| `minimal` | Clean, editorial, light | Technical talks, reports |
| `dark` | Sleek, modern, developer-friendly | Code-heavy presentations |
| `pitch` | Bold, high-energy gradients | Startup pitches, sales decks |
| `keynote` | Cinematic, dramatic, dark | Product launches, keynotes |

### Custom Themes

Extend any built-in theme:

```js
theme: {
  extends: "dark",
  colors: {
    accent: "#00FF88",
    bg: "#0D1117",
  },
  fonts: {
    heading: "'Clash Display', sans-serif",
  },
  transition: {
    type: "zoom",       // fade | slide-up | slide-left | zoom | cinematic | flip
    duration: "0.6s",
  },
},
```

---

## Animations

### Entrance Animations

Add CSS classes to elements inside `html`:

```html
<div class="df-animate df-anim-up df-delay-1">
  <p>I slide up with a delay</p>
</div>
```

| Class | Effect |
|-------|--------|
| `df-anim-fade` | Fade in |
| `df-anim-up` | Slide up |
| `df-anim-left` | Slide from right |
| `df-anim-scale` | Scale in |
| `df-anim-blur` | Blur in |

Stagger with `df-delay-1` through `df-delay-6`.

### Fragments

Reveal elements one-by-one on keypress:

```html
<ul>
  <li class="df-fragment">Revealed first</li>
  <li class="df-fragment">Revealed second</li>
  <li class="df-fragment">Revealed third</li>
</ul>
```

### Slide Transitions

Set globally via theme or per-presentation:

- `fade` — Simple opacity crossfade
- `slide-up` — Slides enter from below
- `slide-left` — Slides enter from right
- `zoom` — Scale + bounce effect
- `cinematic` — Scale + brightness shift
- `flip` — 3D perspective rotation

---

## Keyboard Shortcuts (HTML Preview)

| Key | Action |
|-----|--------|
| `→` `↓` `Space` `PageDown` | Next slide / fragment |
| `←` `↑` `PageUp` | Previous slide |
| `Home` | First slide |
| `End` | Last slide |
| `O` | Toggle slide overview grid |
| `N` | Toggle presenter notes |
| `F` | Toggle fullscreen |

Touch and click navigation also supported.

---

## CLI Reference

```
deckforge <command> [options]

Commands:
  dev          Start live preview server with hot reload
  export       Export presentation to HTML, PDF, or PPTX
  create       Scaffold a new presentation project

dev options:
  -p, --port <n>    Port number (default: 3000)
  -d, --deck <path> Path to deck config (default: ./deck.config.js)

export options:
  -f, --format <type>  html | pdf | pptx | all (required)
  -d, --deck <path>    Path to deck config (default: ./deck.config.js)
  -o, --output <path>  Output directory (default: ./dist)
  -t, --theme <name>   Override theme

create options:
  -t, --template <n>   minimal | pitch | keynote (default: minimal)
```

---

## Programmatic API

```js
const { renderHTML, exportPPTX, getTheme, mergeTheme } = require('deckforge');

// Generate HTML string
const html = renderHTML(myDeckConfig);

// Export to PPTX
await exportPPTX(myDeckConfig, './output.pptx');

// Work with themes
const custom = mergeTheme(getTheme('dark'), { colors: { accent: '#FF0' } });
```

---

## Architecture

```
deckforge/
├── bin/cli.js              # CLI entry point (commander)
├── src/
│   ├── index.js            # Public API exports
│   ├── core/
│   │   ├── theme-engine.js # Theme definitions + CSS variable generation
│   │   ├── transitions.js  # CSS animations and slide transitions
│   │   ├── html-renderer.js# Generates self-contained HTML presentations
│   │   ├── dev-server.js   # Express + WebSocket live preview
│   │   ├── exporter.js     # Export orchestrator (routes to format-specific exporters)
│   │   └── scaffolder.js   # Project scaffolding (deckforge create)
│   └── exporters/
│       ├── pptx-exporter.js# PptxGenJS-based PowerPoint export
│       └── pdf-exporter.js # Puppeteer-based PDF export
└── package.json
```

---

## License

MIT
