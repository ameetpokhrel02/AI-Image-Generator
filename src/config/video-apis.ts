// Video Generation API Configuration
// Free APIs similar to Fotor's AI video generator

export const VIDEO_API_CONFIG = {
  // Primary: Fotor-style free video generation service
  PRIMARY: {
    name: 'Fotor AI Video Generator',
    baseUrl: 'https://api.fotor.com/v1/video/generate',
    apiKey: process.env.REACT_APP_FOTOR_API_KEY || 'FREE_TIER',
    features: ['Text-to-Video', 'Style Transfer', 'Duration Control'],
    limits: '5 videos per day (free tier)',
    pricing: 'Free with limitations'
  },

  // Alternative free video generation services
  ALTERNATIVES: [
    {
      name: 'Runway ML',
      baseUrl: 'https://api.runwayml.com/v1/video',
      apiKey: process.env.REACT_APP_RUNWAY_API_KEY || 'FREE_TIER',
      features: ['Gen-2', 'Motion Brush', 'Camera Controls'],
      limits: '625 credits/month (free)',
      pricing: 'Free tier available'
    },
    {
      name: 'Pika Labs',
      baseUrl: 'https://api.pika.art/v1/video',
      apiKey: process.env.REACT_APP_PIKA_API_KEY || 'FREE_TIER',
      features: ['Text-to-Video', 'Image-to-Video', 'Video-to-Video'],
      limits: '100 videos/month (free)',
      pricing: 'Free tier available'
    },
    {
      name: 'Stable Video Diffusion',
      baseUrl: 'https://api.stability.ai/v1/generation/stable-video-diffusion',
      apiKey: process.env.REACT_APP_STABILITY_VIDEO_API_KEY || 'FREE_TIER',
      features: ['Open Source', 'Custom Models', 'High Quality'],
      limits: '25 videos/month (free)',
      pricing: 'Free tier available'
    },
    {
      name: 'Luma AI',
      baseUrl: 'https://api.lumalabs.ai/v1/videos',
      apiKey: process.env.REACT_APP_LUMA_API_KEY || 'FREE_TIER',
      features: ['Dream Machine', 'Realistic Videos', 'Style Control'],
      limits: '10 videos/month (free)',
      pricing: 'Free tier available'
    }
  ],

  // Demo videos for testing (when APIs are not available)
  DEMO_VIDEOS: [
    {
      name: 'Sample Video 1',
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      duration: '10s',
      quality: 'HD',
      description: 'Sample video for testing purposes'
    },
    {
      name: 'Big Buck Bunny',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      duration: '30s',
      quality: 'HD',
      description: 'Open source animated short film'
    },
    {
      name: 'Elephants Dream',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      duration: '15s',
      quality: 'HD',
      description: 'First open movie project'
    },
    {
      name: 'For Bigger Blazes',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      duration: '20s',
      quality: 'HD',
      description: 'Sample video for testing'
    }
  ],

  // Video generation settings
  SETTINGS: {
    durations: ['5s', '10s', '15s', '30s'] as const,
    qualities: ['standard', 'hd', '4k'] as const,
    aspectRatios: ['16:9', '9:16', '1:1'] as const,
    styles: ['no-style', 'cinematic', 'anime', 'realistic', 'artistic'] as const
  },

  // API endpoints for different services
  ENDPOINTS: {
    fotor: {
      generate: '/v1/video/generate',
      status: '/v1/video/status',
      download: '/v1/video/download'
    },
    runway: {
      generate: '/v1/video/generations',
      status: '/v1/video/generations/{id}',
      download: '/v1/video/generations/{id}/download'
    },
    pika: {
      generate: '/v1/video/create',
      status: '/v1/video/status',
      download: '/v1/video/download'
    }
  }
};

// Helper function to get API configuration
export const getVideoAPIConfig = (serviceName: string) => {
  if (serviceName === 'fotor') {
    return VIDEO_API_CONFIG.PRIMARY;
  }
  return VIDEO_API_CONFIG.ALTERNATIVES.find(alt => 
    alt.name.toLowerCase().includes(serviceName.toLowerCase())
  );
};

// Helper function to get demo video based on prompt
export const getDemoVideo = (prompt: string) => {
  const promptHash = prompt.toLowerCase().split('').reduce((a: number, b: string) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const videoIndex = Math.abs(promptHash) % VIDEO_API_CONFIG.DEMO_VIDEOS.length;
  return VIDEO_API_CONFIG.DEMO_VIDEOS[videoIndex];
};

export default VIDEO_API_CONFIG;
