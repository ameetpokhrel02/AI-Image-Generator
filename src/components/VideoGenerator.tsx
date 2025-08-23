import { useState } from "react";

interface VideoGeneratorProps {
  onVideoGenerated?: (videoData: { prompt: string; videoUrl: string; timestamp: number }) => void;
}

interface VideoSettings {
  model: 'director-1.0' | 'director-2.0' | 'cinematic';
  style: 'no-style' | 'cinematic' | 'anime' | 'realistic' | 'artistic';
  duration: '5s' | '10s' | '15s' | '30s';
  quality: 'standard' | 'hd' | '4k';
  aspectRatio: '16:9' | '9:16' | '1:1';
}

function VideoGenerator({ onVideoGenerated }: VideoGeneratorProps) {
  const [activeTab, setActiveTab] = useState<'from-image' | 'from-text' | 'template'>('from-text');
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState<VideoSettings>({
    model: 'director-1.0',
    style: 'no-style',
    duration: '10s',
    quality: 'hd',
    aspectRatio: '16:9'
  });

  const generateVideo = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");

    try {
      // Simulate video generation (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // For now, we'll simulate a video URL
      const videoUrl = `https://example.com/generated-video-${Date.now()}.mp4`;
      
      const videoData = {
        prompt: prompt,
        videoUrl: videoUrl,
        timestamp: Date.now()
      };

      if (onVideoGenerated) {
        onVideoGenerated(videoData);
      }

      // Save to history
      saveToHistory(videoData);

    } catch (error) {
      console.error("Error generating video:", error);
      setError("Failed to generate video. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const saveToHistory = (newEntry: { prompt: string; videoUrl: string; timestamp: number }) => {
    try {
      const saved = JSON.parse(localStorage.getItem("video-history") || "[]");
      const updated = [newEntry, ...saved].slice(0, 20);
      localStorage.setItem("video-history", JSON.stringify(updated));
    } catch {
      localStorage.setItem("video-history", JSON.stringify([newEntry]));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      generateVideo();
    }
  };

  return (
    <div className="flex h-full bg-gray-900">
      {/* Left Control Panel */}
      <div className="w-96 bg-gray-800 border-r border-gray-700 p-6 overflow-y-auto">
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('from-image')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'from-image'
                ? 'bg-purple-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-600'
            }`}
          >
            From Image
          </button>
          <button
            onClick={() => setActiveTab('from-text')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'from-text'
                ? 'bg-purple-600 text-white'
                : 'text-white'
            }`}
          >
            From Text
          </button>
          <button
            onClick={() => setActiveTab('template')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'template'
                ? 'bg-purple-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-600'
            }`}
          >
            Template
          </button>
        </div>

        {/* Text to Video Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Text to Video</h2>
          <p className="text-gray-400 text-sm">Transform your ideas into stunning videos</p>
        </div>

        {/* Model Selection */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium">Model</h3>
            <button className="text-gray-400 hover:text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => setSettings(prev => ({ ...prev, model: 'director-1.0' }))}
              className={`p-4 rounded-lg border transition-all ${
                settings.model === 'director-1.0'
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-gray-600 bg-gray-700 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-white font-medium">Director 1.0</div>
                  <div className="text-gray-400 text-sm">Latest AI model</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Prompt Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium">Prompt ?</h3>
            <button className="text-purple-400 hover:text-purple-300 text-sm flex items-center space-x-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              <span>Prompt Enhancer</span>
            </button>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your video story..."
            className="w-full h-32 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Styles Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium">Styles ?</h3>
            <button className="text-gray-400 hover:text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => setSettings(prev => ({ ...prev, style: 'no-style' }))}
              className={`p-4 rounded-lg border transition-all ${
                settings.style === 'no-style'
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-gray-600 bg-gray-700 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-white font-medium">No Style</div>
                  <div className="text-gray-400 text-sm">Natural look</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Settings Section */}
        <div className="mb-6">
          <button className="w-full flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
            <span className="text-white font-medium">Settings</span>
            <svg className="w-5 h-5 text-gray-400 transform rotate-180" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateVideo}
          disabled={loading || !prompt.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              <span>Generate</span>
              <span className="text-sm bg-white/20 px-2 py-1 rounded">10</span>
            </>
          )}
        </button>

        {/* Error Message */}
        {error && (
          <div className="mt-4 bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm text-center">
            {error}
          </div>
        )}
      </div>

      {/* Right Preview Area */}
      <div className="flex-1 bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-gray-600">
            <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v2H2V6zM14 6H2v8a2 2 0 002 2h12a2 2 0 002-2V8h-2V6z" />
            </svg>
          </div>
          <h3 className="text-white text-xl font-medium mb-2">Create your video now!</h3>
          <p className="text-gray-400">Your generated video will appear here</p>
        </div>
        
        {/* Options Menu */}
        <button className="absolute bottom-6 right-6 w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default VideoGenerator;
