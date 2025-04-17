import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import BASE_URL from "@/components/config/apiConfig";
import { UserContext } from "@/context/UserContext";

const TeacherList = () => {
  const [students, setstudents] = useState([]);
  const [filteredstudents, setFilteredstudents] = useState([]);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(5);
  const router = useRouter();
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (user.role !== "headmaster" && user.role !== "teacher") {
      router.push("/unauthorized");
    } else {
      fetchstudents();
    }
  }, [user, router]);
  

  const fetchstudents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}/api/students/students`);
      const data = await response.json();

      if (response.ok) {
        const formattedstudents = (Array.isArray(data) ? data : data.students || []).map(teacher => ({
          ...teacher,
          id: teacher._id || teacher.id
        }));
        setstudents(formattedstudents);
        setFilteredstudents(formattedstudents);
      } else {
        setMessage({ type: "error", text: data.message || "Failed to fetch students" });
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      setMessage({ type: "error", text: "Failed to fetch students" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const filtered = students.filter(teacher =>
      teacher.name.toLowerCase().includes(event.target.value.toLowerCase()) ||
      teacher.email.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredstudents(filtered);
    setCurrentPage(1);
  };

  const handleEdit = (teacherId) => {
    router.push(`/admin/students/TeacherLis?id=${teacherId}`);
  };

  const handleDelete = async (studentId) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/students/students/${studentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Teacher deleted successfully" });
        fetchstudents();
      } else {
        const data = await response.json();
        setMessage({ type: "error", text: data.message || "Failed to delete teacher" });
      }
    } catch (error) {
      console.error("Error deleting teacher:", error);
      setMessage({ type: "error", text: "Failed to delete teacher" });
    }
  };

  const handleAddNew = () => {
    router.push("/admin/teacher/add-teacher");
  };

  // Pagination logic
  const indexOfLastTeacher = currentPage * studentsPerPage;
  const indexOfFirstTeacher = indexOfLastTeacher - studentsPerPage;
  const currentstudents = filteredstudents.slice(indexOfFirstTeacher, indexOfLastTeacher);
  const totalPages = Math.ceil(filteredstudents.length / studentsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-[1200px] mx-auto mt-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={handleAddNew}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          Add New Teacher
        </button>
        <input
          type="text"
          placeholder="Search students..."
          value={searchTerm}
          onChange={handleSearch}
          className="p-2 rounded-md border border-gray-300"
        />
      </div>

      {message && (
        <div
          className={`p-4 rounded-md mb-4 cursor-pointer ${
            message.type === "error" 
              ? "bg-red-100 text-red-700 border border-red-200" 
              : "bg-green-100 text-green-700 border border-green-200"
          }`}
          onClick={() => setMessage(null)}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="text-center py-8 text-gray-600">Loading...</div>
        ) : (
          <table className="min-w-full text-sm table-auto">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-4">Profile</th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Position</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Gender</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentstudents.length > 0 ? (
                currentstudents.map((teacher) => (
                  <tr key={teacher.id} className="border-t hover:bg-gray-50">
                    <td className="p-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
                        {teacher.image ? (
                          <img
                            src={`${BASE_URL}/${teacher.image}`}
                            alt={teacher.name}
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "";
                            }}
                          />
                        ) : (
                          <span className="text-white font-bold text-lg">
                            {teacher.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">{teacher.name}</td>
                    <td className="p-4">{teacher.email}</td>
                    <td className="p-4">{teacher.position}</td>
                    <td className="p-4">{teacher.phone}</td>
                    <td className="p-4 capitalize">{teacher.gender}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(teacher.id)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(teacher.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-600">
                    No students available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center px-4 py-3 mt-4">
        <div className="text-sm text-slate-500">
          Showing <b>{indexOfFirstTeacher + 1}-{Math.min(indexOfLastTeacher, filteredstudents.length)}</b> of{' '}
          {filteredstudents.length}
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`px-3 py-1 min-w-9 min-h-9 text-sm font-normal ${
                currentPage === index + 1
                  ? 'text-white bg-slate-800 border-slate-800 hover:bg-slate-600 hover:border-slate-600'
                  : 'text-slate-500 bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-400'
              } rounded transition duration-200 ease`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherList;