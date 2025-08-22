// API Configuration for AI Image Generation Services
// Get free API keys from these services:

export const API_CONFIG = {
  // Stability AI (Stable Diffusion) - Free tier available
  // Sign up at: https://platform.stability.ai/
  STABILITY_API_KEY: process.env.REACT_APP_STABILITY_API_KEY || 'YOUR_STABILITY_API_KEY',
  
  // Hugging Face - Free tier available
  // Sign up at: https://huggingface.co/
  HUGGINGFACE_API_KEY: process.env.REACT_APP_HUGGINGFACE_API_KEY || 'YOUR_HUGGINGFACE_API_KEY',
  
  // Alternative: Use environment variables
  // Create a .env file in your project root with:
  // REACT_APP_STABILITY_API_KEY=your_key_here
  // REACT_APP_HUGGINGFACE_API_KEY=your_key_here
};

// Free API Services you can use:
export const FREE_APIS = {
  STABILITY: {
    name: 'Stability AI',
    url: 'https://platform.stability.ai/',
    description: 'Free tier with 25 images per month',
    features: ['High quality', 'Fast generation', 'Multiple models']
  },
  HUGGINGFACE: {
    name: 'Hugging Face',
    url: 'https://huggingface.co/',
    description: 'Free tier with rate limits',
    features: ['Open source models', 'Community models', 'Free to start']
  },
  UNSPLASH: {
    name: 'Unsplash Source',
    url: 'https://source.unsplash.com/',
    description: 'Free photo search by keywords',
    features: ['No API key needed', 'Real photos', 'Keyword-based search']
  }
};

export default API_CONFIG;
