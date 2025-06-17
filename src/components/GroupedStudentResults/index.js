'use client';

import React, { useEffect, useState } from 'react';
import BASE_URL from '@/components/config/apiConfig';

const GroupedStudentResults = () => {
  const [groupedData, setGroupedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedClasses, setExpandedClasses] = useState({});

  const fetchGroupedResults = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/student-results/grouped-summary`);
      if (!res.ok) throw new Error('Failed to fetch data');
      const data = await res.json();
      setGroupedData(data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupedResults();
  }, []);

  const toggleClass = (className) => {
    setExpandedClasses((prev) => ({
      ...prev,
      [className]: !prev[className],
    }));
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto font-sans bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-green-800 border-b-4 border-green-700 pb-3 mb-8">
        📘 শিক্ষার্থীদের ফলাফল | Grouped Summary
      </h1>

      {loading ? (
        <p className="text-center text-gray-600">লোড হচ্ছে...</p>
      ) : Object.keys(groupedData).length === 0 ? (
        <p className="text-center text-gray-600">কোনো ফলাফল পাওয়া যায়নি।</p>
      ) : (
        Object.entries(groupedData).map(([className, sections]) => (
          <div
            key={className}
            className="mb-6 rounded-xl border-2 border-green-700 bg-white shadow-lg overflow-hidden transition-all"
          >
            <div
              onClick={() => toggleClass(className)}
              className="cursor-pointer bg-green-700 text-white px-6 py-4 flex items-center justify-between hover:bg-green-800 transition"
            >
              <h2 className="text-xl font-bold tracking-wide">শ্রেণি {className}</h2>
              <span className="text-2xl">{expandedClasses[className] ? '▾' : '▸'}</span>
            </div>

            {expandedClasses[className] && (
              <div className="p-6 bg-green-50 space-y-6">
                {Object.entries(sections).map(([section, years]) => (
                  <div key={section} className="rounded-md bg-white border border-green-300 p-4 shadow-sm">
                    <h3 className="text-lg font-semibold text-green-700 border-b border-green-300 mb-3 pb-1">
                      সেকশন: {section}
                    </h3>

                    {Object.entries(years).map(([year, students]) => (
                      <div key={year} className="mb-6">
                        <h4 className="text-base font-medium text-gray-700 mb-2">📅 সাল: {year}</h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {students.map((student) => (
                            <div
                              key={`${student.roll}-${student.year}`}
                              className="bg-white border border-gray-200 p-4 rounded-md shadow-sm hover:shadow-md transition-all"
                            >
                              <p className="text-sm"><strong>👤 নাম:</strong> {student.student_name}</p>
                              <p className="text-sm"><strong>🎓 রোল:</strong> {student.roll}</p>
                              <p className="text-sm"><strong>📊 মোট নম্বর:</strong> {student.total_marks}</p>
                              <p className="text-sm">
                                <strong>🏆 মেধা স্থান:</strong>{' '}
                                <span className="text-green-700 font-semibold">
                                  {student.merit_position ?? 'N/A'}
                                </span>
                              </p>
                              <p className="text-sm"><strong>❌ ব্যর্থ বিষয়:</strong> {student.failed_subjects ?? 0}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default GroupedStudentResults;
