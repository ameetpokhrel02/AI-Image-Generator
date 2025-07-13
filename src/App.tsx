import ImageGenerator from "./components/ImageGenerator";
import PromptHistory from "./components/PromptHistory";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex flex-col items-center px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-10 tracking-wide bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
        AI Image Generator 🎨
      </h1>
      <ImageGenerator />
      <PromptHistory />
    </div>
  );
}

export default App;
