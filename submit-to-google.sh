#!/bin/bash
# Submit to Google for indexing

echo "Submitting to search engines..."

# Google Search Console
curl -X GET "https://www.google.com/ping?sitemap=https://comperpro.github.io/.red/sitemap.xml"

# Bing
curl -X GET "https://www.bing.com/ping?sitemap=https://comperpro.github.io/.red/sitemap.xml"

# Submit individual pages
curl -X GET "https://www.google.com/ping?sitemap=https://comperpro.github.io/.red/"
curl -X GET "https://www.google.com/ping?sitemap=https://comperpro.github.io/.red/comps-red-public.html"
curl -X GET "https://www.google.com/ping?sitemap=https://comperpro.github.io/.red/install.html"

echo "✅ Submitted to search engines"