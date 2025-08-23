import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/context/AuthContext";
import Login from "./auth/pages/Login";
import Signup from "./auth/pages/Signup";
import ImageGenerator from "./components/ImageGenerator";
import PromptHistory from "./components/PromptHistory";
import VideoGenerator from "./components/VideoGenerator";
import VideoHistory from "./components/VideoHistory";
import "./App.css";
import { useState } from "react";

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

// Main App Content
function AppContent() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [imageHistory, setImageHistory] = useState<Array<{ prompt: string; imageUrl: string; timestamp: number }>>([]);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState<string>("");
  const [activeTab, setActiveTab] = useState<'images' | 'videos'>('images');

  const handleImageGenerated = (imageData: { prompt: string; imageUrl: string; timestamp: number }) => {
    setCurrentImage(imageData.imageUrl);
    setCurrentPrompt(imageData.prompt);
    setImageHistory(prev => [imageData, ...prev.slice(0, 19)]);
  };

  const handleMultipleImagesGenerated = (images: string[], prompt: string) => {
    setGeneratedImages(images);
    setCurrentPrompt(prompt);
    if (images.length > 0) {
      setCurrentImage(images[0]);
    }
  };

  const handleVideoGenerated = (videoData: { prompt: string; videoUrl: string; timestamp: number }) => {
    // Handle video generation (could be expanded later)
    console.log("Video generated:", videoData);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-white">AI Creator Studio</h1>
              
              {/* Navigation Tabs */}
              <div className="flex space-x-1 bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('images')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'images'
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    <span>Images</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('videos')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'videos'
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v2H2V6zM14 6H2v8a2 2 0 002 2h12a2 2 0 002-2V8h-2V6z" />
                    </svg>
                    <span>Videos</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <span className="text-gray-300">{user?.name || user?.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex space-x-4">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isAuthenticated ? (
          <div className="space-y-8">
            {/* Promotional Banner */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                {activeTab === 'images' ? 'Create Amazing AI Images' : 'Generate Stunning AI Videos'}
              </h2>
              <p className="text-purple-100 text-lg">
                {activeTab === 'images' 
                  ? 'Transform your ideas into beautiful visuals with our advanced AI image generation'
                  : 'Bring your stories to life with our cutting-edge AI video generation technology'
                }
              </p>
            </div>

            {/* Content Based on Active Tab */}
            {activeTab === 'images' ? (
              /* Image Generation Layout */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Image Generator */}
                <div className="lg:col-span-2">
                  <ImageGenerator
                    onImageGenerated={handleImageGenerated}
                    onMultipleImagesGenerated={handleMultipleImagesGenerated}
                  />
                </div>

                {/* Right Column - Image Display & History */}
                <div className="space-y-6">
                  {/* Current Generated Image */}
                  {currentImage && (
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                      <h3 className="text-lg font-medium text-white mb-4">Generated Image</h3>
                      <img
                        src={currentImage}
                        alt={currentPrompt}
                        className="w-full rounded-lg border border-gray-600"
                      />
                      {currentPrompt && (
                        <p className="text-gray-300 text-sm mt-3">
                          <strong>Prompt:</strong> {currentPrompt}
                        </p>
                      )}
                      <div className="mt-4 flex space-x-2">
                        <a
                          href={currentImage}
                          download={`ai-generated-${Date.now()}.jpg`}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white text-center py-2 px-4 rounded-lg transition-colors"
                        >
                          Download
                        </a>
                        <button
                          onClick={() => setCurrentImage(null)}
                          className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Multiple Generated Images */}
                  {generatedImages.length > 1 && (
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                      <h3 className="text-lg font-medium text-white mb-4">
                        All Generated Images ({generatedImages.length})
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {generatedImages.map((imageUrl, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={imageUrl}
                              alt={`${currentPrompt} - Image ${index + 1}`}
                              className="w-full rounded-lg border border-gray-600 transition-transform group-hover:scale-105"
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

                  {/* Prompt History */}
                  <PromptHistory />
                </div>
              </div>
            ) : (
              /* Video Generation Layout */
              <div className="space-y-6">
                <VideoGenerator onVideoGenerated={handleVideoGenerated} />
                <VideoHistory />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold text-white mb-4">Welcome to AI Creator Studio</h2>
            <p className="text-gray-400 text-lg mb-8">
              Create amazing AI-generated images and videos. Please log in or sign up to get started.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/login"
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Main App Component
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
