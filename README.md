# Pinterest-Style Image Viewer Tampermonkey Script

A powerful browser enhancement that transforms any webpage into a Pinterest-style image gallery, making image browsing more enjoyable and organized.

## 🖼️ Core Features

### Image Collection & Grid Layout
- Automatically collects images larger than 320x180 pixels from any webpage
- Excludes GIFs and already processed images
- Responsive grid layout that adapts to screen size:
  - 8 columns for screens > 1920px
  - 6 columns for screens 1600px-1919px
  - 4 columns for screens 1200px-1599px
  - 3 columns for screens 800px-1199px
  - 2 columns for screens 400px-799px
  - 1 column for screens < 400px
- Grid width adapts to 95% of browser width for optimal space usage

### 🎯 User Interface
- Adds an "IMG" button to the bottom-right corner of any webpage
- Full-screen overlay for image browsing
- Displays total image count
- Easy-to-use "XXX" close button

### 🔍 Image Preview Features
- Full-screen modal view for detailed image inspection
- Multiple navigation options:
  - Mouse wheel scrolling
  - Thumbnail sidebar navigation
- Smart thumbnail sidebar:
  - Shows all available images
  - Highlights current image
  - Auto-scrolls to keep current image centered

### 📱 Responsive Design
- Universal compatibility across all screen sizes
- Dynamic grid layout that adapts to browser width
- Fluid image sizing that maintains aspect ratios
- Optimized for both desktop and mobile viewing

### ✨ User Experience
- Smooth transitions and hover effects
- Multiple ways to close images:
  - Click outside the image
  - Press Escape key
  - Use close button
- Interactive thumbnail features:
  - Hover effects
  - Active state indication

## 🎯 Use Cases
- Browsing image-heavy websites
- Viewing multiple images in a clean, organized layout
- Quick image scanning without leaving the current page
- Enjoying a Pinterest-like experience on any website

## 🔧 Technical Details
- Runs automatically on any webpage
- Activates after page fully loads
- Compatible with all modern browsers through Tampermonkey
- Lightweight and non-intrusive
- Responsive design that adapts to browser width

## 🚀 Installation
1. Install Tampermonkey browser extension
2. Install this script
3. Visit any webpage and click the "IMG" button to start browsing images

This script enhances your web browsing experience by providing a beautiful, organized way to view and navigate through images on any website, with a layout that adapts perfectly to your screen size and browser width.
