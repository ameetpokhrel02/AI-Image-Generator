# AI Image Generator

A modern, responsive AI image generation application built with React, TypeScript, and Tailwind CSS. Generate images from text prompts with multiple customization options.

## ✨ Features

- **Text-to-Image Generation** - Create images from natural language descriptions
- **Multiple Image Generation** - Generate 1, 3, or 4 images at once
- **Aspect Ratio Control** - Portrait, Square, or Landscape formats
- **Model Selection** - Choose between Standard, HD, and Genius models
- **Preference Settings** - Speed vs Quality optimization
- **Image History** - Save and view previously generated images
- **Download Support** - Download generated images directly
- **Responsive Design** - Works on all devices
- **Authentication System** - User login and signup functionality

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd AI-Image-Generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔑 API Setup for Better Image Generation

The app currently uses Unsplash Source as a fallback, but for **real AI-generated images**, you can set up free API keys:

### Option 1: Stability AI (Recommended)
**Free tier: 25 images per month**

1. Go to [https://platform.stability.ai/](https://platform.stability.ai/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Create a `.env` file in your project root:
   ```env
   REACT_APP_STABILITY_API_KEY=your_key_here
   ```

### Option 2: Hugging Face
**Free tier with rate limits**

1. Go to [https://huggingface.co/](https://huggingface.co/)
2. Sign up for a free account
3. Get your API key from settings
4. Add to your `.env` file:
   ```env
   REACT_APP_HUGGINGFACE_API_KEY=your_key_here
   ```

### Option 3: Environment Variables
Create a `.env` file in your project root:
```env
REACT_APP_STABILITY_API_KEY=your_stability_key_here
REACT_APP_HUGGINGFACE_API_KEY=your_huggingface_key_here
```

## 🎯 How to Use

### Basic Image Generation
1. **Enter a prompt** - Describe what you want to see (e.g., "a close up image of lion")
2. **Choose settings** - Select image count, aspect ratio, model, and preference
3. **Click Generate** - Wait for the AI to create your images
4. **View & Download** - Click images to view full-size, download individually

### Advanced Features
- **Multiple Images**: Generate 3 or 4 variations at once
- **Aspect Ratios**: Choose portrait (9:16), square (1:1), or landscape (16:9)
- **Model Selection**: Standard for quick generation, HD for better quality
- **Preferences**: Speed mode for quick results, Quality mode for better images

## 🛠️ Technology Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **State Management**: React Hooks + Context API
- **Authentication**: Custom auth system with localStorage

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🔒 Authentication

- **Login**: Email and password authentication
- **Signup**: User registration with validation
- **Protected Routes**: Main app requires authentication
- **Session Persistence**: Login state saved in localStorage

## 🎨 Customization

### Colors and Themes
The app uses a dark theme with purple accents. You can customize colors in:
- `src/index.css` - Global CSS variables
- Component files - Tailwind classes

### Adding New Models
To add new AI models, update the `generateImage` function in `ImageGenerator.tsx` and add your API configuration.

## 🚨 Troubleshooting

### Images Not Generating
1. Check your internet connection
2. Verify API keys are correctly set
3. Check browser console for error messages
4. Try refreshing the page

### API Rate Limits
- Stability AI: 25 free images per month
- Hugging Face: Rate limited on free tier
- Unsplash Source: No limits (fallback option)

### Performance Issues
- Use Speed mode for faster generation
- Reduce image count for quicker results
- Check browser console for errors

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the browser console for error messages
3. Ensure all dependencies are properly installed
4. Verify your API keys are correctly configured

## 🔮 Future Enhancements

- [ ] Real-time image generation progress
- [ ] More AI model options
- [ ] Image editing capabilities
- [ ] Batch processing
- [ ] Advanced prompt engineering tools
- [ ] Community gallery
- [ ] User image collections

---

**Happy Image Generating! 🎨✨**
