import React, { useState, useEffect } from "react";
import BASE_URL from "@/components/config/apiConfig";
import Image from "next/image";
import Swal from "sweetalert2";  // Import SweetAlert2

const TeacherList = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // For search functionality
  const [filteredUsers, setFilteredUsers] = useState([]); // For filtered user list
  const [currentPage, setCurrentPage] = useState(1); // Pagination control
  const itemsPerPage = 5; // Number of items per page

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${BASE_URL}/api/auth/users`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch user list");
        }

        const data = await response.json();
        setUsers(data.users);
        setFilteredUsers(data.users); // Initialize filtered users with all users
      } catch (err) {
        setError(err.message);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search term
    const results = users.filter((user) =>
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(results);
    setCurrentPage(1); // Reset to first page on search
  }, [searchTerm, users]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

  const startEditing = (user) => {
    setEditingUser({ ...user });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setEditingUser((prev) => ({ ...prev, imageFile: file }));
  };

  const submitUserUpdate = async () => {
    try {
      const formData = new FormData();
  
      Object.keys(editingUser).forEach((key) => {
        if (key !== "imageFile" && key !== "image") {
          formData.append(key, editingUser[key]);
        }
      });
  
      if (editingUser.imageFile) {
        formData.append("image", editingUser.imageFile);
      }
  
      const response = await fetch(
        `${BASE_URL}/api/auth/edit/${editingUser.id}`,
        {
          method: "PUT",
          credentials: "include", // Include cookies in the request
          body: formData,
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user");
      }
  
      const updatedUsers = users.map((user) =>
        user.id === editingUser.id ? editingUser : user
      );
      setUsers(updatedUsers);
      setEditingUser(null);
  
      // SweetAlert2 success notification
      Swal.fire({
        icon: "success",
        title: "User Updated!",
        text: "The user information has been updated successfully.",
      });
    } catch (err) {
      setError(err.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.message,
      });
    }
  };
  

  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/delete/${userId}`, {
        method: "DELETE",
        credentials: "include", // Include cookies in the request
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete user");
      }
  
      // Remove the deleted user from the list
      setUsers(users.filter((user) => user.id !== userId));
  
      // SweetAlert2 success notification for delete
      Swal.fire({
        icon: "success",
        title: "User Deleted!",
        text: "The user has been successfully deleted.",
      });
    } catch (err) {
      setError(err.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.message,
      });
    }
  };
  

  if (loading) return <p className="text-center py-4">Loading...</p>;
  if (error) return <p className="text-red-500 text-center py-4">{error}</p>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Teacher List</h1>
      <div className="w-[200px]">
        <input
          className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
          placeholder="Search teachers..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Image</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <React.Fragment key={user.id}>
              <tr className="hover:bg-gray-50">
                <td className="border px-4 py-2 text-center">
                  {user.image ? (
                    <Image
                      src={`${BASE_URL}/uploads/${user.image}`}
                      alt={user.full_name || "User Profile"}
                      width={50}
                      height={50}
                      className="rounded-full mx-auto"
                      unoptimized // Optional: use if having issues with optimization
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto"></div>
                  )}
                </td>
                <td className="border px-4 py-2">{user.full_name}</td>
                <td className="border px-4 py-2">{user.role}</td>
                <td className="border px-4 py-2 flex space-x-2 justify-center">
                  <button
                    onClick={() => startEditing(user)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
              {editingUser && editingUser.id === user.id && (
                <tr>
                  <td colSpan="6" className="border p-4 bg-gray-50">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        "username",
                        "role",
                        "full_name",
                        "phone",
                        "gender",
                        "expertise",
                        "address",
                        "position",
                        "description",
                        "plain_password",
                      ].map((field) => (
                        <div key={field}>
                          <label className="block mb-2">{field}</label>
                          <input
                            type="text"
                            name={field}
                            value={editingUser[field] || ""}
                            onChange={handleInputChange}
                            className="w-full border rounded p-2"
                          />
                        </div>
                      ))}
                      <div>
                        <label className="block mb-2">Profile Image</label>
                        <input
                          type="file"
                          name="image"
                          onChange={handleFileChange}
                          className="w-full border rounded p-2"
                        />
                      </div>
                      <div className="col-span-2 flex justify-end space-x-2">
                        <button
                          onClick={submitUserUpdate}
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditingUser(null)}
                          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center px-4 py-3 mt-4">
        <div className="text-sm text-slate-500">
          Showing <b>{indexOfFirst + 1}-{Math.min(indexOfLast, filteredUsers.length)}</b> of{" "}
          {filteredUsers.length}
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease"
          >
            Prev
          </button>
          {Array.from({ length: Math.ceil(filteredUsers.length / itemsPerPage) }, (_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`px-3 py-1 min-w-9 min-h-9 text-sm font-normal ${
                currentPage === index + 1
                  ? "text-white bg-slate-800 border-slate-800 hover:bg-slate-600 hover:border-slate-600"
                  : "text-slate-500 bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-400"
              } rounded transition duration-200 ease`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage * itemsPerPage >= filteredUsers.length}
            className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherList;
