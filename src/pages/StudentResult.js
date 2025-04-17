import { useState } from 'react';
import Head from 'next/head';
import BASE_URL from '@/components/config/apiConfig';

export default function StudentResultPage() {
  const [form, setForm] = useState({ student_name: '', roll: '', year: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchResult = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const query = new URLSearchParams(form).toString();
      const res = await fetch(`${BASE_URL}/api/student-results/search?${query}`);
      const data = await res.json();
      if (!res.ok || !data) {
        throw new Error(data.message || 'Result not found');
      }
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const subjectMarks = result ? Object.entries(result).filter(([key]) => {
    return !["id", "student_name", "roll", "class", "section", "year", "publish_date", "total_marks", "merit_position", "failed_subjects"].includes(key);
  }) : [];

  return (
    <>
      <Head>
        <title>Student Result</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 py-10 px-4">
        <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-3xl p-8">
          <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">🔍 Search Student Result</h1>

          <form onSubmit={fetchResult} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              name="student_name"
              value={form.student_name}
              onChange={handleChange}
              placeholder="Student Name"
              className="input"
              required
            />
            <input
              name="roll"
              value={form.roll}
              onChange={handleChange}
              placeholder="Roll Number"
              className="input"
              required
            />
            <input
              name="year"
              value={form.year}
              onChange={handleChange}
              placeholder="Year (e.g. 2024)"
              type="number"
              className="input"
              required
            />
            <button
              type="submit"
              className="md:col-span-3 bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {loading ? 'Searching...' : 'Search Result'}
            </button>
          </form>

          {error && <p className="text-red-500 text-center mt-4">{error}</p>}

          {result && (
            <div className="mt-6 bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-center text-purple-700 mb-4">🎓 Result for {result.student_name}</h2>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p><strong>Roll:</strong> {result.roll}</p>
                <p><strong>Class:</strong> {result.class}</p>
                <p><strong>Section:</strong> {result.section}</p>
                <p><strong>Year:</strong> {result.year}</p>
                <p><strong>Merit Position:</strong> {result.merit_position}</p>
                <p><strong>Total Marks:</strong> {result.total_marks}</p>
                <p className="col-span-2"><strong>Failed Subjects:</strong> {result.failed_subjects || 'None'}</p>
              </div>
              <h3 className="mt-4 font-bold text-center text-blue-600">📘 Subject-wise Marks</h3>
              <ul className="grid grid-cols-2 gap-2 mt-2">
                {subjectMarks.map(([key, value]) => (
                  <li key={key} className="text-sm">
                    {key.replace(/([A-Z])/g, ' $1')}: <span className="font-semibold">{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .input {
          @apply border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400;
        }
      `}</style>
    </>
  );
}
