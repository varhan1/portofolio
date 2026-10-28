# Varhan Fiqih Naufaldy — Portfolio

A modern, dark-futuristic personal portfolio website built with HTML5, CSS3, Vanilla JavaScript, and Three.js.

## 🚀 Tech Stack

- **HTML5** — Semantic structure
- **CSS3** — Custom properties, Grid, Flexbox, animations
- **Vanilla JavaScript** — ES modules, IntersectionObserver, DOM manipulation
- **Three.js** — WebGL particle system and floating geometry
- **Vite** — Fast development server and build tool
- **Google Fonts** — Inter & JetBrains Mono

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm (comes with Node.js)

### Installation

```bash
# 1. Navigate to the project directory
cd portfolio

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The site will open at `http://localhost:3000`.

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
portfolio/
├── index.html              # Main HTML file
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── src/
│   ├── main.js             # App initialization and interactions
│   ├── three-scene.js      # Three.js hero scene (particles + geometry)
│   ├── style.css           # Complete stylesheet
│   ├── components/         # (Future component modules)
│   └── data/               # (Future data modules)
├── public/
│   ├── images/             # Static images (profile photo, project screenshots)
│   └── cv/                 # CV/resume PDF file
└── README.md
```

## ✏️ Customization Guide

### Personal Information

1. **Contact details**: Update email, LinkedIn, and GitHub links in the Contact section of `index.html`
2. **CV download**: Place your CV file in `public/cv/` and update the download link in the Hero section
3. **Profile photo**: Add your photo to `public/images/` and update the Hero section
4. **Project links**: Add your actual GitHub repository URLs to the project cards

### Content Updates

All content is in `index.html`. Update text directly in the HTML:
- Hero section headline and description
- About Me paragraphs
- Experience descriptions and dates
- Project descriptions and technologies
- Education details

### Styling

All styles are in `src/style.css`. Key customization points:
- CSS custom properties at the top (`:root`) for colors, fonts, spacing
- Section-specific styles are clearly labeled with comments

### Three.js Scene

The 3D scene is in `src/three-scene.js`. You can adjust:
- Particle count, colors, and spread
- Floating geometry types and count
- Animation speeds
- Mouse interaction sensitivity

## 📋 Notes

- The contact form is **frontend-only** (no backend). Connect to a service like Formspree, EmailJS, or your own API.
- Project repository links are placeholders — update with your actual URLs.
- The CV download button is a placeholder — add your CV PDF to `public/cv/`.
- All animations respect `prefers-reduced-motion` for accessibility.
- The Three.js scene gracefully falls back to a CSS gradient if WebGL is unavailable.

## 📄 License

© Varhan Fiqih Naufaldy. All rights reserved.
