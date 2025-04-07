'use client';

import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [topK, setTopK] = useState(10);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

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
    } catch (error) {
      setResult({ error: 'Failed to fetch recommendation.' });
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
          <label className="font-medium">Top K:</label>
          <input
            type="number"
            min={1}
            max={20}
            value={topK}
            onChange={(e) => setTopK(Number(e.target.value))}
            className="w-24 px-2 py-1 border rounded-md"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          {loading ? 'Generating...' : 'Recommend'}
        </button>
      </form>

      {result && Array.isArray(result) && (
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
              {result.map((item: any, idx: number) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b">
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {item.name}
                    </a>
                  </td>
                  <td className="px-4 py-3 border-b">
                    {item.duration === -1 ? 'Not specified' : item.duration}
                  </td>
                  <td className="px-4 py-3 border-b">{item.keys.join(', ')}</td>
                  <td className="px-4 py-3 border-b text-center">{item.remote}</td>
                  <td className="px-4 py-3 border-b text-center">{item.adaptive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {result?.error && (
        <p className="text-red-600 mt-4">{result.error}</p>
      )}
    </main>
  );
}
