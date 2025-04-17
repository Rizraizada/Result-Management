import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '@/context/UserContext';
import { useRouter } from 'next/router';
import BASE_URL from '@/components/config/apiConfig';
import Swal from 'sweetalert2';

// Centralized API helper
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

// Custom hook for fetching classes
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

// Custom hook for fetching sections
const useSections = (user) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSections = () => {
    setLoading(true);
    apiCall('/api/sections')
      .then(setSections)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user?.role === 'headmaster') fetchSections();
  }, [user]);

  return { sections, fetchSections, loading, error };
};

// Error banner component
const ErrorBanner = ({ message }) => (
  <div className="text-red-500 p-4 border border-red-500 rounded">{message}</div>
);

const SectionPage = () => {
  const [sectionName, setSectionName] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState(null);

  const { user } = useContext(UserContext);
  const router = useRouter();

  const { classes, loading: classesLoading, error: classesError } = useClasses(user);
  const { sections, fetchSections, loading: sectionsLoading, error: sectionsError } = useSections(user);

  // Redirect unauthorized users
  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'headmaster') {
      router.push('/unauthorized');
    }
  }, [user, router]);

  // Create or update section
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sectionName.trim() || !selectedClassId) {
      Swal.fire({ icon: 'warning', title: 'Input Required', text: 'Please enter all fields.' });
      return;
    }

    try {
      const url = isEditing ? `/api/sections/${editingSectionId}` : '/api/sections';
      const method = isEditing ? 'PUT' : 'POST';

      await apiCall(url, method, { sectionName, classId: selectedClassId });
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

  // Edit section handler
  const handleEditSection = (section) => {
    setSectionName(section.sectionName);
    setSelectedClassId(section.classId);
    setIsEditing(true);
    setEditingSectionId(section.id);
  };

  // Delete section handler
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

  // Reset form
  const resetForm = () => {
    setSectionName('');
    setSelectedClassId('');
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

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label htmlFor="sectionName" className="block text-sm font-medium">
            Section Name
          </label>
          <input
            id="sectionName"
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
            placeholder="Enter section name"
            className="mt-1 px-4 py-2 border rounded w-full"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="classId" className="block text-sm font-medium">
            Select Class
          </label>
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

        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          {isEditing ? 'Update Section' : 'Create Section'}
        </button>
        <button type="button" onClick={resetForm} className="ml-2 px-4 py-2 bg-gray-300 text-black rounded">
          Reset
        </button>
      </form>

      {/* Section Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border">
          <thead>
            <tr>
              <th className="border px-4 py-2">Section Name</th>
              <th className="border px-4 py-2">Class</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((section) => (
              <tr key={section.id}>
                <td className="border px-4 py-2">{section.sectionName}</td>
                <td className="border px-4 py-2">{section.className || 'N/A'}</td>
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
    </div>
  );
};

export default SectionPage;
