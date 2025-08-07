#!/bin/bash

# COMPS.RED Quick Deploy Script
# After creating your GitHub account and repository, run this script

echo "🎴 COMPS.RED Quick Deploy"
echo "========================"
echo ""
echo "Enter your GitHub username:"
read GITHUB_USERNAME

echo ""
echo "Setting up git remote..."
git remote add origin https://github.com/$GITHUB_USERNAME/comps-red.git 2>/dev/null || git remote set-url origin https://github.com/$GITHUB_USERNAME/comps-red.git

echo "Pushing to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✅ Code pushed to GitHub!"
echo ""
echo "🎯 FINAL STEPS:"
echo "1. Go to: https://github.com/$GITHUB_USERNAME/comps-red/settings/pages"
echo "2. Under 'Source', select 'Deploy from a branch'"
echo "3. Under 'Branch', select 'main' and '/ (root)'"
echo "4. Click 'Save'"
echo ""
echo "🔗 Your site will be live at:"
echo "https://$GITHUB_USERNAME.github.io/comps-red/"
echo ""
echo "🎴 Message for Dawson & Marc is embedded and ready!"
echo ""
echo "Opening your repository settings now..."
open "https://github.com/$GITHUB_USERNAME/comps-red/settings/pages"