import React, { useState, useEffect, useMemo } from 'react';
import BASE_URL from '@/components/config/apiConfig';
import Swal from 'sweetalert2';
import { pdf } from '@react-pdf/renderer';
import { StudentMarksheet } from '/utility/marksheet';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const StudentResultAdmin = () => {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 100,
    totalItems: 0,
  });

  // Filter states
  const [filters, setFilters] = useState({
    text: '',
    class: '',
    section: '',
    year: '',
    createdAtStart: '',
    createdAtEnd: '',
  });

  // Bulk selection
  const [selectedResults, setSelectedResults] = useState(new Set());

  // Fetch results from API
  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/student-results`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
      setPagination(prev => ({
        ...prev,
        totalItems: data.length,
      }));
    } catch (error) {
      console.error('Error fetching results:', error);
      Swal.fire('Error', 'Failed to fetch student results', 'error');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle bulk PDF download
  const handleBulkDownloadPDF = async () => {
    if (selectedResults.size === 0) {
      return Swal.fire('No results selected', 'Please select at least one result to download.', 'warning');
    }

    Swal.fire({
      title: 'Generating PDFs...',
      text: 'This might take a moment depending on the number of selected results.',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    try {
      const zip = new JSZip();
      const selectedStudentData = results.filter(student => selectedResults.has(student.id));

      for (const student of selectedStudentData) {
        const classNum = getNumericClass(student.class);
        if (classNum === null) {
          console.error(`Skipping student ${student.student_name} due to invalid class data.`);
          continue; // Skip this student and move to the next one
        }

        let group = student.group_name;
        if (!group || group === 'N/A' || group === 'null') group = null;
        
        let configUrl;
        if (group) {
          configUrl = `${BASE_URL}/api/subject-config/class/${classNum}/group/${group}`;
        } else {
          configUrl = `${BASE_URL}/api/subject-config/class/${classNum}`;
        }
        
        const configResponse = await fetch(configUrl);
        const subjectConfig = configResponse.ok ? await configResponse.json() : [];

        const doc = <StudentMarksheet 
          studentData={student} 
          subjectConfig={subjectConfig}
          examName="Annual Exam" 
          examYear={student.year || "2024"} 
        />;
        
        const blob = await pdf(doc).toBlob();
        zip.file(`marksheet_${student.student_name}_${student.roll}.pdf`, blob);
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `student_marksheets_${Date.now()}.zip`);

      Swal.close();
      Swal.fire('Success!', `${selectedResults.size} marksheets downloaded as a ZIP file.`, 'success');
    } catch (err) {
      console.error('Bulk PDF download error:', err);
      Swal.fire('Error!', 'Failed to generate bulk PDFs.', 'error');
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  // Handle file upload
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
        document.getElementById('file-input').value = '';
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

  // Delete a single result
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Delete Result',
      text: 'Are you sure you want to delete this result?',
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

  // Edit result functions
  const handleEdit = (student) => {
    setCurrentResult({ ...student });
    setEditMode(true);
  };

  const handleEditCancel = () => {
    setEditMode(false);
    setCurrentResult(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/student-results/${currentResult.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentResult),
      });

      if (res.ok) {
        Swal.fire('Updated!', 'Student result has been updated.', 'success');
        setEditMode(false);
        fetchResults();
      } else {
        const error = await res.json();
        Swal.fire('Error', error.error || 'Failed to update result', 'error');
      }
    } catch (err) {
      console.error('Update error:', err);
      Swal.fire('Error', 'Something went wrong during update', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Pagination controls
  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  // Bulk selection functions
  const handleSelectResult = (id, isChecked) => {
    setSelectedResults(prev => {
      const newSelected = new Set(prev);
      isChecked ? newSelected.add(id) : newSelected.delete(id);
      return newSelected;
    });
  };

  const handleSelectAllResults = (isChecked) => {
    setSelectedResults(isChecked ? new Set(pageData.map(r => r.id)) : new Set());
  };

  const handleBulkDelete = async () => {
    if (selectedResults.size === 0) {
      return Swal.fire('No results selected', 'Please select at least one result to delete.', 'warning');
    }

    const confirm = await Swal.fire({
      title: 'Delete Selected Results',
      html: `Are you sure you want to delete ${selectedResults.size} selected results?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete them!'
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/student-results/bulk-delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedResults) }),
      });

      if (res.ok) {
        Swal.fire('Deleted!', `${selectedResults.size} results have been deleted.`, 'success');
        setSelectedResults(new Set());
        fetchResults();
      } else {
        const error = await res.json();
        Swal.fire('Error', error.error || 'Failed to delete selected results', 'error');
      }
    } catch (err) {
      console.error('Bulk delete error:', err);
      Swal.fire('Error', 'Something went wrong during bulk deletion', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filter results
  const filteredResults = useMemo(() => {
    return results.filter(student => {
      const studentName = student.student_name || '';
      const studentClass = student.class || '';
      const studentSection = student.section || '';
      const studentYear = String(student.year || '');
      const studentRoll = String(student.roll || '');

      const matchesText = !filters.text || 
        studentName.toLowerCase().includes(filters.text.toLowerCase()) ||
        studentRoll.includes(filters.text) ||
        studentClass.toLowerCase().includes(filters.text.toLowerCase()) ||
        studentSection.toLowerCase().includes(filters.text.toLowerCase()) ||
        studentYear.includes(filters.text);

      const matchesClass = !filters.class || 
        studentClass.toLowerCase() === filters.class.toLowerCase();
      
      const matchesSection = !filters.section || 
        studentSection.toLowerCase() === filters.section.toLowerCase();
      
      const matchesYear = !filters.year || 
        studentYear === filters.year;

      const matchesDate = (!filters.createdAtStart || new Date(student.created_at || 0) >= new Date(filters.createdAtStart)) &&
        (!filters.createdAtEnd || new Date(student.created_at || 0) <= new Date(filters.createdAtEnd));

      return matchesText && matchesClass && matchesSection && matchesYear && matchesDate;
    });
  }, [results, filters]);

  // Paginated data
  const pageData = useMemo(() => {
    const start = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const end = start + pagination.itemsPerPage;
    return filteredResults.slice(start, end);
  }, [filteredResults, pagination]);

  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      totalItems: filteredResults.length,
      currentPage: 1,
    }));
  }, [filteredResults]);

  // FIXED: Improved getNumericClass to handle both text and number formats
  const getNumericClass = (className) => {
    if (!className) return null;
    const classTextToNumberMap = {
      'six': 6,
      'seven': 7,
      'eight': 8,
      'nine': 9,
      'ten': 10
    };
    const lowerCaseClass = className.toLowerCase();
    if (classTextToNumberMap[lowerCaseClass]) {
      return classTextToNumberMap[lowerCaseClass];
    }
    const parsed = parseInt(className, 10);
    return isNaN(parsed) ? null : parsed;
  };

  // Handle single PDF download
  const handleDownloadPDF = async (student) => {
    try {
      Swal.fire({
        title: 'Generating marksheet...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const classNum = getNumericClass(student.class);
      if (classNum === null) {
        Swal.fire('Error', `Invalid class information for student ${student.student_name}. Cannot generate PDF.`, 'error');
        return;
      }

      let group = student.group_name;
      if (!group || group === 'N/A' || group === 'null') group = null;

      let configUrl;
      if (group) {
        configUrl = `${BASE_URL}/api/subject-config/class/${classNum}/group/${group}`;
      } else {
        configUrl = `${BASE_URL}/api/subject-config/class/${classNum}`;
      }

      const configResponse = await fetch(configUrl);
      const subjectConfig = configResponse.ok ? await configResponse.json() : [];

      const doc = (
        <StudentMarksheet
          studentData={student}
          subjectConfig={subjectConfig}
          examName="Annual Exam"
          examYear={student.year || '2024'}
        />
      );

      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `marksheet_${student.student_name}_${student.roll}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      Swal.close();
      Swal.fire('Success!', 'Download completed.', 'success');
    } catch (err) {
      console.error('PDF error:', err);
      Swal.fire('Error!', 'Failed to generate PDF.', 'error');
    }
  };

  const handleDownloadAllExcel = () => {
    if (results.length === 0) return Swal.fire('Error', 'No results to download.', 'warning');
    
    const worksheet = XLSX.utils.json_to_sheet(results);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');
    XLSX.writeFile(workbook, 'student_results.xlsx');
  };

  const handleDownloadSingleExcel = (student) => {
    const worksheet = XLSX.utils.json_to_sheet([student]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Result');
    XLSX.writeFile(workbook, `result_${student.student_name}_${student.roll}.xlsx`);
  };

  const uniqueClasses = [...new Set(results.map(r => r.class))].sort();
  const uniqueSections = [...new Set(results.map(r => r.section))].sort();
  const uniqueYears = [...new Set(results.map(r => r.year))].sort((a, b) => b - a);
  
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Student Result Management</h1>
      
      {/* File Upload Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-3">Upload Results</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="file"
            id="file-input"
            accept=".xlsx, .xls"
            onChange={(e) => setFile(e.target.files[0])}
            className="flex-grow p-2 border rounded"
          />
          <button
            onClick={handleUpload}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Uploading...' : 'Upload Excel'}
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <h2 className="text-lg font-semibold">
            Student Results ({pagination.totalItems} records)
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadAllExcel}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
            >
              Download All
            </button>
            <button
              onClick={handleBulkDownloadPDF}
              disabled={selectedResults.size === 0 || loading}
              className={`bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 ${
                selectedResults.size === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Download Selected PDFs ({selectedResults.size})
            </button>
            <button
              onClick={handleBulkDelete}
              disabled={selectedResults.size === 0 || loading}
              className={`bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 ${
                selectedResults.size === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Delete Selected ({selectedResults.size})
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Search</label>
            <input
              type="text"
              placeholder="Name, Roll, etc..."
              value={filters.text}
              onChange={(e) => setFilters({...filters, text: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Class</label>
            <select
              value={filters.class}
              onChange={(e) => setFilters({...filters, class: e.target.value})}
              className="w-full p-2 border rounded"
            >
              <option value="">All Classes</option>
              {uniqueClasses.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Section</label>
            <select
              value={filters.section}
              onChange={(e) => setFilters({...filters, section: e.target.value})}
              className="w-full p-2 border rounded"
            >
              <option value="">All Sections</option>
              {uniqueSections.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Year</label>
            <select
              value={filters.year}
              onChange={(e) => setFilters({...filters, year: e.target.value})}
              className="w-full p-2 border rounded"
            >
              <option value="">All Years</option>
              {uniqueYears.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">From Date</label>
            <input
              type="date"
              value={filters.createdAtStart}
              onChange={(e) => setFilters({...filters, createdAtStart: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">To Date</label>
            <input
              type="date"
              value={filters.createdAtEnd}
              onChange={(e) => setFilters({...filters, createdAtEnd: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Results Table */}
        {loading ? (
          <div className="text-center py-8">Loading results...</div>
        ) : filteredResults.length === 0 ? (
          <div className="text-center py-8">No results found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2">
                      <input
                        type="checkbox"
                        onChange={(e) => handleSelectAllResults(e.target.checked)}
                        checked={selectedResults.size === pageData.length && pageData.length > 0}
                        className="rounded"
                      />
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Roll</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Section</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pageData.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">
                        <input
                          type="checkbox"
                          checked={selectedResults.has(student.id)}
                          onChange={(e) => handleSelectResult(student.id, e.target.checked)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-4 py-2">{student.student_name}</td>
                      <td className="px-4 py-2">{student.roll}</td>
                      <td className="px-4 py-2">{student.class}</td>
                      <td className="px-4 py-2">{student.section}</td>
                      <td className="px-4 py-2">{student.year}</td>
                      <td className="px-4 py-2">
                        {student.created_at ? new Date(student.created_at).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDownloadPDF(student)}
                            className="text-red-600 hover:text-red-800"
                            title="Download PDF"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDownloadSingleExcel(student)}
                            className="text-green-600 hover:text-green-800"
                            title="Download Excel"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleEdit(student)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(student.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                {pagination.totalItems} entries
              </div>
              
              <div className="flex gap-1">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={pagination.currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  «
                </button>
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  ‹
                </button>
                
                {Array.from({ length: Math.min(5, Math.ceil(pagination.totalItems / pagination.itemsPerPage)) }, (_, i) => {
                  const page = pagination.currentPage <= 3 ? i + 1 : 
                    pagination.currentPage >= Math.ceil(pagination.totalItems / pagination.itemsPerPage) - 2 ? 
                    Math.ceil(pagination.totalItems / pagination.itemsPerPage) - 4 + i : 
                    pagination.currentPage - 2 + i;
                  
                  if (page < 1 || page > Math.ceil(pagination.totalItems / pagination.itemsPerPage)) return null;
                  
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 border rounded ${
                        pagination.currentPage === page ? 'bg-blue-600 text-white' : ''
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === Math.ceil(pagination.totalItems / pagination.itemsPerPage)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  ›
                </button>
                <button
                  onClick={() => handlePageChange(Math.ceil(pagination.totalItems / pagination.itemsPerPage))}
                  disabled={pagination.currentPage === Math.ceil(pagination.totalItems / pagination.itemsPerPage)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  »
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      {editMode && currentResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Edit Student Result</h2>
                <button onClick={handleEditCancel} className="text-gray-500 hover:text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleEditSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Personal Information */}
  <div className="md:col-span-2 lg:col-span-3 border-b pb-4 mb-2">
    <h3 className="text-lg font-medium">Personal Information</h3>
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Student Name*</label>
    <input
      type="text"
      name="student_name"
      value={currentResult.student_name || ''}
      onChange={(e) => setCurrentResult({...currentResult, student_name: e.target.value})}
      className="w-full p-2 border rounded"
      required
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Father's Name</label>
    <input
      type="text"
      name="father_name"
      value={currentResult.father_name || ''}
      onChange={(e) => setCurrentResult({...currentResult, father_name: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Mother's Name</label>
    <input
      type="text"
      name="mother_name"
      value={currentResult.mother_name || ''}
      onChange={(e) => setCurrentResult({...currentResult, mother_name: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Guardian Phone</label>
    <input
      type="text"
      name="guardian_phone"
      value={currentResult.guardian_phone || ''}
      onChange={(e) => setCurrentResult({...currentResult, guardian_phone: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>

  {/* Academic Information */}
  <div className="md:col-span-2 lg:col-span-3 border-b pb-4 mb-2 mt-4">
    <h3 className="text-lg font-medium">Academic Information</h3>
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Roll Number*</label>
    <input
      type="number"
      name="roll"
      value={currentResult.roll || ''}
      onChange={(e) => setCurrentResult({...currentResult, roll: e.target.value})}
      className="w-full p-2 border rounded"
      required
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Class*</label>
    <input
      type="text"
      name="class"
      value={currentResult.class || ''}
      onChange={(e) => setCurrentResult({...currentResult, class: e.target.value})}
      className="w-full p-2 border rounded"
      required
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Section</label>
    <input
      type="text"
      name="section"
      value={currentResult.section || ''}
      onChange={(e) => setCurrentResult({...currentResult, section: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Group Name</label>
    <input
      type="text"
      name="group_name"
      value={currentResult.group_name || ''}
      onChange={(e) => setCurrentResult({...currentResult, group_name: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Exam Name</label>
    <input
      type="text"
      name="exam_name"
      value={currentResult.exam_name || ''}
      onChange={(e) => setCurrentResult({...currentResult, exam_name: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Year*</label>
    <input
      type="number"
      name="year"
      value={currentResult.year || ''}
      onChange={(e) => setCurrentResult({...currentResult, year: e.target.value})}
      className="w-full p-2 border rounded"
      required
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Session</label>
    <input
      type="text"
      name="session"
      value={currentResult.session || ''}
      onChange={(e) => setCurrentResult({...currentResult, session: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Publish Date</label>
    <input
      type="date"
      name="publish_date"
      value={currentResult.publish_date || ''}
      onChange={(e) => setCurrentResult({...currentResult, publish_date: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>

  {/* Result Summary */}
  <div className="md:col-span-2 lg:col-span-3 border-b pb-4 mb-2 mt-4">
    <h3 className="text-lg font-medium">Result Summary</h3>
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Merit Position</label>
    <input
      type="number"
      name="merit_position"
      value={currentResult.merit_position || ''}
      onChange={(e) => setCurrentResult({...currentResult, merit_position: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">GPA</label>
    <input
      type="number"
      step="0.01"
      name="gpa"
      value={currentResult.gpa || ''}
      onChange={(e) => setCurrentResult({...currentResult, gpa: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Failed Subjects (comma separated)</label>
    <input
      type="text"
      name="failed_subjects"
      value={currentResult.failed_subjects || ''}
      onChange={(e) => setCurrentResult({...currentResult, failed_subjects: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Remarks</label>
    <input
      type="text"
      name="remarks"
      value={currentResult.remarks || ''}
      onChange={(e) => setCurrentResult({...currentResult, remarks: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Total Marks</label>
    <input
      type="number"
      name="total_marks"
      value={currentResult.total_marks || ''}
      onChange={(e) => setCurrentResult({...currentResult, total_marks: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="space-y-2 flex items-center">
    <input
      type="checkbox"
      name="is_passed"
      checked={currentResult.is_passed || false}
      onChange={(e) => setCurrentResult({...currentResult, is_passed: e.target.checked})}
      className="mr-2"
    />
    <label className="block text-sm font-medium">Passed</label>
  </div>

  {/* Subject Marks - Bangla */}
  <div className="md:col-span-2 lg:col-span-3 border-b pb-4 mb-2 mt-4">
    <h3 className="text-lg font-medium">Bangla</h3>
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Bangla 1st Paper CQ</label>
    <input
      type="number"
      name="Bangla_1st_CQ"
      value={currentResult.Bangla_1st_CQ || ''}
      onChange={(e) => setCurrentResult({...currentResult, Bangla_1st_CQ: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Bangla 1st Paper MCQ</label>
    <input
      type="number"
      name="Bangla_1st_MCQ"
      value={currentResult.Bangla_1st_MCQ || ''}
      onChange={(e) => setCurrentResult({...currentResult, Bangla_1st_MCQ: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Bangla 2nd Paper CQ</label>
    <input
      type="number"
      name="Bangla_2nd_CQ"
      value={currentResult.Bangla_2nd_CQ || ''}
      onChange={(e) => setCurrentResult({...currentResult, Bangla_2nd_CQ: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Bangla 2nd Paper MCQ</label>
    <input
      type="number"
      name="Bangla_2nd_MCQ"
      value={currentResult.Bangla_2nd_MCQ || ''}
      onChange={(e) => setCurrentResult({...currentResult, Bangla_2nd_MCQ: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>

  {/* Subject Marks - English */}
  <div className="md:col-span-2 lg:col-span-3 border-b pb-4 mb-2 mt-4">
    <h3 className="text-lg font-medium">English</h3>
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">English 1st Paper CQ</label>
    <input
      type="number"
      name="English_1st_CQ"
      value={currentResult.English_1st_CQ || ''}
      onChange={(e) => setCurrentResult({...currentResult, English_1st_CQ: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">English 2nd Paper CQ</label>
    <input
      type="number"
      name="English_2nd_CQ"
      value={currentResult.English_2nd_CQ || ''}
      onChange={(e) => setCurrentResult({...currentResult, English_2nd_CQ: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>

  {/* Subject Marks - Mathematics */}
  <div className="md:col-span-2 lg:col-span-3 border-b pb-4 mb-2 mt-4">
    <h3 className="text-lg font-medium">Mathematics</h3>
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Mathematics CQ</label>
    <input
      type="number"
      name="Mathematics_CQ"
      value={currentResult.Mathematics_CQ || ''}
      onChange={(e) => setCurrentResult({...currentResult, Mathematics_CQ: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Mathematics MCQ</label>
    <input
      type="number"
      name="Mathematics_MCQ"
      value={currentResult.Mathematics_MCQ || ''}
      onChange={(e) => setCurrentResult({...currentResult, Mathematics_MCQ: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>

  {/* Subject Marks - Science */}
  <div className="md:col-span-2 lg:col-span-3 border-b pb-4 mb-2 mt-4">
    <h3 className="text-lg font-medium">Science</h3>
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Science CQ</label>
    <input
      type="number"
      name="Science_CQ"
      value={currentResult.Science_CQ || ''}
      onChange={(e) => setCurrentResult({...currentResult, Science_CQ: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Science MCQ</label>
    <input
      type="number"
      name="Science_MCQ"
      value={currentResult.Science_MCQ || ''}
      onChange={(e) => setCurrentResult({...currentResult, Science_MCQ: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>

  {/* Subject Marks - Physics */}
  <div className="md:col-span-2 lg:col-span-3 border-b pb-4 mb-2 mt-4">
    <h3 className="text-lg font-medium">Physics</h3>
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Physics CQ</label>
    <input
      type="number"
      name="Physics_CQ"
      value={currentResult.Physics_CQ || ''}
      onChange={(e) => setCurrentResult({...currentResult, Physics_CQ: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Physics MCQ</label>
    <input
      type="number"
      name="Physics_MCQ"
      value={currentResult.Physics_MCQ || ''}
      onChange={(e) => setCurrentResult({...currentResult, Physics_MCQ: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Physics Practical</label>
    <input
      type="number"
      name="Physics_Practical"
      value={currentResult.Physics_Practical || ''}
      onChange={(e) => setCurrentResult({...currentResult, Physics_Practical: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>

  {/* Subject Marks - Chemistry */}
  <div className="md:col-span-2 lg:col-span-3 border-b pb-4 mb-2 mt-4">
    <h3 className="text-lg font-medium">Chemistry</h3>
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Chemistry CQ</label>
    <input
      type="number"
      name="Chemistry_CQ"
      value={currentResult.Chemistry_CQ || ''}
      onChange={(e) => setCurrentResult({...currentResult, Chemistry_CQ: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Chemistry MCQ</label>
    <input
      type="number"
      name="Chemistry_MCQ"
      value={currentResult.Chemistry_MCQ || ''}
      onChange={(e) => setCurrentResult({...currentResult, Chemistry_MCQ: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Chemistry Practical</label>
    <input
      type="number"
      name="Chemistry_Practical"
      value={currentResult.Chemistry_Practical || ''}
      onChange={(e) => setCurrentResult({...currentResult, Chemistry_Practical: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>

  {/* Subject Marks - Biology */}
  <div className="md:col-span-2 lg:col-span-3 border-b pb-4 mb-2 mt-4">
    <h3 className="text-lg font-medium">Biology</h3>
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Biology CQ</label>
    <input
      type="number"
      name="Biology_CQ"
      value={currentResult.Biology_CQ || ''}
      onChange={(e) => setCurrentResult({...currentResult, Biology_CQ: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Biology MCQ</label>
    <input
      type="number"
      name="Biology_MCQ"
      value={currentResult.Biology_MCQ || ''}
      onChange={(e) => setCurrentResult({...currentResult, Biology_MCQ: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Biology Practical</label>
    <input
      type="number"
      name="Biology_Practical"
      value={currentResult.Biology_Practical || ''}
      onChange={(e) => setCurrentResult({...currentResult, Biology_Practical: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>

  {/* Subject Marks - Higher Mathematics */}
  <div className="md:col-span-2 lg:col-span-3 border-b pb-4 mb-2 mt-4">
    <h3 className="text-lg font-medium">Higher Mathematics</h3>
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Higher Math CQ</label>
    <input
      type="number"
      name="HigherMath_CQ"
      value={currentResult.HigherMath_CQ || ''}
      onChange={(e) => setCurrentResult({...currentResult, HigherMath_CQ: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Higher Math MCQ</label>
    <input
      type="number"
      name="HigherMath_MCQ"
      value={currentResult.HigherMath_MCQ || ''}
      onChange={(e) => setCurrentResult({...currentResult, HigherMath_MCQ: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Higher Math Practical</label>
    <input
      type="number"
      name="HigherMath_Practical"
      value={currentResult.HigherMath_Practical || ''}
      onChange={(e) => setCurrentResult({...currentResult, HigherMath_Practical: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>

  {/* Subject Marks - Accounting */}
  <div className="md:col-span-2 lg:col-span-3 border-b pb-4 mb-2 mt-4">
    <h3 className="text-lg font-medium">Accounting</h3>
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Accounting CQ</label>
    <input
      type="number"
      name="Accounting_CQ"
      value={currentResult.Accounting_CQ || ''}
      onChange={(e) => setCurrentResult({...currentResult, Accounting_CQ: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Accounting MCQ</label>
    <input
      type="number"
      name="Accounting_MCQ"
      value={currentResult.Accounting_MCQ || ''}
      onChange={(e) => setCurrentResult({...currentResult, Accounting_MCQ: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>

  {/* Subject Marks - Business Entrepreneurship */}
  <div className="md:col-span-2 lg:col-span-3 border-b pb-4 mb-2 mt-4">
    <h3 className="text-lg font-medium">Business Entrepreneurship</h3>
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Business Entrepreneurship CQ</label>
    <input
      type="number"
      name="BusinessEnt_CQ"
      value={currentResult.BusinessEnt_CQ || ''}
      onChange={(e) => setCurrentResult({...currentResult, BusinessEnt_CQ: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Business Entrepreneurship MCQ</label>
    <input
      type="number"
      name="BusinessEnt_MCQ"
      value={currentResult.BusinessEnt_MCQ || ''}
      onChange={(e) => setCurrentResult({...currentResult, BusinessEnt_MCQ: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>

  {/* Subject Marks - Finance */}
  <div className="md:col-span-2 lg:col-span-3 border-b pb-4 mb-2 mt-4">
    <h3 className="text-lg font-medium">Finance</h3>
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Finance CQ</label>
    <input
      type="number"
      name="Finance_CQ"
      value={currentResult.Finance_CQ || ''}
      onChange={(e) => setCurrentResult({...currentResult, Finance_CQ: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Finance MCQ</label>
    <input
      type="number"
      name="Finance_MCQ"
      value={currentResult.Finance_MCQ || ''}
      onChange={(e) => setCurrentResult({...currentResult, Finance_MCQ: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>

  {/* Subject Marks - History */}
  <div className="md:col-span-2 lg:col-span-3 border-b pb-4 mb-2 mt-4">
    <h3 className="text-lg font-medium">History</h3>
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">History CQ</label>
    <input
      type="number"
      name="History_CQ"
      value={currentResult.History_CQ || ''}
      onChange={(e) => setCurrentResult({...currentResult, History_CQ: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">History MCQ</label>
    <input
      type="number"
      name="History_MCQ"
      value={currentResult.History_MCQ || ''}
      onChange={(e) => setCurrentResult({...currentResult, History_MCQ: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>

  {/* Subject Marks - Civics */}
  <div className="md:col-span-2 lg:col-span-3 border-b pb-4 mb-2 mt-4">
    <h3 className="text-lg font-medium">Civics</h3>
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Civics CQ</label>
    <input
      type="number"
      name="Civics_CQ"
      value={currentResult.Civics_CQ || ''}
      onChange={(e) => setCurrentResult({...currentResult, Civics_CQ: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Civics MCQ</label>
    <input
      type="number"
      name="Civics_MCQ"
      value={currentResult.Civics_MCQ || ''}
      onChange={(e) => setCurrentResult({...currentResult, Civics_MCQ: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>

  {/* Subject Marks - Geography */}
  <div className="md:col-span-2 lg:col-span-3 border-b pb-4 mb-2 mt-4">
    <h3 className="text-lg font-medium">Geography</h3>
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Geography CQ</label>
    <input
      type="number"
      name="Geography_CQ"
      value={currentResult.Geography_CQ || ''}
      onChange={(e) => setCurrentResult({...currentResult, Geography_CQ: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Geography MCQ</label>
    <input
      type="number"
      name="Geography_MCQ"
      value={currentResult.Geography_MCQ || ''}
      onChange={(e) => setCurrentResult({...currentResult, Geography_MCQ: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Geography Practical</label>
    <input
      type="number"
      name="Geography_Practical"
      value={currentResult.Geography_Practical || ''}
      onChange={(e) => setCurrentResult({...currentResult, Geography_Practical: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>

  {/* Subject Marks - Economics */}
  <div className="md:col-span-2 lg:col-span-3 border-b pb-4 mb-2 mt-4">
    <h3 className="text-lg font-medium">Economics</h3>
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Economics CQ</label>
    <input
      type="number"
      name="Economics_CQ"
      value={currentResult.Economics_CQ || ''}
      onChange={(e) => setCurrentResult({...currentResult, Economics_CQ: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Economics MCQ</label>
    <input
      type="number"
      name="Economics_MCQ"
      value={currentResult.Economics_MCQ || ''}
      onChange={(e) => setCurrentResult({...currentResult, Economics_MCQ: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>

  {/* Subject Marks - BGS (Bangladesh & Global Studies) */}
  <div className="md:col-span-2 lg:col-span-3 border-b pb-4 mb-2 mt-4">
    <h3 className="text-lg font-medium">Bangladesh & Global Studies</h3>
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">BGS CQ</label>
    <input
      type="number"
      name="BGS_CQ"
      value={currentResult.BGS_CQ || ''}
      onChange={(e) => setCurrentResult({...currentResult, BGS_CQ: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">BGS MCQ</label>
    <input
      type="number"
      name="BGS_MCQ"
      value={currentResult.BGS_MCQ || ''}
      onChange={(e) => setCurrentResult({...currentResult, BGS_MCQ: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>

  {/* Subject Marks - ICT */}
  <div className="md:col-span-2 lg:col-span-3 border-b pb-4 mb-2 mt-4">
    <h3 className="text-lg font-medium">ICT (Information & Communication Technology)</h3>
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">ICT CQ</label>
    <input
      type="number"
      name="ICT_CQ"
      value={currentResult.ICT_CQ || ''}
      onChange={(e) => setCurrentResult({...currentResult, ICT_CQ: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">ICT MCQ</label>
    <input
      type="number"
      name="ICT_MCQ"
      value={currentResult.ICT_MCQ || ''}
      onChange={(e) => setCurrentResult({...currentResult, ICT_MCQ: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">ICT Practical</label>
    <input
      type="number"
      name="ICT_Practical"
      value={currentResult.ICT_Practical || ''}
      onChange={(e) => setCurrentResult({...currentResult, ICT_Practical: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>

  {/* Subject Marks - Religion */}
  <div className="md:col-span-2 lg:col-span-3 border-b pb-4 mb-2 mt-4">
    <h3 className="text-lg font-medium">Religion</h3>
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Religion Name</label>
    <input
      type="text"
      name="Religion_Name"
      value={currentResult.Religion_Name || ''}
      onChange={(e) => setCurrentResult({...currentResult, Religion_Name: e.target.value})}
      className="w-full p-2 border rounded"
      placeholder="e.g. Islam, Christianity, Buddhism, Hinduism"
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Religion CQ</label>
    <input
      type="number"
      name="Religion_CQ"
      value={currentResult.Religion_CQ || ''}
      onChange={(e) => setCurrentResult({...currentResult, Religion_CQ: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Religion MCQ</label>
    <input
      type="number"
      name="Religion_MCQ"
      value={currentResult.Religion_MCQ || ''}
      onChange={(e) => setCurrentResult({...currentResult, Religion_MCQ: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>

  {/* Optional Subject */}
  <div className="md:col-span-2 lg:col-span-3 border-b pb-4 mb-2 mt-4">
    <h3 className="text-lg font-medium">Optional Subject</h3>
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Optional Subject Name</label>
    <input
      type="text"
      name="Optional_Subject_Name"
      value={currentResult.Optional_Subject_Name || ''}
      onChange={(e) => setCurrentResult({...currentResult, Optional_Subject_Name: e.target.value})}
      className="w-full p-2 border rounded"
      placeholder="e.g. Arabic, Sanskrit, Music"
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Optional Subject CQ</label>
    <input
      type="number"
      name="Optional_CQ"
      value={currentResult.Optional_CQ || ''}
      onChange={(e) => setCurrentResult({...currentResult, Optional_CQ: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Optional Subject MCQ</label>
    <input
      type="number"
      name="Optional_MCQ"
      value={currentResult.Optional_MCQ || ''}
      onChange={(e) => setCurrentResult({...currentResult, Optional_MCQ: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Optional Subject Practical</label>
    <input
      type="number"
      name="Optional_Practical"
      value={currentResult.Optional_Practical || ''}
      onChange={(e) => setCurrentResult({...currentResult, Optional_Practical: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>

  {/* Continuous Assessment */}
  <div className="md:col-span-2 lg:col-span-3 border-b pb-4 mb-2 mt-4">
    <h3 className="text-lg font-medium">Continuous Assessment</h3>
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Continuous Assessment</label>
    <input
      type="number"
      name="continuous_assessment"
      value={currentResult.continuous_assessment || ''}
      onChange={(e) => setCurrentResult({...currentResult, continuous_assessment: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>

  {/* Additional Subjects */}
  <div className="md:col-span-2 lg:col-span-3 border-b pb-4 mb-2 mt-4">
    <h3 className="text-lg font-medium">Additional Subjects</h3>
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Arts & Crafts Assessment</label>
    <input
      type="number"
      name="ArtsCrafts_Assessment"
      value={currentResult.ArtsCrafts_Assessment || ''}
      onChange={(e) => setCurrentResult({...currentResult, ArtsCrafts_Assessment: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Physical Education Practical</label>
    <input
      type="number"
      name="PhysicalEd_Practical"
      value={currentResult.PhysicalEd_Practical || ''}
      onChange={(e) => setCurrentResult({...currentResult, PhysicalEd_Practical: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="space-y-2">
    <label className="block text-sm font-medium">Physical Education Assessment</label>
    <input
      type="number"
      name="PhysicalEd_Assessment"
      value={currentResult.PhysicalEd_Assessment || ''}
      onChange={(e) => setCurrentResult({...currentResult, PhysicalEd_Assessment: e.target.value})}
      className="w-full p-2 border rounded"
    />
  </div>

  {/* Form Actions */}
  <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-3 mt-6">
    <button
      type="button"
      onClick={handleEditCancel}
      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
    >
      Cancel
    </button>
    <button
      type="submit"
      disabled={loading}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? 'Saving...' : 'Save Changes'}
    </button>
  </div>
</form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentResultAdmin;