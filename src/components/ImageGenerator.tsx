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
  // State for dropdowns and images
  const [model, setModel] = useState("Openjourney");
  const [aspectRatio, setAspectRatio] = useState("Portrait (9:16)");
  const [numImages, setNumImages] = useState(1);
  const [images, setImages] = useState<string[]>([]);
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

  // Remove advanced controls and fetch logic for HuggingFace
  // Update handleGenerate to use Pollinations API
  const handleGenerate = async () => {
    if (!prompt) return;
    setGenerating(true);
    setImageLoaded(false);
    setLoadError("");
    setImageURL("");
    setImages([]);

    // Pollinations API: just set the image URL
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
    setImageURL(url);
    setImages([url]);
    setImageLoaded(true);
    // Add a small delay so spinner is visible
    setTimeout(() => {
      setGenerating(false);
    }, 1000);

    // Update history
    if (prompt && url && !history.some(h => h.url === url)) {
      const updatedHistory = [{ prompt, url }, ...history];
      setHistory(updatedHistory);
      localStorage.setItem("prompt-history", JSON.stringify(updatedHistory));
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 px-2 sm:px-4">
        <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl bg-white bg-opacity-10 backdrop-blur-lg p-6 sm:p-10 lg:p-14 rounded-2xl shadow-2xl border border-white/20 flex flex-col items-center mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-purple-600 mb-4 drop-shadow text-center">Get Started</h1>
          <p className="text-base sm:text-lg lg:text-xl text-white mb-8 text-center">Generate AI images for free!<br/>For higher quality and faster results, try Premium Mode.</p>
          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <button
              onClick={handleGetStarted}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-indigo-500 px-8 py-3 sm:px-10 sm:py-4 rounded-lg hover:opacity-90 transition-all font-bold text-white text-lg sm:text-xl shadow mb-2 sm:mb-0"
            >
              Use for Free
            </button>
            <button
              onClick={handlePremium}
              className="w-full sm:w-auto bg-black bg-opacity-80 hover:bg-opacity-100 px-8 py-3 sm:px-10 sm:py-4 rounded-lg transition-all font-bold text-white text-lg sm:text-xl shadow border border-yellow-600"
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 px-2 sm:px-4">
      <div className="relative w-full max-w-lg sm:max-w-2xl mx-auto bg-[#181c2b] p-4 sm:p-8 rounded-2xl shadow-2xl border border-white/10 flex flex-col items-center">
        {/* Settings Icon */}
        <button className="absolute top-4 right-4 bg-[#23263a] rounded-full p-2 border border-[#2e3250] hover:bg-[#2e3250] transition-colors">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#a78bfa" strokeWidth="2"/><path d="M12 8v4l2 2" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 w-full">
          <span className="bg-purple-600 p-2 rounded-lg"><svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M12 2a1 1 0 0 1 1 1v2.07a7.001 7.001 0 0 1 6.93 6.02h2.07a1 1 0 1 1 0 2h-2.07a7.001 7.001 0 0 1-6.02 6.93V21a1 1 0 1 1-2 0v-2.07a7.001 7.001 0 0 1-6.93-6.02H3a1 1 0 1 1 0-2h2.07a7.001 7.001 0 0 1 6.02-6.93V3a1 1 0 0 1 1-1Z"/></svg></span>
          <span>AI Image Generator</span>
        </h1>
        <div className="w-full flex flex-col gap-2 mb-4">
          <div className="relative">
            <textarea
              className="w-full p-4 rounded-xl bg-[#23263a] text-white text-base sm:text-lg mb-0 resize-y min-h-[80px] max-h-48 border border-[#2e3250] focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Describe your image..."
              rows={4}
            />
            <span className="absolute bottom-4 right-4 bg-purple-700 bg-opacity-80 rounded-full p-2 flex items-center justify-center">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="#a78bfa" d="M12 2a1 1 0 0 1 1 1v2.07a7.001 7.001 0 0 1 6.93 6.02h2.07a1 1 0 1 1 0 2h-2.07a7.001 7.001 0 0 1-6.02 6.93V21a1 1 0 1 1-2 0v-2.07a7.001 7.001 0 0 1-6.93-6.02H3a1 1 0 1 1 0-2h2.07a7.001 7.001 0 0 1 6.02-6.93V3a1 1 0 0 1 1-1Z"/></svg>
            </span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full mb-4">
          <select value={model} onChange={e => setModel(e.target.value)} className="flex-1 p-3 rounded-lg bg-[#23263a] text-white border border-[#2e3250] focus:outline-none">
            <option value="Openjourney">Openjourney</option>
            <option value="Stable Diffusion">Stable Diffusion</option>
            <option value="Anything V3">Anything V3</option>
          </select>
          <select value={numImages} onChange={e => setNumImages(Number(e.target.value))} className="flex-1 p-3 rounded-lg bg-[#23263a] text-white border border-[#2e3250] focus:outline-none">
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Image{n > 1 ? 's' : ''}</option>)}
          </select>
          <select value={aspectRatio} onChange={e => setAspectRatio(e.target.value)} className="flex-1 p-3 rounded-lg bg-[#23263a] text-white border border-[#2e3250] focus:outline-none">
            <option value="Square (1:1)">Square (1:1)</option>
            <option value="Portrait (9:16)">Portrait (9:16)</option>
            <option value="Landscape (16:9)">Landscape (16:9)</option>
          </select>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="w-full text-base sm:text-lg bg-gradient-to-r from-purple-500 to-indigo-500 px-8 py-3 rounded-lg hover:opacity-90 transition-all font-bold text-white shadow disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          <span className="inline-flex items-center gap-2">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M12 2a1 1 0 0 1 1 1v2.07a7.001 7.001 0 0 1 6.93 6.02h2.07a1 1 0 1 1 0 2h-2.07a7.001 7.001 0 0 1-6.02 6.93V21a1 1 0 1 1-2 0v-2.07a7.001 7.001 0 0 1-6.93-6.02H3a1 1 0 1 1 0-2h2.07a7.001 7.001 0 0 1 6.02-6.93V3a1 1 0 0 1 1-1Z"/></svg>
            {generating ? 'Generating...' : 'Generate'}
          </span>
        </button>
        {loadError && (
          <div className="w-full flex flex-col items-center mt-2">
            <div className="flex items-center gap-2 text-red-400 font-semibold bg-[#23263a] px-4 py-2 rounded-lg">
              <span className="text-xl">&#9888;</span>
              <span className="text-sm sm:text-base">Generation failed! Check console for more details</span>
            </div>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-2 mt-4 w-full">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex-1 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors text-white font-medium shadow"
          >
            {showHistory ? 'Hide History' : 'Show History'}
          </button>
          <button
            onClick={handleDeleteHistory}
            className="flex-1 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors text-white font-medium shadow"
            disabled={history.length === 0}
          >
            Delete History
          </button>
        </div>
        {/* History Section */}
        {showHistory && (
          <div className="w-full mt-6 bg-[#23263a] rounded-xl p-4 border border-[#2e3250] max-h-64 overflow-y-auto">
            <h2 className="text-white text-lg font-bold mb-2">Prompt History</h2>
            {history.length === 0 ? (
              <div className="text-gray-400">No history yet.</div>
            ) : (
              <ul className="space-y-2">
                {history.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <button
                      className="flex-1 text-left text-white hover:underline truncate"
                      onClick={() => handleHistoryClick(item)}
                    >
                      {item.prompt}
                    </button>
                    <img src={item.url} alt="history" className="w-10 h-10 object-cover rounded" />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {/* Images Grid and Loading Indicator */}
        {generating && (
          <div className="w-full flex flex-col items-center justify-center mt-8 mb-8">
            <div className="flex items-center gap-3">
              <svg className="animate-spin h-8 w-8 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              <span className="text-lg sm:text-xl text-purple-200 font-semibold">Image is generating, this may take a few seconds...</span>
            </div>
          </div>
        )}
        {images.length > 0 && !generating && (
          <div className="w-full mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {images.map((img, idx) => {
              let aspectClass = "aspect-square";
              if (aspectRatio === "Portrait (9:16)") aspectClass = "aspect-[9/16]";
              if (aspectRatio === "Landscape (16:9)") aspectClass = "aspect-[16/9]";
              return (
                <div key={idx} className={`bg-white bg-opacity-10 rounded-xl p-2 flex flex-col items-center shadow border border-white/20 cursor-pointer ${aspectClass} w-full`} onClick={() => openModal(img, prompt)}>
                  <div className={`w-full h-full ${aspectClass} flex items-center justify-center`}>
                    <img src={img} alt={`Generated ${idx+1}`} className="rounded-lg object-cover w-full h-full" />
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); handleDownload(img, prompt); }}
                    className="bg-black text-white px-6 py-2 rounded mt-2 hover:bg-gray-800 transition shadow"
                  >
                    Download
                  </button>
                </div>
              );
            })}
          </div>
        )}
        {/* Image Modal */}
        {modalOpen && modalImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" onClick={closeModal}>
            <div className="relative bg-white bg-opacity-95 rounded-xl shadow-2xl p-4 max-w-lg w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
              <button className="absolute top-2 right-2 text-2xl text-gray-700 hover:text-black" onClick={closeModal}>&times;</button>
              {/* Aspect ratio logic for modal */}
              {(() => {
                let aspectClass = "aspect-square";
                if (aspectRatio === "Portrait (9:16)") aspectClass = "aspect-[9/16]";
                if (aspectRatio === "Landscape (16:9)") aspectClass = "aspect-[16/9]";
                return (
                  <div className={`w-full max-w-xs sm:max-w-md md:max-w-lg ${aspectClass} flex items-center justify-center mb-4`}>
                    <img src={modalImage.url} alt={modalImage.prompt} className="rounded-lg object-cover w-full h-full" />
                  </div>
                );
              })()}
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
    </div>
  );
}

export default ImageGenerator;
