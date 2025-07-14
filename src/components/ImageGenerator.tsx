// src/components/ImageGenerator.jsx
import React, { useState, useRef } from "react";

function safeGetHistory() {
  try {
    const raw = localStorage.getItem("prompt-history");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(item => item && typeof item.prompt === 'string' && typeof item.url === 'string');
  } catch {
    localStorage.removeItem("prompt-history");
    return [];
  }
}

function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [generating, setGenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [history, setHistory] = useState<{ prompt: string; url: string }[]>(safeGetHistory());
  const [loadError, setLoadError] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<{ url: string; prompt: string } | null>(null);
  const [showLanding, setShowLanding] = useState(true);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // New state for advanced controls
  const [negativePrompt, setNegativePrompt] = useState("");
  const [steps, setSteps] = useState(30);
  const [guidance, setGuidance] = useState(7.5);
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(512);
  const [numImages, setNumImages] = useState(1);
  const [images, setImages] = useState<string[]>([]);

  // Helper to generate image(s) using HuggingFace Space API
  async function generateImageWithSpaceAPI(prompt: string, negativePrompt: string, steps: number, guidance: number, width: number, height: number, numImages: number): Promise<string[]> {
    try {
      const response = await fetch("https://hf.space/embed/armen425221356/UnfilteredAI-NSFW-gen-v2_self_parms/api/predict/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          data: [prompt, negativePrompt, steps, guidance, width, height, numImages]
        })
      });
      if (!response.ok) return [];
      const result = await response.json();
      // result.data is an array of base64 images ("data:image/png;base64,...")
      if (Array.isArray(result.data)) {
        return result.data;
      }
      return [];
    } catch {
      return [];
    }
  }

  const handleGenerate = async () => {
    if (!prompt) return;
    setGenerating(true);
    setImageLoaded(false);
    setLoadError("");
    setImageURL("");
    setImages([]);
    // Use HuggingFace Space API
    const base64Images = await generateImageWithSpaceAPI(prompt, negativePrompt, steps, guidance, width, height, numImages);
    if (base64Images.length > 0) {
      setImages(base64Images);
      setImageURL(base64Images[0]);
      setImageLoaded(true);
      setGenerating(false);
      setLoadError("");
      // Only update history after image loads
      if (prompt && base64Images[0] && !history.some(h => h.url === base64Images[0])) {
        const updatedHistory = [{ prompt, url: base64Images[0] }, ...history];
        setHistory(updatedHistory);
        localStorage.setItem("prompt-history", JSON.stringify(updatedHistory));
      }
    } else {
      setGenerating(false);
      setLoadError("Image generation failed. Please try again or later.");
    }
  };

  // Update handleImageLoad to be a no-op (since we set imageLoaded above)
  const handleImageLoad = () => {};

  const handleImageError = () => {
    setImageLoaded(false);
    setGenerating(false);
    setLoadError("Failed to generate image. Please try again.");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleDownload = async (urlToDownload: string, promptText: string) => {
    if (!urlToDownload) return;
    try {
      setDownloading(true);
      const response = await fetch(urlToDownload);
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${promptText.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to download image. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleHistoryClick = (historyItem: { prompt: string; url: string }) => {
    setPrompt(historyItem.prompt);
    setImageURL(historyItem.url);
    setImageLoaded(true);
    setLoadError("");
  };

  const handleDeleteHistory = () => {
    setHistory([]);
    localStorage.removeItem("prompt-history");
  };

  // Helper: find the most recent image for the current prompt
  const latestHistoryImage = history.find(h => h.prompt === prompt);

  // Modal open/close handlers
  const openModal = (url: string, prompt: string) => {
    setModalImage({ url, prompt });
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setModalImage(null);
  };

  // Landing page handlers
  const handleGetStarted = () => setShowLanding(false);
  const handlePremium = () => setShowPremiumModal(true);
  const closePremiumModal = () => setShowPremiumModal(false);

  // UI
  if (showLanding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 px-4">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20 flex flex-col items-center w-full max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-purple-600 mb-4 drop-shadow">Get Started</h1>
          <p className="text-lg text-white mb-8 text-center">Generate AI images for free!<br/>For higher quality and faster results, try Premium Mode.</p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 px-8 py-3 rounded-lg hover:opacity-90 transition-all font-bold text-white text-lg shadow"
            >
              Use for Free
            </button>
            <button
              onClick={handlePremium}
              className="bg-yellow-400 hover:bg-yellow-500 px-8 py-3 rounded-lg transition-all font-bold text to-blue-500-900 text-lg shadow border border-yellow-600"
            >
              Premium Mode
            </button>
          </div>
        </div>
        {/* Premium Modal */}
        {showPremiumModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-600 bg-opacity-80" onClick={closePremiumModal}>
            <div className="relative bg-white bg-opacity-95 rounded-xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
              <button className="absolute top-2 right-2 text-2xl text-gray-700 hover:text-black" onClick={closePremiumModal}>&times;</button>
              <h2 className="text-2xl font-bold mb-4 text-yellow-700">Premium Mode</h2>
              <p className="mb-4 text-gray-800 text-center">Premium Mode is coming soon!<br/>You’ll be able to generate higher quality, faster images and unlock more features.</p>
              <button
                onClick={closePremiumModal}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-2 rounded-lg hover:opacity-90 transition-all font-bold text-white shadow"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 py-8 px-2">
      <div className="flex flex-col lg:flex-row w-full max-w-6xl mx-auto gap-8">
        {/* Left: Prompt & Controls */}
        <div className="w-full max-w-xl bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/20 mb-8 flex flex-col mx-auto">
          {/* Header with History and Delete Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center w-full mb-6 gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors text-white font-medium shadow"
              >
                {showHistory ? 'Hide History' : 'Show History'}
              </button>
              <button
                onClick={handleDeleteHistory}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors text-white font-medium shadow"
                disabled={history.length === 0}
              >
                Delete History
              </button>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white drop-shadow mb-4">AI Image Generator</h1>
          <label className="text-white font-semibold mb-1">Prompt</label>
          <textarea
            className="w-full p-2 rounded bg-white bg-opacity-80 text-black mb-4 resize-y min-h-[60px] max-h-40"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Describe your image..."
            rows={3}
          />
          <label className="text-white font-semibold mb-1">Negative Prompt</label>
          <textarea
            className="w-full p-2 rounded bg-white bg-opacity-80 text-black mb-4 resize-y min-h-[40px] max-h-32"
            value={negativePrompt}
            onChange={e => setNegativePrompt(e.target.value)}
            placeholder="What do you NOT want in the image? (optional)"
            rows={2}
          />
          {/* Advanced Controls */}
          <div className="flex flex-wrap gap-4 mb-4">
            <div>
              <label className="text-white text-sm">Steps</label>
              <input type="number" min={10} max={100} value={steps} onChange={e => setSteps(Number(e.target.value))} className="w-20 ml-2 rounded p-1" />
            </div>
            <div>
              <label className="text-white text-sm">Guidance</label>
              <input type="number" min={1} max={20} step={0.5} value={guidance} onChange={e => setGuidance(Number(e.target.value))} className="w-20 ml-2 rounded p-1" />
            </div>
            <div>
              <label className="text-white text-sm">Width</label>
              <select value={width} onChange={e => setWidth(Number(e.target.value))} className="ml-2 rounded p-1">
                <option value={256}>256</option>
                <option value={512}>512</option>
                <option value={768}>768</option>
                <option value={1024}>1024</option>
              </select>
            </div>
            <div>
              <label className="text-white text-sm">Height</label>
              <select value={height} onChange={e => setHeight(Number(e.target.value))} className="ml-2 rounded p-1">
                <option value={256}>256</option>
                <option value={512}>512</option>
                <option value={768}>768</option>
                <option value={1024}>1024</option>
              </select>
            </div>
            <div>
              <label className="text-white text-sm"># Images</label>
              <select value={numImages} onChange={e => setNumImages(Number(e.target.value))} className="ml-2 rounded p-1">
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 px-8 py-3 rounded-lg hover:opacity-90 transition-all font-bold text-white text-lg shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? 'Generating...' : 'Generate'}
          </button>
          {loadError && <div className="mt-4 text-red-400 font-semibold">{loadError}</div>}
        </div>
        {/* Right: Images Grid */}
        <div className="w-full flex-1 flex flex-col items-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
            {images.map((img, idx) => (
              <div key={idx} className="bg-white bg-opacity-10 rounded-xl p-2 flex flex-col items-center shadow border border-white/20">
                <img src={img} alt={`Generated ${idx+1}`} className="rounded-lg object-cover w-full max-h-80 mb-2" />
                <button
                  onClick={e => { e.stopPropagation(); handleDownload(img, prompt); }}
                  className="bg-green-500 px-3 py-1 rounded hover:bg-green-600 transition text-xs text-white shadow"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Image Modal remains unchanged */}
      {modalOpen && modalImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" onClick={closeModal}>
          <div className="relative bg-white bg-opacity-90 rounded-xl shadow-2xl p-4 max-w-lg w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <button className="absolute top-2 right-2 text-2xl text-gray-700 hover:text-black" onClick={closeModal}>&times;</button>
            <img src={modalImage.url} alt={modalImage.prompt} className="rounded-lg max-h-[60vh] w-auto object-contain mb-4" />
            <div className="mb-2 text-center text-gray-800 font-semibold">{modalImage.prompt}</div>
            <button
              onClick={e => { e.stopPropagation(); handleDownload(modalImage.url, modalImage.prompt); }}
              className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition text-white font-medium shadow"
            >
              Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageGenerator;
