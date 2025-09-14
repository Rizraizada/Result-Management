import { useState, useEffect, useContext } from 'react'; // Import useContext
import { useRouter } from 'next/router'; // Import useRouter
import BASE_URL from '@/components/config/apiConfig';
import { UserContext } from "@/context/UserContext";

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

  const { user, loading: userLoading } = useContext(UserContext); // Use useContext to get user and userLoading
  const router = useRouter(); // Initialize useRouter

  // --- Start of Fix ---

  // Redirect if user is not authorized or user data is still loading
  useEffect(() => {
    if (!userLoading) { // Only run this effect after user data has loaded
      if (!user || user.role !== "headmaster") {
        // Redirect to unauthorized page or login, or show an access denied message
        router.push("/unauthorized"); // Assuming you have an /unauthorized page
      }
    }
  }, [user, userLoading, router]); // Add userLoading and router to dependencies

  // --- End of Fix ---

  useEffect(() => {
    const fetchData = async () => {
      // Only fetch data if user is a headmaster and not currently loading user data
      if (!userLoading && user && user.role === "headmaster") {
        try {
          const [usersRes, sectionsRes] = await Promise.all([
            fetch(`${BASE_URL}/api/auth/users`, { credentials: 'include' }),
            fetch(`${BASE_URL}/api/sections`, { credentials: 'include' }),
          ]);

          const userData = await usersRes.json();
          const sectionsData = await sectionsRes.json();

          if (usersRes.ok && sectionsRes.ok) {
            setUsers(Array.isArray(userData.users) ? userData.users : []);
            setSections(Array.isArray(sectionsData) ? sectionsData : []);

            const allAssignments = await Promise.all(
              (userData.users || []).map(async (u) => { // Changed 'user' to 'u' to avoid conflict with global 'user'
                const response = await fetch(`${BASE_URL}/api/teacher-sections/${u.id}/sections`, {
                  credentials: 'include',
                });
                const userSections = response.ok ? await response.json() : [];
                return {
                  userId: u.id,
                  username: u.username,
                  assignedSections: Array.isArray(userSections) ? userSections : [],
                };
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
      } else if (!userLoading && (!user || user.role !== "headmaster")) {
        // If user is not headmaster, stop loading and potentially show access denied immediately
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, userLoading]); // Re-run effect when user or userLoading changes

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
      const method = editingSection ? 'PUT' : 'POST';
      const url = editingSection
        ? `${BASE_URL}/api/teacher-sections/${editingSection.id}`
        : `${BASE_URL}/api/teacher-sections`;

      const response = await fetch(url, {
        method,
        credentials: 'include',
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

      // Refresh assignments for the specific user
      const updatedRes = await fetch(`${BASE_URL}/api/teacher-sections/${selectedUser}/sections`, {
        credentials: 'include',
      });
      const updatedSections = updatedRes.ok ? await updatedRes.json() : [];

      setUserAssignments((prev) =>
        prev.map((u) => // Changed 'user' to 'u' here
          u.userId === selectedUser
            ? {
                ...u,
                assignedSections: Array.isArray(updatedSections) ? updatedSections : [],
              }
            : u
        )
      );

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
    setEditingSection(section);
  };

  const handleDeleteSection = async (userId, sectionId) => {
    if (!confirm('Are you sure you want to remove this section assignment?')) return;

    try {
      const response = await fetch(`${BASE_URL}/api/teacher-sections/${sectionId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to delete section');
      const result = await response.json();
      setSuccessMessage(result.message);

      // Refresh assignments for the specific user
      const updatedRes = await fetch(`${BASE_URL}/api/teacher-sections/${userId}/sections`, {
        credentials: 'include',
      });
      const updatedSections = updatedRes.ok ? await updatedRes.json() : [];

      setUserAssignments((prev) =>
        prev.map((u) => // Changed 'user' to 'u' here
          u.userId === userId
            ? {
                ...u,
                assignedSections: Array.isArray(updatedSections) ? updatedSections : [],
              }
            : u
        )
      );

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Error deleting section: ' + err.message);
    }
  };

  // Conditional rendering based on user loading and role
  if (userLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent"></div>
        <p className="ml-4 text-xl">Loading user data...</p>
      </div>
    );
  }

  // --- Start of Fix ---
  if (!user || user.role !== "headmaster") {
    return <div className="text-center text-red-600 mt-10">Access Denied. You must be a Headmaster to view this page.</div>;
  }
  // --- End of Fix ---

  // Once authorization check passes and data is loaded
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent"></div>
        <p className="ml-4 text-xl">Loading assignments...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">
          {editingSection ? 'Edit Section Assignment' : 'Assign Section to User'}
        </h2>
        <form onSubmit={handleAssignSection}>
          <div className="grid grid-cols-2 gap-4">
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
                {users.map((u) => ( // Changed 'user' to 'u'
                  <option key={u.id} value={u.id}>
                    {u.username}
                  </option>
                ))}
              </select>
            </div>

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

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full bg-blue-600 text-white p-2 rounded"
          >
            {isSubmitting ? 'Saving...' : editingSection ? 'Update Section' : 'Assign Section'}
          </button>
        </form>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4">All User Section Assignments</h3>
        {userAssignments.length === 0 ? (
          <p>No assignments available</p>
        ) : (
          <table className="w-full border-collapse bg-gray-50">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border-b text-left">User</th> {/* Added User column */}
                <th className="px-4 py-2 border-b text-left">Section Name</th>
                <th className="px-4 py-2 border-b text-left">Primary</th>
                <th className="px-4 py-2 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userAssignments.map((userAssign) =>
                (userAssign.assignedSections || []).map((section, index) => (
                  <tr
                    key={`${userAssign.userId}-${section.id}`}
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} border-t`}
                  >
                    <td className="px-4 py-2">{userAssign.username}</td> {/* Display username */}
                    <td className="px-4 py-2">{section.sectionName}</td>
                    <td className="px-4 py-2">{section.isPrimary ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-2 space-x-3">
                      <button
                        onClick={() => handleEditSection(userAssign.userId, section)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSection(userAssign.userId, section.id)}
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