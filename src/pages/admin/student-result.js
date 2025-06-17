import React, { useState, useEffect } from 'react';
import BASE_URL from '@/components/config/apiConfig';
import Swal from 'sweetalert2';

const StudentResultAdmin = () => {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    class: '',
    section: '',
    year: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
  });

  // Fetch all results or filtered results
  const fetchResults = async () => {
    try {
      setLoading(true);
      let url = `${BASE_URL}/api/student-results`;
      
      // Add filters if provided
      if (searchParams.class || searchParams.section || searchParams.year) {
        url = `${BASE_URL}/api/student-results/by-class-year?class=${searchParams.class}&section=${searchParams.section}&year=${searchParams.year}`;
      }
      
      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      
      const data = await res.json();
      
      setResults(data);
      setPagination(prev => ({
        ...prev,
        totalItems: data.length
      }));
    } catch (err) {
      console.error('Error fetching results:', err);
      Swal.fire('Error', 'Failed to fetch student results', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [searchParams]);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) {
      return Swal.fire('Please select an Excel file', '', 'warning');
    }

    const formData = new FormData();
    formData.append('excel', file);

    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/student-results/upload`, {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        Swal.fire('Success', `File uploaded. ${result.insertedCount || 0} results saved.`, 'success');
        setFile(null);
        // Reset file input
        const fileInput = document.getElementById('file-input');
        if (fileInput) fileInput.value = '';
        fetchResults();
      } else {
        Swal.fire('Error', result.error || 'Failed to upload Excel', 'error');
      }
    } catch (err) {
      console.error('Upload error:', err);
      Swal.fire('Error', 'Something went wrong during upload', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Delete Result',
      text: 'Are you sure you want to delete this result? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/student-results/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        Swal.fire('Deleted!', 'Student result has been deleted.', 'success');
        fetchResults();
      } else {
        const error = await res.json();
        Swal.fire('Error', error.error || 'Failed to delete result', 'error');
      }
    } catch (err) {
      console.error('Delete error:', err);
      Swal.fire('Error', 'Something went wrong during deletion', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student) => {
    // Create a copy to avoid direct state mutation
    setCurrentResult({...student});
    setEditMode(true);
  };

  const handleEditCancel = () => {
    setCurrentResult(null);
    setEditMode(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setCurrentResult(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Format the data properly for the backend
      const formattedData = {...currentResult};
      
      // Convert publish_date to proper MySQL format if it exists
      if (formattedData.publish_date) {
        // Format date to YYYY-MM-DD format for MySQL
        const date = new Date(formattedData.publish_date);
        formattedData.publish_date = date.toISOString().split('T')[0];
      }
      
      // Convert any numeric fields that should be numbers
      ['Bangla', 'English', 'Mathematics', 'Science', 'BGS', 'ICT', 'Religion', 
       'ArtsAndCrafts', 'PhysicalEdu', 'HomeScience', 'AgriculturalStudies', 
       'HigherMath', 'Physics', 'Chemistry', 'Biology', 'total_marks', 'merit_position']
        .forEach(field => {
          if (formattedData[field] !== undefined && formattedData[field] !== null && formattedData[field] !== '') {
            formattedData[field] = Number(formattedData[field]);
          }
        });
      
      const res = await fetch(`${BASE_URL}/api/student-results/${currentResult.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formattedData)
      });

      if (res.ok) {
        Swal.fire('Updated!', 'Student result has been updated.', 'success');
        setEditMode(false);
        setCurrentResult(null);
        fetchResults();
      } else {
        const error = await res.json();
        console.error('Update error details:', error);
        Swal.fire('Error', error.error || 'Failed to update result', 'error');
      }
    } catch (err) {
      console.error('Update error:', err);
      Swal.fire('Error', 'Something went wrong during update', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setSearchParams({
      class: '',
      section: '',
      year: ''
    });
  };

  // Pagination
  const handlePageChange = (page) => {
    setPagination(prev => ({
      ...prev,
      currentPage: page
    }));
  };

  const getPageData = () => {
    const { currentPage, itemsPerPage } = pagination;
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return results.slice(start, end);
  };

  const pageData = getPageData();
  const totalPages = Math.ceil(pagination.totalItems / pagination.itemsPerPage);

  const downloadSampleTemplate = () => {
    const sampleData = [
      {
        student_name: 'Rahim Islam',
        roll: '101',
        class: '10',
        section: 'A',
        year: '2024',
        Bangla: 75,
        English: 80,
        Mathematics: 85,
        Science: 78,
        BGS: 82,
        ICT: 90,
        Religion: 88
      }
    ];
    
    // Create a blob and download link
    const blob = new Blob([JSON.stringify(sampleData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_results_template.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    Swal.fire('Template Downloaded', 'Please convert the JSON template to Excel format before uploading.', 'info');
  };

  return (
    <div className="p-4">
      {/* Upload Excel Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h2 className="text-lg font-semibold mb-3">রেজাল্ট আপলোড করুন</h2>
        <div className="flex flex-wrap items-center gap-4">
          <input
            type="file"
            id="file-input"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="border rounded p-2 flex-grow"
          />
          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className={`px-4 py-2 rounded ${
              loading || !file ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {loading ? 'আপলোড হচ্ছে...' : 'এক্সেল আপলোড করুন'}
          </button>
          <button
            onClick={downloadSampleTemplate}
            className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
          >
            নমুনা ডাউনলোড
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          শিক্ষার্থী ফলাফল সহ একটি এক্সেল ফাইল আপলোড করুন। ফাইলে student_name, roll, class, section, year এবং বিষয়ভিত্তিক স্কোর অন্তর্ভুক্ত থাকতে হবে।
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h2 className="text-lg font-semibold mb-3">ফলাফল অনুসন্ধান করুন</h2>
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">শ্রেণি</label>
            <input
              type="text"
              name="class"
              value={searchParams.class}
              onChange={handleSearchChange}
              placeholder="যেমন: ১০"
              className="w-full border rounded p-2"
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">শাখা</label>
            <input
              type="text"
              name="section"
              value={searchParams.section}
              onChange={handleSearchChange}
              placeholder="যেমন: ক"
              className="w-full border rounded p-2"
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">সাল</label>
            <input
              type="text"
              name="year"
              value={searchParams.year}
              onChange={handleSearchChange}
              placeholder="যেমন: ২০২৪"
              className="w-full border rounded p-2"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 text-white"
            >
              ফিল্টার মুছুন
            </button>
          </div>
        </div>
      </div>

      {/* Edit Form (conditionally rendered) */}
      {editMode && currentResult && (
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h2 className="text-lg font-semibold mb-3">শিক্ষার্থী ফলাফল সম্পাদনা</h2>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">শিক্ষার্থীর নাম</label>
                <input
                  type="text"
                  name="student_name"
                  value={currentResult.student_name || ''}
                  onChange={handleEditChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">রোল</label>
                <input
                  type="text"
                  name="roll"
                  value={currentResult.roll || ''}
                  onChange={handleEditChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">শ্রেণি</label>
                <input
                  type="text"
                  name="class"
                  value={currentResult.class || ''}
                  onChange={handleEditChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">শাখা</label>
                <input
                  type="text"
                  name="section"
                  value={currentResult.section || ''}
                  onChange={handleEditChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">সাল</label>
                <input
                  type="text"
                  name="year"
                  value={currentResult.year || ''}
                  onChange={handleEditChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              
              {/* Main subject scores */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">বাংলা</label>
                <input
                  type="number"
                  name="Bangla"
                  value={currentResult.Bangla || ''}
                  onChange={handleEditChange}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ইংরেজি</label>
                <input
                  type="number"
                  name="English"
                  value={currentResult.English || ''}
                  onChange={handleEditChange}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">গণিত</label>
                <input
                  type="number"
                  name="Mathematics"
                  value={currentResult.Mathematics || ''}
                  onChange={handleEditChange}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">বিজ্ঞান</label>
                <input
                  type="number"
                  name="Science"
                  value={currentResult.Science || ''}
                  onChange={handleEditChange}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">বিজিএস</label>
                <input
                  type="number"
                  name="BGS"
                  value={currentResult.BGS || ''}
                  onChange={handleEditChange}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">আইসিটি</label>
                <input
                  type="number"
                  name="ICT"
                  value={currentResult.ICT || ''}
                  onChange={handleEditChange}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ধর্ম</label>
                <input
                  type="number"
                  name="Religion"
                  value={currentResult.Religion || ''}
                  onChange={handleEditChange}
                  className="w-full border rounded p-2"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleEditCancel}
                className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 text-white"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Results Table */}
      <div className="bg-white rounded-lg shadow">
        <h2 className="text-lg font-semibold p-4 border-b">শিক্ষার্থী ফলাফল তালিকা</h2>
        
        {loading && !editMode ? (
          <div className="p-8 text-center">
            <p>ফলাফল লোড হচ্ছে...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="p-8 text-center">
            <p>কোনো ফলাফল পাওয়া যায়নি। একটি এক্সেল ফাইল আপলোড করুন অথবা আপনার ফিল্টার সমন্বয় করুন।</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left text-sm font-medium text-gray-700">নাম</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-700">রোল</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-700">শ্রেণি</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-700">শাখা</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-700">সাল</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-700">মোট নম্বর</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-700">মেধা অবস্থান</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-700">কার্যক্রম</th>
                  </tr>
                </thead>
                <tbody>
                  {pageData.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{student.student_name}</td>
                      <td className="p-3">{student.roll}</td>
                      <td className="p-3">{student.class}</td>
                      <td className="p-3">{student.section}</td>
                      <td className="p-3">{student.year}</td>
                      <td className="p-3">{student.total_marks}</td>
                      <td className="p-3">{student.merit_position}</td>
                      <td className="p-3 space-x-2">
                        <button
                          onClick={() => handleEdit(student)}
                          className="text-blue-600 hover:underline"
                        >
                          সম্পাদনা
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="text-red-600 hover:underline"
                        >
                          মুছুন
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center p-4 border-t">
                <nav className="inline-flex">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={pagination.currentPage === 1}
                    className={`px-3 py-1 rounded-l-md border ${
                      pagination.currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    প্রথম
                  </button>
                  
                  {[...Array(totalPages).keys()].map(number => (
                    <button
                      key={number}
                      onClick={() => handlePageChange(number + 1)}
                      className={`px-3 py-1 border-t border-b ${
                        pagination.currentPage === number + 1 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      {number + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={pagination.currentPage === totalPages}
                    className={`px-3 py-1 rounded-r-md border ${
                      pagination.currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    শেষ
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StudentResultAdmin;