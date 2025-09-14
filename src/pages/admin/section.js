import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '@/context/UserContext';
import { useRouter } from 'next/router';
import BASE_URL from '@/components/config/apiConfig';
import Swal from 'sweetalert2';

// API Helper
const apiCall = async (url, method = 'GET', body = null) => {
  const headers = {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
  };

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${BASE_URL}${url}`, options);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Something went wrong');
  }
  return response.json();
};

// Custom Hooks
const useClasses = (user) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role === 'headmaster') {
      apiCall('/api/classes')
        .then(setClasses)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [user]);

  return { classes, loading, error };
};

const useSections = (user, page = 1, limit = 5) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSections = () => {
    setLoading(true);
    apiCall(`/api/sections?page=${page}&limit=${limit}`)
      .then(setSections)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user?.role === 'headmaster') fetchSections();
  }, [user, page]);

  return { sections, fetchSections, loading, error };
};

const ErrorBanner = ({ message }) => (
  <div className="text-red-500 p-4 border border-red-500 rounded">{message}</div>
);

const SectionPage = () => {
  const [sectionName, setSectionName] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [totalMale, setTotalMale] = useState('');
  const [totalFemale, setTotalFemale] = useState('');
  const [totalStudents, setTotalStudents] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState(null);

  const [page, setPage] = useState(1);
  const limit = 5;

  const { user } = useContext(UserContext);
  const router = useRouter();

  const { classes, loading: classesLoading, error: classesError } = useClasses(user);
  const { sections, fetchSections, loading: sectionsLoading, error: sectionsError } = useSections(user, page, limit);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'headmaster') {
      router.push('/unauthorized');
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sectionName.trim() || !selectedClassId) {
      Swal.fire({ icon: 'warning', title: 'Input Required', text: 'Please enter all fields.' });
      return;
    }

    try {
      const url = isEditing ? `/api/sections/${editingSectionId}` : '/api/sections';
      const method = isEditing ? 'PUT' : 'POST';

      await apiCall(url, method, {
        sectionName,
        classId: selectedClassId,
        total_male: Number(totalMale),
        total_female: Number(totalFemale),
        total_students: Number(totalStudents),
      });

      Swal.fire({
        icon: 'success',
        title: isEditing ? 'Section Updated' : 'Section Created',
        text: `Section ${isEditing ? 'updated' : 'created'} successfully!`,
      });

      fetchSections();
      resetForm();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message });
    }
  };

  const handleEditSection = (section) => {
    setSectionName(section.sectionName);
    setSelectedClassId(section.classId);
    setTotalMale(section.total_male || '');
    setTotalFemale(section.total_female || '');
    setTotalStudents(section.total_students || '');
    setIsEditing(true);
    setEditingSectionId(section.id);
  };

  const handleDeleteSection = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
      });

      if (result.isConfirmed) {
        await apiCall(`/api/sections/${id}`, 'DELETE');
        Swal.fire({ icon: 'success', title: 'Deleted', text: 'Section deleted successfully!' });
        fetchSections();
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message });
    }
  };

  const resetForm = () => {
    setSectionName('');
    setSelectedClassId('');
    setTotalMale('');
    setTotalFemale('');
    setTotalStudents('');
    setIsEditing(false);
    setEditingSectionId(null);
  };

  if (sectionsLoading || classesLoading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Section Management</h1>

      {sectionsError && <ErrorBanner message={sectionsError} />}
      {classesError && <ErrorBanner message={classesError} />}

      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="sectionName" className="block text-sm font-medium">Section Name</label>
          <input
            id="sectionName"
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
            placeholder="Enter section name"
            className="mt-1 px-4 py-2 border rounded w-full"
          />
        </div>

        <div>
          <label htmlFor="classId" className="block text-sm font-medium">Select Class</label>
          <select
            id="classId"
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="mt-1 px-4 py-2 border rounded w-full"
          >
            <option value="">-- Select Class --</option>
            {classes.map((classItem) => (
              <option key={classItem.id} value={classItem.id}>
                {classItem.className}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="totalMale" className="block text-sm font-medium">Total Male</label>
          <input
            type="number"
            id="totalMale"
            value={totalMale}
            onChange={(e) => setTotalMale(e.target.value)}
            placeholder="Enter total male students"
            className="mt-1 px-4 py-2 border rounded w-full"
          />
        </div>

        <div>
          <label htmlFor="totalFemale" className="block text-sm font-medium">Total Female</label>
          <input
            type="number"
            id="totalFemale"
            value={totalFemale}
            onChange={(e) => setTotalFemale(e.target.value)}
            placeholder="Enter total female students"
            className="mt-1 px-4 py-2 border rounded w-full"
          />
        </div>

        <div>
          <label htmlFor="totalStudents" className="block text-sm font-medium">Total Students</label>
          <input
            type="number"
            id="totalStudents"
            value={totalStudents}
            onChange={(e) => setTotalStudents(e.target.value)}
            placeholder="Enter total students"
            className="mt-1 px-4 py-2 border rounded w-full"
          />
        </div>

        <div className="flex items-end gap-2">
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
            {isEditing ? 'Update Section' : 'Create Section'}
          </button>
          <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-300 text-black rounded">
            Reset
          </button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border">
          <thead>
            <tr>
              <th className="border px-4 py-2">Section Name</th>
              <th className="border px-4 py-2">Class</th>
              <th className="border px-4 py-2">Male</th>
              <th className="border px-4 py-2">Female</th>
              <th className="border px-4 py-2">Total</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((section) => (
              <tr key={section.id}>
                <td className="border px-4 py-2">{section.sectionName}</td>
                <td className="border px-4 py-2">{section.className || 'N/A'}</td>
                <td className="border px-4 py-2">{section.total_male ?? '0'}</td>
                <td className="border px-4 py-2">{section.total_female ?? '0'}</td>
                <td className="border px-4 py-2">{section.total_students ?? '0'}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleEditSection(section)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSection(section.id)}
                    className="ml-2 px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SectionPage;
