import { useState } from "react";

interface ImageGeneratorProps {
  onImageGenerated?: (imageData: { prompt: string; imageUrl: string; timestamp: number }) => void;
  onMultipleImagesGenerated?: (images: string[], prompt: string) => void;
}

interface GenerationSettings {
  aspectRatio: 'portrait' | 'square' | 'landscape';
  imageCount: 1 | 3 | 4;
  model: 'standard' | 'hd' | 'genius';
  preference: 'speed' | 'quality';
  useOldModel: boolean;
}

function ImageGenerator({ onImageGenerated, onMultipleImagesGenerated }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState("a close up image of lion");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [settings, setSettings] = useState<GenerationSettings>({
    aspectRatio: 'square',
    imageCount: 1,
    model: 'hd',
    preference: 'quality',
    useOldModel: false
  });

  const generateImage = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    setGeneratedImages([]);

    try {
      const images: string[] = [];
      
      for (let i = 0; i < settings.imageCount; i++) {
        let imageUrl: string;
        
        try {
          // Primary: Use Pollinations API (as requested)
          const aspectRatio = settings.aspectRatio === 'portrait' ? '9:16' : 
                             settings.aspectRatio === 'landscape' ? '16:9' : '1:1';
          
          // Clean the prompt for better results
          const cleanPrompt = prompt.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '') // Remove special characters
            .replace(/\s+/g, '+') // Replace spaces with + for URL
            .trim();
          
          // Generate unique seed for each image
          const seed = Date.now() + i;
          
          // Use Pollinations API with proper formatting
          imageUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?seed=${seed}&width=512&height=512&aspect=${aspectRatio}`;
          
          // Test if the image loads
          await new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(imageUrl);
            img.onerror = () => reject(new Error('Image failed to load'));
            img.src = imageUrl;
          });
          
        } catch (pollinationsError) {
          console.log('Pollinations failed, trying fallback:', pollinationsError);
          
          try {
            // Fallback 1: Try Unsplash Source
            const cleanPrompt = prompt.toLowerCase()
              .replace(/[^a-z0-9\s]/g, '')
              .replace(/\s+/g, ',')
              .trim();
            
            const seed = Date.now() + i;
            imageUrl = `https://source.unsplash.com/featured/?${cleanPrompt}&sig=${seed}`;
            
            // Test if the image loads
            await new Promise((resolve, reject) => {
              const img = new Image();
              img.onload = () => resolve(imageUrl);
              img.onerror = () => reject(new Error('Image failed to load'));
              img.src = imageUrl;
            });
            
          } catch (unsplashError) {
            console.log('Unsplash failed, using Picsum as final fallback:', unsplashError);
            
            // Fallback 2: Use Picsum with prompt-based seeding
            const seed = Date.now() + i;
            const cleanPrompt = prompt.toLowerCase()
              .replace(/[^a-z0-9\s]/g, '')
              .replace(/\s+/g, ',')
              .trim();
            const promptHash = cleanPrompt.split('').reduce((a: number, b: string) => {
              a = ((a << 5) - a) + b.charCodeAt(0);
              return a & a;
            }, 0);
            imageUrl = `https://picsum.photos/seed/${promptHash + seed}/512/512`;
          }
        }
        
        images.push(imageUrl);
      }

      setGeneratedImages(images);

      // Notify parent about multiple images
      if (onMultipleImagesGenerated) {
        onMultipleImagesGenerated(images, prompt);
      }

      // Save first image to history and notify parent for single image display
      if (images.length > 0) {
        const imageData = {
          prompt: prompt,
          imageUrl: images[0],
          timestamp: Date.now()
        };

        if (onImageGenerated) {
          onImageGenerated(imageData);
        }

        saveToHistory(imageData);
      }

    } catch (error) {
      console.error("Error generating image:", error);
      setError("Failed to generate image. Please try again.");
      
      // Emergency fallback with Picsum
      try {
        const images: string[] = [];
        for (let i = 0; i < settings.imageCount; i++) {
          const seed = Date.now() + i;
          const cleanPrompt = prompt.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, ',')
            .trim();
          const promptHash = cleanPrompt.split('').reduce((a: number, b: string) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
          }, 0);
          const imageUrl = `https://picsum.photos/seed/${promptHash + seed}/512/512`;
          images.push(imageUrl);
        }
        
        setGeneratedImages(images);
        if (onMultipleImagesGenerated) {
          onMultipleImagesGenerated(images, prompt);
        }
        
        const imageData = {
          prompt: prompt,
          imageUrl: images[0],
          timestamp: Date.now()
        };
        
        if (onImageGenerated) {
          onImageGenerated(imageData);
        }
        
        saveToHistory(imageData);
      } catch (fallbackError) {
        console.error("All fallbacks failed:", fallbackError);
        setError("Image generation failed. Please check your internet connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Save generated image + prompt to history in localStorage 
  const saveToHistory = (newEntry: { prompt: string; imageUrl: string; timestamp: number }) => {
    try {
      const saved = JSON.parse(localStorage.getItem("prompt-history") || "[]");
      const updated = [newEntry, ...saved].slice(0, 20); // keep only last 20
      localStorage.setItem("prompt-history", JSON.stringify(updated));
    } catch {
      localStorage.setItem("prompt-history", JSON.stringify([newEntry]));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      generateImage();
    }
  };

  const updateSetting = <K extends keyof GenerationSettings>(
    key: K, 
    value: GenerationSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Text Prompt Input */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-medium text-white mb-4">Create an image from text prompt</h3>
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your prompt here..."
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">1</div>
            </div>
          </div>
          <div className="text-red-400 text-sm">crossing</div>
        </div>
      </div>

      {/* Image Count Selection */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-medium text-white mb-4">Number of Images</h3>
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={() => updateSetting('imageCount', 1)}
            className={`py-3 px-4 rounded-lg transition-colors ${
              settings.imageCount === 1 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
            }`}
          >
            1 Image
          </button>
          <button 
            onClick={() => updateSetting('imageCount', 3)}
            className={`py-3 px-4 rounded-lg transition-colors ${
              settings.imageCount === 3 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
            }`}
          >
            3 Images
          </button>
          <button 
            onClick={() => updateSetting('imageCount', 4)}
            className={`py-3 px-4 rounded-lg transition-colors ${
              settings.imageCount === 4 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
            }`}
          >
            4 Images
          </button>
        </div>
      </div>

      {/* Aspect Ratio Selection */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-medium text-white mb-4">Aspect Ratio</h3>
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={() => updateSetting('aspectRatio', 'portrait')}
            className={`py-3 px-4 rounded-lg transition-colors ${
              settings.aspectRatio === 'portrait' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
            }`}
          >
            Portrait
          </button>
          <button 
            onClick={() => updateSetting('aspectRatio', 'square')}
            className={`py-3 px-4 rounded-lg transition-colors ${
              settings.aspectRatio === 'square' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
            }`}
          >
            Square
          </button>
          <button 
            onClick={() => updateSetting('aspectRatio', 'landscape')}
            className={`py-3 px-4 rounded-lg transition-colors ${
              settings.aspectRatio === 'landscape' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
            }`}
          >
            Landscape
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={generateImage}
        disabled={loading || !prompt.trim()}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
            <span>Generating {settings.imageCount} image{settings.imageCount > 1 ? 's' : ''}...</span>
          </>
        ) : (
          <span>Generate {settings.imageCount} Image{settings.imageCount > 1 ? 's' : ''}</span>
        )}
      </button>

      {/* Loading Progress */}
      {loading && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-medium">Generating Images...</span>
            <span className="text-purple-400 text-sm">
              {settings.preference === 'speed' ? 'Fast Mode' : 'Quality Mode'}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-purple-600 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
          </div>
          <p className="text-gray-400 text-sm mt-2">
            This may take a few seconds. Please wait...
          </p>
        </div>
      )}

      {/* Generated Images Display */}
      {generatedImages.length > 0 && !loading && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-medium text-white mb-4">
            Generated Images ({generatedImages.length})
          </h3>
          <div className={`grid gap-4 ${
            settings.imageCount === 1 ? 'grid-cols-1' :
            settings.imageCount === 3 ? 'grid-cols-3' : 'grid-cols-2'
          }`}>
            {generatedImages.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <img
                  src={imageUrl}
                  alt={`${prompt} - Image ${index + 1}`}
                  className={`w-full rounded-lg border border-gray-600 transition-transform group-hover:scale-105 ${
                    settings.aspectRatio === 'portrait' ? 'aspect-[9/16]' :
                    settings.aspectRatio === 'landscape' ? 'aspect-[16/9]' : 'aspect-square'
                  }`}
                />
                <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
                <a
                  href={imageUrl}
                  download={`ai-generated-${index + 1}-${Date.now()}.jpg`}
                  className="absolute bottom-2 left-2 bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-300 text-sm text-center">
          {error}
        </div>
      )}

      {/* API Status Info */}
      <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-green-300 text-sm">
        <p className="font-medium mb-2">✅ Using Pollinations API + Fallbacks</p>
        <ul className="space-y-1 text-xs">
          <li>• <strong>Primary:</strong> Pollinations AI (prompt-based generation)</li>
          <li>• <strong>Fallback 1:</strong> Unsplash Source (relevant photos)</li>
          <li>• <strong>Fallback 2:</strong> Picsum Photos (prompt-seeded)</li>
        </ul>
      </div>

      {/* Model Selection */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-medium text-white mb-4">Choose a model</h3>
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={() => updateSetting('model', 'standard')}
            className={`py-3 px-4 rounded-lg transition-colors ${
              settings.model === 'standard' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
            }`}
          >
            Standard
          </button>
          <button 
            onClick={() => updateSetting('model', 'hd')}
            className={`py-3 px-4 rounded-lg transition-colors ${
              settings.model === 'hd' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
            }`}
          >
            HD
          </button>
          <button className="py-3 px-4 bg-gray-700 text-gray-500 rounded-lg cursor-not-allowed flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Genius
          </button>
        </div>
      </div>

      {/* Preference Selection */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-medium text-white mb-4">Preference</h3>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => updateSetting('preference', 'speed')}
            className={`py-3 px-4 rounded-lg transition-colors ${
              settings.preference === 'speed' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
            }`}
          >
            Speed
          </button>
          <button 
            onClick={() => updateSetting('preference', 'quality')}
            className={`py-3 px-4 rounded-lg transition-colors ${
              settings.preference === 'quality' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
            }`}
          >
            Quality
          </button>
        </div>
      </div>

      {/* Old Model Option */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input 
            type="checkbox" 
            checked={settings.useOldModel}
            onChange={(e) => updateSetting('useOldModel', e.target.checked)}
            className="w-5 h-5 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2" 
          />
          <span className="text-white">Use Old Model</span>
        </label>
      </div>

      {/* Style Selection */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-medium text-white mb-4">Choose a style</h3>
        <div className="grid grid-cols-5 gap-3 mb-4">
          <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
            <span className="text-gray-400 text-xs">🐼</span>
          </div>
          <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
            <span className="text-gray-400 text-xs">🌲</span>
          </div>
          <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
            <span className="text-gray-400 text-xs">🤖</span>
          </div>
          <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
            <span className="text-gray-400 text-xs">👧</span>
          </div>
        </div>
        <a href="#" className="text-purple-400 hover:text-purple-300 text-sm">View all 100 styles</a>
      </div>
    </div>
  );
}

export default ImageGenerator;
