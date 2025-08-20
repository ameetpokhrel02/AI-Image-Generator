import { useState } from "react";

function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Save generated image + prompt to history in localStorage 
  const saveToHistory = (newEntry) => {
    try {
      const saved = JSON.parse(localStorage.getItem("prompt-history") || "[]");
      const updated = [newEntry, ...saved].slice(0, 20); // keep only last 20
      localStorage.setItem("prompt-history", JSON.stringify(updated));
    } catch {
      localStorage.setItem("prompt-history", JSON.stringify([newEntry]));
    }
  };

  const generateImage = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setImageUrl("");

    try {
      // Example: direct API call ()
      const res = await fetch("https://image.pollinations.ai/prompt/" + encodeURIComponent(prompt));
      if (!res.ok) throw new Error("Failed to fetch image");

      const imageBlob = await res.blob();
      const url = URL.createObjectURL(imageBlob);

      setImageUrl(url);

      // Save to localStorage for PromptHistory
      saveToHistory({ prompt, url });
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl bg-white/10 rounded-2xl shadow-lg p-6 backdrop-blur-md">
      <h1 className="text-3xl font-bold text-center mb-4 text-white">AI Image Generator</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt..."
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
        />
        <button
          onClick={generateImage}
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 transition disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {imageUrl && (
        <div className="mt-4">
          <img
            src={imageUrl}
            alt={prompt}
            className="w-full rounded-xl shadow-lg border border-white/20"
          />
          <a
            href={imageUrl}
            download="generated-image.png"
            className="block mt-3 text-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Download Image
          </a>
        </div>
      )}
    </div>
  );
}

export default ImageGenerator;
