// src/components/PromptHistory.tsx
import { useEffect, useState } from "react";

function PromptHistory() {
  const [history, setHistory] = useState<{ prompt: string; url: string }[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("prompt-history") || "[]");
      if (Array.isArray(saved)) {
        setHistory(saved.filter(item => item && typeof item.prompt === 'string' && typeof item.url === 'string'));
      }
    } catch {
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("prompt-history", JSON.stringify(history));
    }
  }, [history]);

  return (
    <div className="mt-10 max-w-xl mx-auto">
      <h2 className="text-2xl mb-4 font-semibold">Prompt History</h2>
      <ul className="space-y-3">
        {history.length === 0 && <li className="text-gray-400">No history yet.</li>}
        {history.map((p, idx) => (
          <li key={idx} className="flex items-center gap-3 bg-white bg-opacity-10 rounded-lg p-2">
            <img src={p.url} alt={p.prompt} className="w-12 h-12 object-cover rounded shadow border border-white/20" />
            <span className="truncate text-gray-200">{p.prompt}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PromptHistory;
