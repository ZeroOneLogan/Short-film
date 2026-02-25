# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

This is a zero-dependency, vanilla HTML5/CSS3/JavaScript animated silent film ("The Bus Stop Adventure"). There is no build system, no package manager, no test framework, and no backend.

### Running the dev server

Serve static files with Python's built-in HTTP server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in a browser. Click **Play** to start the ~45-second animation.

### Key caveats

- There are no installable dependencies — no `package.json`, `requirements.txt`, or similar.
- There is no lint, test, or build step. The project consists of 3 source files (`index.html`, `styles.css`, `animation.js`).
- The animation uses HTML5 Canvas 2D API with `roundRect` and `ellipse`, which require a modern browser (Chrome 99+). The code includes fallbacks for older browsers.
- All animation logic is in `animation.js`. The entry point is `index.html`.
