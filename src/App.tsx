import ImageGenerator from "./components/ImageGenerator";
import PromptHistory from "./components/PromptHistory";


function App() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-800 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left section - Main Generator */}
        <div className="lg:col-span-2">
          <div className="backdrop-blur-md bg-white/10 rounded-2xl shadow-lg p-6 border border-white/20">
            <h1 className="text-3xl font-bold text-white mb-4">
              AI Image Generator
            </h1>
            <p className="text-gray-300 mb-6">
              Enter your prompt below and generate unique AI-powered images.
            </p>
            <ImageGenerator />
          </div>
        </div>

        {/* Right section - Prompt History */}
        <div className="backdrop-blur-md bg-white/5 rounded-2xl shadow-lg p-6 border border-white/20 overflow-y-auto max-h-[80vh]">
          <PromptHistory />
        </div>
      </div>
    </div>
  );
}

export default App;
