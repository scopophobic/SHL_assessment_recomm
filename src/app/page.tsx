'use client';

import { useState } from 'react';

type Recommendation = {
  name: string;
  link: string;
  duration: number | string;
  keys: string[];
  remote: boolean;
  adaptive: boolean;
};

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [topK, setTopK] = useState(10);
  const [result, setResult] = useState<Recommendation[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setErrorMsg(null);

    try {
      const response = await fetch('https://shl-recommendation-engine-hnys.onrender.com/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, top_k: topK }),
      });

      const data = await response.json();
      setResult(data.recommendations);
    } catch {
      setErrorMsg('Failed to fetch recommendation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6 bg-gray-50 text-black">
      <h1 className="text-3xl font-bold mb-4">Assessment Recommender</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <textarea
          rows={5}
          className="w-full p-3 border rounded-md shadow-sm"
          placeholder="Enter hiring prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <div className="flex items-center gap-4">
          <label className="font-medium">total recommendation :</label>
          <input
            type="number"
            min={1}
            max={20}
            value={topK}
            onChange={(e) => setTopK(Number(e.target.value))}
            className="w-24 px-2 py-1 border rounded-md"
          />
        </div>
        <div className="w-full lg:w-64 p-4 border rounded-md shadow bg-white h-fit">
        <h2 className="text-lg font-semibold mb-2">Instructions</h2>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>Prompt should be in <b>one line</b>, no new line</li>
          <li>Set how many recommendations you want.</li>
          <li>Click "Recommend" and check the table.</li>
          <li>make Sure the prompt is Clear and concise</li>
        </ul>
      </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          {loading ? 'Generating...' : 'Recommend'}
        </button>
      </form>

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
              {result.map((item: Recommendation, idx: number) => (
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
                    {item.duration === -1 ? 'Not specified' : item.duration}
                  </td>
                  <td className="px-4 py-3 border-b">{item.keys.join(', ')}</td>
                  <td className="px-4 py-3 border-b text-center">{item.remote ? 'Yes' : null}</td>
                  <td className="px-4 py-3 border-b text-center">{item.adaptive ? 'Yes' : null}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
        </div>
       
      )}

      {errorMsg && <p className="text-red-600 mt-4">{errorMsg}</p>}
    </main>
  );
}
