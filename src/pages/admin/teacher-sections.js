import { useState, useEffect } from 'react';
import BASE_URL from '@/components/config/apiConfig';

export default function UserSectionsPage() {
  const [users, setUsers] = useState([]);
  const [sections, setSections] = useState([]);
  const [userAssignments, setUserAssignments] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [newSection, setNewSection] = useState({ sectionId: '', isPrimary: false });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingSection, setEditingSection] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, sectionsRes] = await Promise.all([
          fetch(`${BASE_URL}/api/auth/users`),
          fetch(`${BASE_URL}/api/sections`),
        ]);

        const userData = await usersRes.json();
        const sectionsData = await sectionsRes.json();

        if (usersRes.ok && sectionsRes.ok) {
          setUsers(userData.users);
          setSections(sectionsData);

          // Fetch assignments for all users
          const allAssignments = await Promise.all(
            userData.users.map(async (user) => {
              const response = await fetch(`${BASE_URL}/api/teacher-sections/${user.id}/sections`);
              const userSections = response.ok ? await response.json() : [];
              return { userId: user.id, username: user.name, assignedSections: userSections };
            })
          );

          setUserAssignments(allAssignments);
        } else {
          setError('Failed to fetch initial data');
        }
      } catch (error) {
        setError('Error loading data: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
  };

  const handleSectionChange = (e) => {
    setSelectedSection(e.target.value);
  };

  const handleAssignSection = async (e) => {
    e.preventDefault();
    if (!selectedUser || !selectedSection) {
      setError('Please select both user and section');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const method = editingSection ? 'PUT' : 'POST'; // Determine the method based on edit mode
      const url = editingSection
        ? `${BASE_URL}/api/teacher-sections/${editingSection.id}` // URL for editing
        : `${BASE_URL}/api/teacher-sections`; // URL for assigning a new section

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: selectedUser,
          sectionId: selectedSection,
          isPrimary: newSection.isPrimary,
        }),
      });

      if (!response.ok) throw new Error('Failed to assign/update section');

      const result = await response.json();
      setSuccessMessage(result.message);

      const updatedRes = await fetch(`${BASE_URL}/api/teacher-sections/${selectedUser}/sections`);
      const updatedSections = updatedRes.ok ? await updatedRes.json() : [];

      setUserAssignments((prev) =>
        prev.map((user) =>
          user.userId === selectedUser
            ? { ...user, assignedSections: updatedSections }
            : user
        )
      );

      // Reset the form
      setSelectedSection('');
      setNewSection({ sectionId: '', isPrimary: false });
      setEditingSection(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Error assigning/updating section: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSection = (userId, section) => {
    setSelectedUser(userId);
    setSelectedSection(section.id);
    setNewSection({ sectionId: section.id, isPrimary: section.isPrimary });
    setEditingSection(section);  // Set section for editing
  };

  const handleDeleteSection = async (userId, sectionId) => {
    if (!confirm('Are you sure you want to remove this section assignment?')) return;

    try {
      const response = await fetch(`${BASE_URL}/api/teacher-sections/${sectionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete section');

      const result = await response.json();
      setSuccessMessage(result.message);

      // Fetch updated assignments for the user
      const updatedRes = await fetch(`${BASE_URL}/api/teacher-sections/${userId}/sections`);
      const updatedSections = updatedRes.ok ? await updatedRes.json() : [];

      // Update the userAssignments state
      setUserAssignments((prev) =>
        prev.map((user) =>
          user.userId === userId
            ? { ...user, assignedSections: updatedSections }
            : user
        )
      );

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Error deleting section: ' + err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Error and success message */}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}

      {/* User and Section Assignment Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">
          {editingSection ? 'Edit Section Assignment' : 'Assign Section to User'}
        </h2>
        <form onSubmit={handleAssignSection}>
          <div className="grid grid-cols-2 gap-4">
            {/* User Select */}
            <div>
              <label htmlFor="user-select" className="block text-lg font-semibold">
                Select User:
              </label>
              <select
                id="user-select"
                value={selectedUser}
                onChange={handleUserChange}
                className="w-full p-2 border border-gray-300 mt-2"
              >
                <option value="">Choose a user...</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>

            {/* Section Select */}
            <div>
              <label htmlFor="section-select" className="block text-lg font-semibold">
                Select Section:
              </label>
              <select
                id="section-select"
                value={selectedSection}
                onChange={handleSectionChange}
                className="w-full p-2 border border-gray-300 mt-2"
              >
                <option value="">Choose a section...</option>
                {sections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.sectionName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Primary Section Checkbox */}
          <div className="mt-4 flex items-center">
            <input
              type="checkbox"
              id="isPrimary"
              checked={newSection.isPrimary}
              onChange={(e) => setNewSection({ ...newSection, isPrimary: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="isPrimary">Set as primary section</label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full bg-blue-600 text-white p-2 rounded"
          >
            {isSubmitting ? 'Saving...' : editingSection ? 'Update Section' : 'Assign Section'}
          </button>
        </form>
      </div>

      {/* All User Assignments Table */}
      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4">All User Section Assignments</h3>
        {userAssignments.length === 0 ? (
          <p>No assignments available</p>
        ) : (
          <table className="w-full border-collapse bg-gray-50">
            <thead className="bg-gray-200">
              <tr>
                 <th className="px-4 py-2 border-b text-left">Section Name</th>
                <th className="px-4 py-2 border-b text-left">Primary</th>
                <th className="px-4 py-2 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userAssignments.map((user) =>
                user.assignedSections.map((section, index) => (
                  <tr
                    key={`${user.userId}-${section.id}`}
                    className={`${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                    } border-t`}
                  >
                     <td className="px-4 py-2">{section.sectionName}</td>
                    <td className="px-4 py-2">{section.isPrimary ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-2 space-x-3">
                      <button
                        onClick={() => handleEditSection(user.userId, section)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSection(user.userId, section.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
