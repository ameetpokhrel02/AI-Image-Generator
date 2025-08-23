# AI Creator Studio

A modern, responsive AI image and video generation application built with React, TypeScript, and Tailwind CSS. Generate images and videos from text prompts with multiple customization options.

## ✨ Features

### 🖼️ AI Image Generation
- **Text-to-Image**: Generate images from text descriptions
- **Multiple Models**: Support for various AI models (HD, Standard)
- **Aspect Ratios**: Portrait, Square, and Landscape options
- **Batch Generation**: Generate 1, 3, or 4 images at once
- **Quality Settings**: Speed vs Quality preferences
- **Style Selection**: Multiple artistic styles available
- **Smart Fallbacks**: Pollinations API + Unsplash + Picsum

### 🎬 AI Video Generation
- **Text-to-Video**: Create videos from text descriptions
- **Multiple Tabs**: From Image, From Text, and Template options
- **AI Models**: Director 1.0 and other advanced models
- **Video Styles**: Cinematic, Anime, Realistic, Artistic
- **Duration Control**: 5s, 10s, 15s, 30s options
- **Quality Options**: Standard, HD, 4K quality settings
- **Aspect Ratios**: 16:9, 9:16, 1:1 video formats

### 🔐 Authentication System
- User registration and login
- Protected routes
- Session persistence
- User profile management

### 📱 Modern UI/UX
- **DeepAI-inspired Design**: Professional dark theme interface
- **Glassmorphism Auth**: Beautiful login/signup pages
- **Responsive Layout**: Works on all device sizes
- **Tab Navigation**: Easy switching between Image and Video modes
- **Real-time Updates**: Live generation progress and results

### 💾 History & Management
- **Image History**: Track all generated images with prompts
- **Video History**: Store generated video metadata
- **Local Storage**: Persistent history across sessions
- **Download Support**: Easy download of generated content

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd AI-Image-Generator

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production
```bash
npm run build
npm run preview
```

## 🔧 API Configuration

### Image Generation APIs

#### Primary: Pollinations AI (Free)
- **No API key required**
- **Features**: Prompt-based generation, multiple aspect ratios
- **Usage**: Automatically used as primary service

#### Fallback 1: Unsplash Source (Free)
- **No API key required**
- **Features**: Keyword-based photo search
- **Usage**: Automatic fallback if Pollinations fails

#### Fallback 2: Picsum Photos (Free)
- **No API key required**
- **Features**: Prompt-seeded random images
- **Usage**: Final fallback for guaranteed results

### Video Generation APIs
Currently using simulated video generation. To integrate real video APIs:

1. **Runway ML** - Professional video generation
2. **Pika Labs** - AI video creation
3. **Stable Video Diffusion** - Open source video generation

## 📁 Project Structure

```
AI-Image-Generator/
├── src/
│   ├── auth/                    # Authentication system
│   │   ├── context/            # Auth context and hooks
│   │   ├── pages/              # Login and signup pages
│   │   └── routes.tsx          # Auth routing
│   ├── components/              # Main application components
│   │   ├── ImageGenerator.tsx  # AI image generation
│   │   ├── VideoGenerator.tsx  # AI video generation
│   │   ├── PromptHistory.tsx   # Image generation history
│   │   └── VideoHistory.tsx    # Video generation history
│   ├── App.tsx                 # Main application component
│   ├── main.tsx                # Application entry point
│   └── index.css               # Global styles
├── public/                      # Static assets
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## 🎯 How to Use

### Image Generation
1. **Navigate to Images Tab**: Click the "Images" tab in the header
2. **Enter Prompt**: Describe the image you want to generate
3. **Configure Settings**: Choose aspect ratio, number of images, quality
4. **Generate**: Click the generate button and wait for results
5. **Download**: Save your generated images

### Video Generation
1. **Navigate to Videos Tab**: Click the "Videos" tab in the header
2. **Select Model**: Choose from available AI models
3. **Enter Prompt**: Describe your video story
4. **Choose Style**: Select artistic style and settings
5. **Generate**: Create your AI video
6. **Manage**: View history and download videos

### Authentication
1. **Sign Up**: Create a new account
2. **Login**: Access your personalized workspace
3. **Protected Features**: All generation features require authentication
4. **Logout**: Secure session management

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Context API + Hooks
- **Build Tool**: Vite
- **Authentication**: Custom auth system with localStorage
- **Image APIs**: Pollinations, Unsplash, Picsum
- **Video APIs**: Simulated (ready for real API integration)

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Responsive grid layouts
- **Desktop Experience**: Full-featured desktop interface
- **Touch Friendly**: Mobile-optimized controls

## 🔒 Security Features

- **Protected Routes**: Authentication required for main features
- **Session Management**: Secure user session handling
- **Input Validation**: Form validation and sanitization
- **Safe Downloads**: Secure file download handling

## 🎨 Customization

### Themes
- **Dark Theme**: Professional dark interface
- **Color Schemes**: Purple and blue accent colors
- **Component Styling**: Consistent design language

### Layout Options
- **Grid Systems**: Responsive grid layouts
- **Flexbox**: Modern CSS layout techniques
- **Responsive Breakpoints**: Mobile-first approach

## 🐛 Troubleshooting

### Common Issues

#### Images Not Generating
1. **Check Internet**: Ensure stable internet connection
2. **API Status**: Verify API services are accessible
3. **Prompt Quality**: Use clear, descriptive prompts
4. **Fallback System**: Automatic fallbacks should provide results

#### Video Generation Issues
1. **Simulated Mode**: Currently using simulated generation
2. **API Integration**: Ready for real video API integration
3. **Browser Support**: Ensure modern browser compatibility

#### Authentication Problems
1. **Clear Storage**: Clear browser localStorage
2. **Session Expiry**: Re-login if session expired
3. **Browser Support**: Check browser compatibility

### Performance Tips
- **Prompt Quality**: Better prompts = better results
- **Batch Generation**: Generate multiple images for variety
- **History Management**: Clear old history for better performance

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🚀 Future Enhancements

### Planned Features
- **Real Video APIs**: Integration with actual video generation services
- **Advanced Models**: More AI models and capabilities
- **Batch Processing**: Queue-based generation system
- **Cloud Storage**: Save generated content to cloud
- **Social Features**: Share and collaborate on generations
- **API Management**: User API key management
- **Export Options**: Multiple file format support

### API Integrations
- **Stability AI**: Professional image generation
- **OpenAI DALL-E**: Advanced image creation
- **Midjourney**: Artistic image generation
- **Runway ML**: Professional video creation
- **Pika Labs**: AI video generation

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API configuration guide

## 🙏 Acknowledgments

- **Pollinations AI** for free image generation
- **Unsplash** for photo fallback service
- **Tailwind CSS** for the beautiful UI framework
- **React Team** for the amazing framework
- **Vite** for the fast build tool

---

**AI Creator Studio** - Transform your ideas into reality with AI-powered image and video generation! 🚀✨
