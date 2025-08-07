#!/bin/bash

# This script creates placeholder icon files
# In production, you should generate proper PNG files from the SVG

echo "Creating placeholder icon files..."

# Create a simple blue square as base64 PNG for each size
# This is a 1x1 blue pixel PNG stretched to different sizes

# Base64 encoded 1x1 blue PNG
BLUE_PIXEL="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="

# Create placeholder files
echo $BLUE_PIXEL | base64 -d > icon16.png
echo $BLUE_PIXEL | base64 -d > icon32.png
echo $BLUE_PIXEL | base64 -d > icon48.png
echo $BLUE_PIXEL | base64 -d > icon128.png

echo "Placeholder icons created. Please generate proper icons from icon.svg or generate-icons.html"