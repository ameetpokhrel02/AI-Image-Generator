import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/context/AuthContext";
import ImageGenerator from "./components/ImageGenerator";
import PromptHistory from "./components/PromptHistory";
import Login from "./auth/pages/Login";
import Signup from "./auth/pages/Signup";
import { useState } from "react";

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Main App Content - DeepAI Style
const AppContent: React.FC = () => {
  const { user, logout } = useAuth();
  const [currentImage, setCurrentImage] = useState<{
    prompt: string;
    imageUrl: string;
    timestamp: number;
  } | null>(null);
  const [imageHistory, setImageHistory] = useState<Array<{
    prompt: string;
    imageUrl: string;
    timestamp: number;
  }>>([]);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState("");

  const handleImageGenerated = (imageData: {
    prompt: string;
    imageUrl: string;
    timestamp: number;
  }) => {
    setCurrentImage(imageData);
    setCurrentPrompt(imageData.prompt);
    setImageHistory(prev => [imageData, ...prev.slice(0, 19)]); // Keep last 20
  };

  const handleMultipleImagesGenerated = (images: string[], prompt: string) => {
    setGeneratedImages(images);
    setCurrentPrompt(prompt);
    
    // Set the first image as current for the main display
    if (images.length > 0) {
      const imageData = {
        prompt: prompt,
        imageUrl: images[0],
        timestamp: Date.now()
      };
      setCurrentImage(imageData);
      setImageHistory(prev => [imageData, ...prev.slice(0, 19)]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header - DeepAI Style */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-2xl font-bold text-purple-400">DeepAI</div>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">AI Chat</a>
              <a href="#" className="text-purple-400 font-medium">AI Image Generator</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">AI Video</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">AI Music</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Voice Chat</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">AI Photo Editor</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Math AI</a>
            </nav>
            
            {/* Right side */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-gray-300">Welcome, {user.fullName}</span>
                  <button 
                    onClick={logout}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-medium transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white font-medium transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
              
              {/* Hamburger Menu */}
              <button className="md:hidden text-gray-300 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Promotional Banner */}
      <div className="bg-purple-600 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-medium">Upgrade to DeepAI Pro</span>
            <span className="text-purple-200">More access to the best AI</span>
          </div>
          <button className="text-white hover:text-purple-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">AI Image Generator</h1>
          <p className="text-xl text-gray-300">This is an AI Image Generator. It creates an image from scratch from a text description.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Image Generation Form */}
          <div className="space-y-6">
            <ImageGenerator 
              onImageGenerated={handleImageGenerated} 
              onMultipleImagesGenerated={handleMultipleImagesGenerated}
            />
          </div>

          {/* Right Panel - Generated Image Area */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 flex flex-col">
            <h3 className="text-lg font-medium text-white mb-4">Generated Image</h3>
            
            {currentImage ? (
              <div className="flex-1 flex flex-col">
                {/* Current Image */}
                <div className="flex-1 bg-gray-700 rounded-lg overflow-hidden mb-4">
                  <img
                    src={currentImage.imageUrl}
                    alt={currentImage.prompt}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Image Info */}
                <div className="bg-gray-700 rounded-lg p-4 mb-4">
                  <p className="text-white font-medium mb-2">Prompt:</p>
                  <p className="text-gray-300 text-sm">{currentImage.prompt}</p>
                  <p className="text-gray-400 text-xs mt-2">
                    Generated: {new Date(currentImage.timestamp).toLocaleString()}
                  </p>
                </div>
                
                {/* Download Button */}
                <a
                  href={currentImage.imageUrl}
                  download={`ai-generated-${Date.now()}.jpg`}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg text-center transition-colors"
                >
                  Download Image
                </a>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 bg-gray-700 rounded-lg flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-400">Generated image will appear here</p>
                  <p className="text-gray-500 text-sm mt-2">Enter a prompt and click Submit to generate</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Multiple Generated Images Section */}
        {generatedImages.length > 1 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              All Generated Images ({generatedImages.length})
            </h2>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <p className="text-gray-300 mb-4">Prompt: <span className="text-white font-medium">{currentPrompt}</span></p>
              <div className={`grid gap-6 ${
                generatedImages.length === 3 ? 'grid-cols-3' : 'grid-cols-2'
              }`}>
                {generatedImages.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={imageUrl}
                      alt={`${currentPrompt} - Image ${index + 1}`}
                      className="w-full rounded-lg border border-gray-600 transition-transform group-hover:scale-105 cursor-pointer"
                      onClick={() => setCurrentImage({
                        prompt: currentPrompt,
                        imageUrl: imageUrl,
                        timestamp: Date.now()
                      })}
                    />
                    <div className="absolute top-3 right-3 bg-black/70 text-white text-sm px-3 py-1 rounded-full font-medium">
                      {index + 1}
                    </div>
                    <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a
                        href={imageUrl}
                        download={`ai-generated-${index + 1}-${Date.now()}.jpg`}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-2 rounded-lg transition-colors"
                      >
                        Download
                      </a>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg"></div>
                  </div>
                ))}
              </div>
              <p className="text-gray-400 text-sm mt-4 text-center">
                Click on any image to view it in the main panel above
              </p>
            </div>
          </div>
        )}

        {/* Image History Section */}
        {imageHistory.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Recent Generations</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {imageHistory.map((image, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-3 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer" onClick={() => setCurrentImage(image)}>
                  <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden mb-3">
                    <img
                      src={image.imageUrl}
                      alt={image.prompt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-white text-sm truncate">{image.prompt}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {new Date(image.timestamp).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Main App Route - Protected */}
          <Route path="/" element={
            <ProtectedRoute>
              <AppContent />
            </ProtectedRoute>
          } />
          
          {/* Redirect to home for unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
