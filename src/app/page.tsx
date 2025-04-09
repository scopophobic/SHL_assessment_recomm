"use client";

import { useState } from "react";

type Recommendation = {
  name: string;
  link: string;
  duration: number | string;
  skills: string[];
  remote_support: string;
  adaptive_support: string;
};

const keyAbbreviations: { [key: string]: string } = {
  "Ability & Aptitude": "A",
  "Biodata & Situational Judgement": "B",
  Competencies: "C",
  "Development & 360": "D",
  "Assessment Exercises": "E",
  "Knowledge & Skills": "K",
  "Personality & Behavior": "P",
  Simulations: "S",
};

const API_ENDPOINT = "https://shl-recommendation-engine-hnys.onrender.com/recommend";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [topK, setTopK] = useState(10);
  const [result, setResult] = useState<Recommendation[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      setErrorMsg("Prompt cannot be empty.");
      return;
    }

    setLoading(true);
    setResult(null);
    setErrorMsg(null);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, top_k: topK }),
      });

      const data = await response.json();
      setResult(data.recommendations);
    } catch {
      setErrorMsg("Failed to fetch recommendation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 text-black">
      {/* Navbar */}
      <nav className="bg-white border-b shadow px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-blue-600">
          SHL <span className="text-gray-800">Recommender</span>
        </div>
        <div className="text-sm text-right space-y-1">
          <a
            href="https://github.com/scopophobic/test_recommendation_engine"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            GitHub ↗
          </a>
          <br />
          <a
            href={API_ENDPOINT}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            API Endpoint ↗
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6 max-w-5xl mx-auto">
        <p className="font-semibold mb-2">Enter your hiring prompt:</p>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
          <textarea
            rows={5}
            className="w-full p-3 border rounded-md shadow-sm"
            placeholder="e.g. Looking for a sales executive with good reasoning and communication"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <div className="flex items-center gap-4">
            <label className="font-medium">Total recommendations:</label>
            <input
              type="number"
              min={1}
              max={20}
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              className="w-24 px-2 py-1 border rounded-md"
            />
          </div>

          {/* Instructions Box */}
          <div className="w-full lg:w-[400px] p-4 border rounded-md shadow bg-white h-fit">
            <h2 className="text-lg text-red-500 font-semibold mb-2">Instructions</h2>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              <li>Keep the prompt clear and concise.</li>
              <li>Set how many recommendations you want.</li>
              <li>Click <b>Recommend</b> to get suggestions.</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={!prompt.trim()}
            className={`${
              !prompt.trim() ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            } bg-blue-600 text-white px-6 py-2 rounded-md`}
          >
            {loading ? "Generating..." : "Recommend"}
          </button>
        </form>

        {/* Results Table */}
        {result && (
          <div className="mt-10 overflow-x-auto">
            <table className="min-w-full bg-white rounded-md shadow border mt-4">
              <thead className="bg-gray-100 text-left text-sm font-semibold">
                <tr>
                  <th className="px-4 py-3 border-b">Name</th>
                  <th className="px-4 py-3 border-b">Duration</th>
                  <th className="px-4 py-3 border-b">Keys</th>
                  <th className="px-4 py-3 border-b text-center">Remote</th>
                  <th className="px-4 py-3 border-b text-center">Adaptive</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {result.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border-b">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {item.name}
                      </a>
                    </td>
                    <td className="px-4 py-3 border-b">
                      {item.duration === -1 ? "Not specified" : item.duration}
                    </td>
                    <td className="px-4 py-3 border-b text-center">
                      {Array.isArray(item.skills)
                        ? item.skills.map((full) => keyAbbreviations[full] || full[0]).join(", ")
                        : "-"}
                    </td>
                    <td className="px-4 py-3 border-b text-center">
                      {item.remote_support === "Yes" && (
                        <span className="text-green-500">🟢 Yes</span>
                      )}
                    </td>
                    <td className="px-4 py-3 border-b text-center">
                      {item.adaptive_support === "Yes" && (
                        <span className="text-green-500">🟢 Yes</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Error Message */}
        {errorMsg && <p className="text-red-600 mt-4">{errorMsg}</p>}
      </div>
    </main>
  );
}
