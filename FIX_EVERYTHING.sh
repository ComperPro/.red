#!/bin/bash
echo "Fixing everything..."

# Fix GitHub Pages by creating docs folder
mkdir -p docs
cp -r *.html *.js *.css docs/ 2>/dev/null
cp -r comps-red-website docs/ 2>/dev/null
cp -r icons docs/ 2>/dev/null
cp -r utils docs/ 2>/dev/null
cp -r core docs/ 2>/dev/null
cp -r decks docs/ 2>/dev/null

# Create GitHub Pages config
echo "comperpro.github.io" > docs/CNAME

# Push everything
git add .
git commit -m "Fix GitHub Pages deployment - use docs folder"
git push -f origin main

# Open everything
open https://comperpro.github.io/.red/
open chrome://extensions/

echo "✅ Done. If site doesn't work:"
echo "1. Go to: https://github.com/ComperPro/.red/settings/pages"
echo "2. Set Source: Deploy from branch"
echo "3. Set Branch: main"
echo "4. Set Folder: /docs"
echo "5. Click Save"