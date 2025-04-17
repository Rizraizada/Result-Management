import { useState, useEffect, useContext } from 'react';
import BASE_URL from '@/components/config/apiConfig';
import Swal from 'sweetalert2';
import { UserContext } from '@/context/UserContext';
import { useRouter } from 'next/router';

const ClassPage = () => {
  const [className, setClassName] = useState('');
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingClassId, setEditingClassId] = useState(null);

  const { user } = useContext(UserContext);
  const router = useRouter();

  // Redirect and authentication check
  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'headmaster') {
      router.push('/unauthorized');
    }
  }, [user, router]);

  // Fetch classes when user is authenticated
  useEffect(() => {
    if (user && user.role === 'headmaster') {
      fetchClasses();
    }
  }, [user]);

  // Fetch classes function
  const fetchClasses = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/classes`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to fetch classes');
      }

      const data = await response.json();
      setClasses(data);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Error fetching classes');
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Fetch Error',
        text: err.message
      });
    }
  };

  // Create class handler
  const handleCreateClass = async (e) => {
    e.preventDefault();
    
    // Input validation
    if (!className.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Class Name Required',
        text: 'Please enter a class name.',
      });
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/classes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ className: className.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create class');
      }

      Swal.fire({
        icon: 'success',
        title: 'Class Created',
        text: 'The class was created successfully!',
      });
      
      fetchClasses();
      setClassName('');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error Creating Class',
        text: err.message || 'An unknown error occurred.',
      });
    }
  };

  // Edit class handler
  const handleEditClass = (id, name) => {
    setEditingClassId(id);
    setClassName(name);
    setIsEditing(true);
  };

  // Update class handler
  const handleUpdateClass = async (e) => {
    e.preventDefault();
    
    if (!className.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Class Name Required',
        text: 'Please enter a class name before updating.',
      });
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/classes/${editingClassId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ className: className.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update class');
      }

      Swal.fire({
        icon: 'success',
        title: 'Class Updated',
        text: 'The class was updated successfully!',
      });

      fetchClasses();
      setClassName('');
      setIsEditing(false);
      setEditingClassId(null);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error Updating Class',
        text: err.message || 'An unknown error occurred.',
      });
    }
  };

  // Delete class handler
  const handleDeleteClass = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to delete this class?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        const response = await fetch(`${BASE_URL}/api/classes/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete class');
        }

        Swal.fire({
          icon: 'success',
          title: 'Class Deleted',
          text: 'The class was deleted successfully!',
        });
        fetchClasses();
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error Deleting Class',
        text: err.message || 'An unknown error occurred.',
      });
    }
  };

  // Loading and permission checks
  if (loading) return <p>Loading...</p>;

  if (!user || user.role !== 'headmaster') {
    return <p>You do not have permission to access this page.</p>;
  }

  // Render the component
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Class Management</h1>

      {/* Create or Edit Class Form */}
      <form 
        onSubmit={isEditing ? handleUpdateClass : handleCreateClass} 
        className="mb-6"
      >
        <div className="mb-4">
          <label htmlFor="className" className="block text-sm font-medium">
            Class Name
          </label>
          <input
            type="text"
            id="className"
            name="className"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="mt-1 px-4 py-2 border rounded w-full"
            placeholder="Enter class name"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {isEditing ? 'Update Class' : 'Create Class'}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setClassName('');
              setEditingClassId(null);
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Display error */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Class Table */}
      <h2 className="text-xl font-semibold mb-4">All Classes</h2>
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border px-4 py-2">Class Name</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((classItem) => (
            <tr key={classItem.id}>
              <td className="border px-4 py-2">{classItem.className}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEditClass(classItem.id, classItem.className)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mr-2"
                  aria-label={`Edit class ${classItem.className}`}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClass(classItem.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  aria-label={`Delete class ${classItem.className}`}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClassPage;