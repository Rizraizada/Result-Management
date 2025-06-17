import React, { useState, useEffect, useContext } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import BASE_URL from "@/components/config/apiConfig";
import { useRouter } from "next/router";
import { UserContext } from "@/context/UserContext";

// Dynamically import ReactQuill to prevent SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const NoticePage = () => {
  const { user } = useContext(UserContext);
  const router = useRouter();

  const [notices, setNotices] = useState([]);
  const [newNotice, setNewNotice] = useState({
    title: "",
    date: "",
    content: "",
    badge: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [editNoticeId, setEditNoticeId] = useState(null);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (user.role !== "headmaster") {
      router.push("/unauthorized");
    }
  }, [user]);

  useEffect(() => {
    if (user && user.role === "headmaster") {
      fetchNotices();
    }
  }, [user]);

  const fetchNotices = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/notices`);
      const data = await response.json();
      setNotices(data);
    } catch (error) {
      console.error("Error fetching notices:", error);
      setMessage({ type: "error", text: "Failed to fetch notices" });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNotice({ ...newNotice, [name]: value });
  };

  const handleContentChange = (value) => {
    setNewNotice({ ...newNotice, content: value });
  };

  const handleAddNotice = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/notices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNotice),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage({ type: "success", text: data.message });
        fetchNotices();
        setNewNotice({ title: "", date: "", content: "", badge: "" });
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (error) {
      console.error("Error adding notice:", error);
      setMessage({ type: "error", text: "Failed to add notice" });
    }
  };

  const handleUpdateNotice = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/notices/${editNoticeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNotice),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage({ type: "success", text: data.message });
        fetchNotices();
        setEditMode(false);
        setNewNotice({ title: "", date: "", content: "", badge: "" });
        setEditNoticeId(null);
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (error) {
      console.error("Error updating notice:", error);
      setMessage({ type: "error", text: "Failed to update notice" });
    }
  };

  const handleDeleteNotice = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/api/notices/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (response.ok) {
        setMessage({ type: "success", text: data.message });
        fetchNotices();
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (error) {
      console.error("Error deleting notice:", error);
      setMessage({ type: "error", text: "Failed to delete notice" });
    }
  };

  const startEditMode = (notice) => {
    setEditMode(true);
    setNewNotice(notice);
    setEditNoticeId(notice.id);
  };

  const filteredNotices = notices.filter((notice) =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentNotices = filteredNotices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    user &&
    user.role === "headmaster" && (
      <div className="flex-1 mx-12">
        <div className="container max-w-5xl">
          {message && (
            <div
              className={`p-4 mb-6 font-medium rounded-lg ${
                message.type === "error"
                  ? "bg-red-200 text-red-800"
                  : "bg-green-200 text-green-800"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="bg-white shadow p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-4">Add or Edit Notice</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                editMode ? handleUpdateNotice() : handleAddNotice();
              }}
            >
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={newNotice.title}
                  onChange={handleInputChange}
                  className="block w-full p-2 border rounded"
                  required
                />
                <input
                  type="date"
                  name="date"
                  value={newNotice.date}
                  onChange={handleInputChange}
                  className="block w-full p-2 border rounded"
                  required
                />
              </div>
              <ReactQuill
                value={newNotice.content}
                onChange={handleContentChange}
                className="mb-4"
              />
              <input
                type="text"
                name="badge"
                placeholder="Badge"
                value={newNotice.badge}
                onChange={handleInputChange}
                className="block w-full p-2 border rounded mb-4"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {editMode ? "Update Notice" : "Add Notice"}
              </button>
            </form>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by Title"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full p-2 border rounded"
            />
          </div>

          <table className="w-full border-collapse border">
            <thead>
              <tr>
                <th className="border px-4 py-2">Title</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Badge</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentNotices.map((notice) => (
                <tr key={notice.id}>
                  <td className="border px-4 py-2">{notice.title}</td>
                  <td className="border px-4 py-2">{notice.date}</td>
                  <td className="border px-4 py-2">{notice.badge}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => startEditMode(notice)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteNotice(notice.id)}
                      className="px-2 py-1 bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={`px-4 py-2 bg-gray-300 text-gray-800 rounded ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {currentPage} of{" "}
              {Math.ceil(filteredNotices.length / itemsPerPage)}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(
                    prev + 1,
                    Math.ceil(filteredNotices.length / itemsPerPage)
                  )
                )
              }
              className={`px-4 py-2 bg-gray-300 text-gray-800 rounded ${
                currentPage === Math.ceil(filteredNotices.length / itemsPerPage)
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={
                currentPage === Math.ceil(filteredNotices.length / itemsPerPage)
              }
            >
              Next
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default NoticePage;
