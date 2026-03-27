/**
 * DeckForge Dev Server
 *
 * Express + WebSocket server that:
 * 1. Serves the rendered HTML presentation
 * 2. Watches the deck config for changes
 * 3. Hot-reloads the browser on save
 */

const express = require("express");
const { WebSocketServer } = require("ws");
const http = require("http");
const chokidar = require("chokidar");
const path = require("path");
const chalk = require("chalk");
const { renderHTML } = require("./html-renderer");

async function devServer({ port, deckConfig }) {
  const app = express();
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });

  let currentHTML = "";

  function rebuild() {
    try {
      // Clear require cache so changes are picked up
      delete require.cache[require.resolve(deckConfig)];
      // Also clear any modules the config might require
      Object.keys(require.cache).forEach((key) => {
        if (key.includes(path.dirname(deckConfig))) {
          delete require.cache[key];
        }
      });

      const config = require(deckConfig);
      currentHTML = renderHTML(config);

      // Inject hot-reload client script
      const hotReloadScript = `
        <script>
          (function() {
            const ws = new WebSocket('ws://' + location.host);
            ws.onmessage = function(e) {
              if (e.data === 'reload') location.reload();
            };
            ws.onclose = function() {
              setTimeout(() => location.reload(), 1000);
            };
          })();
        </script>
      `;
      currentHTML = currentHTML.replace("</body>", hotReloadScript + "</body>");

      console.log(chalk.green("  ✓ Deck rebuilt successfully"));
      return true;
    } catch (err) {
      console.error(chalk.red("  ✗ Build error:"), err.message);
      return false;
    }
  }

  // Initial build
  rebuild();

  // Serve the presentation
  app.get("/", (req, res) => {
    res.type("html").send(currentHTML);
  });

  // Watch for file changes
  const watchDir = path.dirname(deckConfig);
  const watcher = chokidar.watch(watchDir, {
    ignored: /node_modules|\.git|dist/,
    persistent: true,
    ignoreInitial: true,
  });

  watcher.on("change", (filePath) => {
    console.log(chalk.yellow(`  ↻ Changed: ${path.relative(watchDir, filePath)}`));
    if (rebuild()) {
      // Notify all connected browsers
      wss.clients.forEach((client) => {
        if (client.readyState === 1) client.send("reload");
      });
    }
  });

  // Start
  server.listen(port, () => {
    console.log("");
    console.log(chalk.cyan("  ┌─────────────────────────────────────────┐"));
    console.log(chalk.cyan("  │                                         │"));
    console.log(chalk.cyan("  │  ") + chalk.white.bold("DeckForge Dev Server") + chalk.cyan("                 │"));
    console.log(chalk.cyan("  │                                         │"));
    console.log(chalk.cyan("  │  ") + chalk.green(`http://localhost:${port}`) + chalk.cyan("                │"));
    console.log(chalk.cyan("  │                                         │"));
    console.log(chalk.cyan("  │  ") + chalk.gray("Shortcuts:") + chalk.cyan("                         │"));
    console.log(chalk.cyan("  │  ") + chalk.gray("  ← → / Space    Navigate") + chalk.cyan("         │"));
    console.log(chalk.cyan("  │  ") + chalk.gray("  O              Overview") + chalk.cyan("          │"));
    console.log(chalk.cyan("  │  ") + chalk.gray("  N              Notes") + chalk.cyan("             │"));
    console.log(chalk.cyan("  │  ") + chalk.gray("  F              Fullscreen") + chalk.cyan("        │"));
    console.log(chalk.cyan("  │                                         │"));
    console.log(chalk.cyan("  └─────────────────────────────────────────┘"));
    console.log("");
  });
}

module.exports = { devServer };
