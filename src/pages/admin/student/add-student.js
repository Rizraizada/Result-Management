import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import BASE_URL from "@/components/config/apiConfig";
import { UserContext } from "@/context/UserContext";
import {
  Upload,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Briefcase,
  Image,
} from "lucide-react";

const AddStudent = () => {
  const [formData, setFormData] = useState({
    user_id: "",
    section_id: "",
    name: "",
    phone: "",
    address: "",
    position: "",
    email: "",
    gender: "",
    expertise: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { user } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (user.role !== "headmaster" && user.role !== "teacher") {
      router.push("/unauthorized");
    }
  }, [user, router]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/auth/users`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
        } else {
          setMessage({ type: "error", text: "Failed to fetch users" });
        }
      } catch (error) {
        setMessage({ type: "error", text: error.message });
      }
    };

    const fetchSections = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/sections`);
        const data = await res.json();
        if (res.ok) {
          setSections(data);
        } else {
          setMessage({ type: "error", text: "Failed to fetch sections" });
        }
      } catch (error) {
        console.log("Error fetching sections:", error);
        setMessage({ type: "error", text: error.message });
      }
    };

    fetchUsers();
    fetchSections();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({
          type: "error",
          text: "Image size should be less than 5MB",
        });
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== "") {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch(`${BASE_URL}/api/students/students`, {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Student added successfully",
        });
        setTimeout(() => {
          router.push("/admin/student/student-list");
        }, 1500);
      } else {
        throw new Error(data.message || "Failed to save Student");
      }
    } catch (error) {
      console.error("Error saving Student:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to save Student",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg shadow-sm ${
              message.type === "error"
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-green-50 text-green-700 border border-green-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
          <div className="px-6 py-8 bg-gradient-to-r from-blue-600 to-gray-700">
            <h2 className="text-3xl font-bold text-white">Add New Student</h2>
            <p className="mt-2 text-blue-100">Create a new Student profile</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="user_id"
                  className="text-sm font-medium text-gray-700"
                >
                  Assign Teacher
                </label>
                <select
                  id="user_id"
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleInputChange}
                  className="mt-2 w-full p-3 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Select Teacher</option>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.full_name}
                      </option>
                    ))
                  ) : (
                    <option>Loading...</option>
                  )}
                </select>
              </div>

              <div>
                <label
                  htmlFor="section_id"
                  className="text-sm font-medium text-gray-700"
                >
                  Section
                </label>
                <select
                  id="section_id"
                  name="section_id"
                  value={formData.section_id}
                  onChange={handleInputChange}
                  className="mt-2 w-full p-3 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Select Section</option>
                  {sections.length > 0 ? (
                    sections.map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.sectionName}
                      </option>
                    ))
                  ) : (
                    <option>No sections available</option>
                  )}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-2 w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-2 w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-gray-700"
                >
                  Phone
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-2 w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="position"
                  className="text-sm font-medium text-gray-700"
                >
                  Father Name
                </label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="mt-2 w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="expertise"
                  className="text-sm font-medium text-gray-700"
                >
                  Mother Name
                </label>
                <input
                  type="text"
                  id="expertise"
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleInputChange}
                  className="mt-2 w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label
                  htmlFor="gender"
                  className="text-sm font-medium text-gray-700"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="mt-2 w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="address"
                className="text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="mt-2 w-full p-3 border border-gray-300 rounded-lg"
                rows="3"
              ></textarea>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Profile Picture
              </label>
              <label className="w-full max-w-sm h-52 border-2 border-dashed border-gray-300 rounded-md cursor-pointer flex items-center justify-center transition-colors hover:border-gray-400">
                    <div className="text-center text-gray-400">
                      <svg
                        className="w-8 h-8 mx-auto"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4m4-5l5-5 5 5m-5-5v12" />
                      </svg>
                      <span>Click to upload image</span>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleImagePreview}
                      accept="image/*"
                    />
                  </label>

                  {imagePreview && (
                    <div className="w-full max-w-sm rounded-md overflow-hidden">
                      <img src={imagePreview} alt="Preview" className="w-full h-52 object-cover" />
                    </div>
                  )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg"
            >
              {isSubmitting ? "Adding..." : "Add Student"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStudent;
