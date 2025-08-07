# COMPS.RED Website

## Quick Deploy Options

### Option 1: Netlify (Recommended - Easiest)
1. Go to [netlify.com](https://netlify.com)
2. Sign up/login with GitHub
3. Drag and drop this `comps-red-website` folder onto the Netlify dashboard
4. Your site will be live in 30 seconds at a URL like `amazing-site-123.netlify.app`
5. Optional: Add custom domain `comps.red` in Netlify settings

### Option 2: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in this directory
3. Follow the prompts
4. Your site will be live immediately

### Option 3: GitHub Pages
1. Create a new GitHub repository
2. Upload all files from this folder
3. Go to Settings → Pages
4. Select "Deploy from branch" → main → root
5. Your site will be live at `yourusername.github.io/repo-name`

### Option 4: Traditional Hosting
Upload all files to any web host (GoDaddy, Bluehost, etc.) via FTP

## File Structure
- `index.html` - Main landing page
- `property-demo.html` - Example property analysis page
- `styles.css` - Main styles
- `app.js` - Interactive features
- `netlify.toml` - Netlify configuration
- `vercel.json` - Vercel configuration

## Custom Domain Setup
1. Buy `comps.red` domain (or use existing)
2. Point DNS to your hosting provider:
   - Netlify: Follow their custom domain guide
   - Vercel: Add domain in project settings
   - GitHub Pages: Add CNAME file with your domain

## Next Steps
1. Connect to Chrome extension to auto-generate property pages
2. Add database to store property analyses
3. Implement user accounts for saving analyses
4. Add SEO for each property page to rank on Google

## The Mission
Every deployment helps democratize real estate data and saves people from paying ridiculous 6% commissions.