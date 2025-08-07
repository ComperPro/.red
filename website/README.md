# COMPS.RED Website

High-performance landing page for the COMPS.RED Chrome extension.

## Features
- ⚡ Lightning fast load times (<2s)
- 📱 Fully responsive design
- 🎨 Modern, clean UI
- 🚀 Optimized for Core Web Vitals
- 🔍 SEO optimized
- ♿ Accessible (WCAG 2.1 AA)

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Deploy to Netlify
npm run deploy:netlify

# Deploy to Vercel
vercel

# Deploy to Surge
npm run deploy
```

## Performance

- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1
- **Lighthouse Score**: 95+

## Deployment Options

### Netlify (Recommended)
1. Connect GitHub repo to Netlify
2. Auto-deploys on push to main
3. Custom domain: comps.red

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts

### GitHub Pages
1. Build: `npm run build`
2. Push dist/ to gh-pages branch
3. Enable GitHub Pages

## Structure

```
website/
├── index.html      # Main HTML
├── styles.css      # Optimized CSS
├── app.js          # Performance JS
├── package.json    # Dependencies
├── netlify.toml    # Netlify config
├── vercel.json     # Vercel config
└── dist/           # Production build
```

## Optimizations

- Lazy loading images
- CSS/JS minification
- Image compression
- Browser caching
- CDN delivery
- Gzip compression
- Prefetch critical resources

## Browser Support

- Chrome 90+
- Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers