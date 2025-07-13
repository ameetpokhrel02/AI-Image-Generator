// src/components/ImageGenerator.jsx
import { useState, useRef } from "react";

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

  const handleGenerate = async () => {
    if (!prompt) return;
    setGenerating(true);
    setImageLoaded(false);
    setLoadError("");
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
    setImageURL(url);
    const updatedHistory = [{ prompt, ural }, ...history];
    setHistory(updatedHistory);
    localStorage.setItem("prompt-history", JSON.stringify(updatedHistory));
    // Set a timeout for image loading
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setGenerating(false);
      setLoadError("Image generation timed out. Please try again or use a different prompt.");
    }, 40000); // 40 seconds
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setGenerating(false);
    setLoadError("");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

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
      <div className="flex flex-col lg:flex-row w-full max-w-5xl mx-auto gap-8">
        <div className="w-full max-w-2xl bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/20 mb-8 relative flex flex-col items-center mx-auto">
          {/* Header with History and Delete Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-3xl mb-6 gap-4">
            <h1 className="text-3xl font-bold text-white drop-shadow">AI Image Generator</h1>
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

          {/* Main Card */}
          {/* Input Section */}
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <input
              type="text"
              className="flex-1 p-3 rounded-lg text-black focus:outline-none focus:ring-2 ring-purple-400 bg-white bg-opacity-80"
              placeholder="Describe your dream image..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-3 rounded-lg hover:opacity-90 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow"
            >
              {generating ? 'Generating...' : 'Generate'}
            </button>
          </div>

          {/* Loader or Image */}
          <div className="mt-6 w-full flex flex-col items-center min-h-[300px] relative">
            {generating && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 rounded-xl z-10">
                <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                <div className="text-lg text-white font-medium animate-pulse">Generating image...<br/>(This may take up to a minute depending on server load)</div>
              </div>
            )}
            {/* If timeout or error, but image is available in history, show it */}
            {loadError && latestHistoryImage ? (
              <div className="w-full flex flex-col items-center">
                <img
                  src={latestHistoryImage.url}
                  alt={latestHistoryImage.prompt}
                  className="w-full max-w-md rounded-xl shadow-lg border border-white/20 object-cover min-h-[250px] cursor-pointer"
                  style={{ opacity: 1, transition: 'opacity 0.3s' }}
                  onClick={() => openModal(latestHistoryImage.url, latestHistoryImage.prompt)}
                />
                <button
                  onClick={e => { e.stopPropagation(); handleDownload(latestHistoryImage.url, latestHistoryImage.prompt); }}
                  className="mt-4 bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow"
                >
                  Download
                </button>
                <div className="mt-2 text-yellow-300 text-xs">Image loaded after timeout. Try again for faster results.</div>
              </div>
            ) : loadError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 rounded-xl z-20">
                <div className="text-red-400 text-lg font-semibold mb-2">{loadError}</div>
                <button
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
                  onClick={handleGenerate}
                  disabled={generating}
                >
                  Retry
                </button>
              </div>
            ) : null}
            {/* Normal image display */}
            {imageURL && !generating && !loadError && (
              <div className="w-full flex flex-col items-center">
                <img
                  src={imageURL}
                  alt={prompt}
                  className="w-full max-w-md rounded-xl shadow-lg border border-white/20 object-cover min-h-[250px] cursor-pointer"
                  style={{ opacity: generating ? 0.5 : 1, transition: 'opacity 0.3s' }}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  onClick={() => openModal(imageURL, prompt)}
                />
                <button
                  onClick={e => { e.stopPropagation(); handleDownload(imageURL, prompt); }}
                  disabled={downloading || generating}
                  className="mt-4 bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow"
                >
                  {downloading ? 'Downloading...' : 'Download'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Prompt History as Card Grid */}
        {showHistory && (
          <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-white drop-shadow">Prompt History</h2>
            {history.length === 0 ? (
              <div className="text-white text-center opacity-70">No history yet.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {history.map((item: { prompt: string; url: string }, index: number) => (
                  <div
                    key={index}
                    className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-4 flex flex-col items-center shadow-lg border border-white/20 transition hover:scale-105 cursor-pointer"
                    onClick={() => handleHistoryClick(item)}
                  >
                    <img
                      src={item.url}
                      alt={item.prompt}
                      className="rounded-lg mb-2 object-cover w-full h-32 border border-white/10 shadow cursor-pointer"
                      onClick={e => { e.stopPropagation(); openModal(item.url, item.prompt); }}
                    />
                    <p className="truncate text-white w-full text-center mb-2 text-sm">{item.prompt}</p>
                    <button
                      onClick={e => { e.stopPropagation(); handleDownload(item.url, item.prompt); }}
                      className="bg-green-500 px-3 py-1 rounded hover:bg-green-600 transition text-xs text-white shadow"
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {/* Image Modal */}
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
