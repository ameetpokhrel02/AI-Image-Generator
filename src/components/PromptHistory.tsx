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
    <div>
      <h2 className="text-xl font-semibold text-white mb-4">Recent Generations</h2>
      <ul className="space-y-4">
        {history.length === 0 && <li className="text-gray-400">No history yet.</li>}
        {history.map((p, idx) => (
          <li
            key={idx}
            className="flex items-center gap-4 bg-white/10 hover:bg-white/20 transition rounded-xl p-3 shadow"
          >
            <img
              src={p.url}
              alt={p.prompt}
              className="w-16 h-16 object-cover rounded-lg border border-white/20"
            />
            <span className="truncate text-gray-200 text-sm">{p.prompt}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PromptHistory;
