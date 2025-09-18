# SDG Test Landing

Minimal build for a landing page: HTML, SCSS, Vanilla JS.  
Built with Gulp 4 and BrowserSync for live reload.

## 📂 Project structure

```
project/
├─ src/                # source files
│  ├─ index.html
│  ├─ scss/            # styles (style.scss — main entry)
│  ├─ js/              # scripts (main.js — main entry)
│  ├─ fonts/           # fonts
│  └─ images/          # images
├─ dist/               # build output
├─ gulpfile.js
├─ package.json
└─ README.md
```

## 🚀 Requirements

- Node.js >= 18
- npm >= 9

## ⚙️ Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd <repo-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## 🖥️ Development

Start dev server with live reload and sourcemaps:
```bash
npm run dev
```
The site will be available at:
```
http://localhost:3000
```

## 📦 Production build

Minified HTML, CSS, and JS, copied fonts and images:
```bash
npm run build
```
Output will be in the `dist/` folder.

## 🧹 Clean

Remove the `dist` folder:
```bash
npm run clean
```

## 🔑 Features

- SCSS compiled into a single `style.css` (`src/scss/style.scss` → `dist/assets/css/style.css`).
- JS compiled and minified into a single `main.js` (`src/js/main.js` → `dist/assets/js/main.js`).
- Autoprefixing (`autoprefixer`) and CSS minification (`cssnano`) enabled in production mode.
- Images and fonts copied as-is into `dist/assets/images/` and `dist/assets/fonts/`.
- BrowserSync auto-reloads the page on source file changes.  