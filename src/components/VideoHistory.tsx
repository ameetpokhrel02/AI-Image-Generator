import { useState, useEffect } from "react";

interface VideoEntry {
  prompt: string;
  videoUrl: string;
  timestamp: number;
}

function VideoHistory() {
  const [videoHistory, setVideoHistory] = useState<VideoEntry[]>([]);

  useEffect(() => {
    loadVideoHistory();
  }, []);

  const loadVideoHistory = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("video-history") || "[]");
      setVideoHistory(saved);
    } catch {
      setVideoHistory([]);
    }
  };

  const clearHistory = () => {
    localStorage.removeItem("video-history");
    setVideoHistory([]);
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  if (videoHistory.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v2H2V6zM14 6H2v8a2 2 0 002 2h12a2 2 0 002-2V8h-2V6z" />
            </svg>
          </div>
          <h3 className="text-white text-lg font-medium mb-2">No videos generated yet</h3>
          <p className="text-gray-400 text-sm">Your video generation history will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">Video History</h3>
            <p className="text-gray-400 text-sm">Your generated videos</p>
          </div>
          <button
            onClick={clearHistory}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Video List */}
      <div className="p-6 space-y-4">
        {videoHistory.map((entry, index) => (
          <div
            key={index}
            className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-colors"
          >
            <div className="flex items-start space-x-4">
              {/* Video Thumbnail */}
              <div className="w-20 h-20 bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v2H2V6zM14 6H2v8a2 2 0 002 2h12a2 2 0 002-2V8h-2V6z" />
                </svg>
              </div>

              {/* Video Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium mb-2 line-clamp-2">
                  {entry.prompt}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span>{formatTimestamp(entry.timestamp)}</span>
                  <span>•</span>
                  <span>Video</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <a
                  href={entry.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  title="View Video"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a
                  href={entry.videoUrl}
                  download={`video-${index + 1}-${Date.now()}.mp4`}
                  className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  title="Download Video"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-700/50 border-t border-gray-700">
        <p className="text-gray-400 text-sm text-center">
          {videoHistory.length} video{videoHistory.length !== 1 ? 's' : ''} generated
        </p>
      </div>
    </div>
  );
}

export default VideoHistory;
