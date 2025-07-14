# AI Image Generator

A modern, responsive web app to generate AI images from text prompts. Built with React, TypeScript, and Tailwind CSS.

## Features
- Generate AI images from your own prompts
- **Multiple images:** Select 1–5 images per prompt (simulated using random seeds)
- **Instant aspect ratio switching:** Change between Square, Portrait, and Landscape after generation—no new API call needed
- Glassmorphic, mobile-friendly UI
- Prompt history with thumbnails and download buttons
- View images in a modal (lightbox) with direct download and aspect ratio sync
- Free and (future) Premium modes
- Responsive layout for desktop and mobile
- Error handling and loading spinner during generation

## How Multiple Images Work
The Pollinations API only supports generating one image per request. This app simulates multiple images by making several requests with different random seeds, so you get a unique image for each slot.

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm

### Installation
```bash
npm install
```

### Running the App
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production
```bash
npm run build
```

## Usage
1. Start the app and click **Use for Free** on the landing page.
2. Enter a prompt (e.g., "A futuristic city at sunset"), select the number of images and aspect ratio, and click **Generate**.
3. Wait for the image(s) to generate (a spinner and message will show while loading).
4. Instantly switch aspect ratio (Square, Portrait, Landscape) after generation—no need to re-generate.
5. Click any image to view it larger in a modal, or click **Download** to save it.
6. View your prompt history and download previous images.

## Premium Mode
Premium Mode is coming soon! It will offer higher quality, faster images, and more features.

## Credits
- Built with [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/), and [Tailwind CSS](https://tailwindcss.com/)
- Image generation powered by [Pollinations API](https://image.pollinations.ai/)

---

Feel free to fork, clone, modify, and use this project for your own AI image generation needs!
