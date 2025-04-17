import React, { useState, useEffect, useContext } from "react";
import BASE_URL from "@/components/config/apiConfig";
import AdminLayout from "@/components/AdminLayout/AdminLayout";
import { useRouter } from "next/router";
import { UserContext } from "@/context/UserContext";

const SliderPage = () => {
  const [sliders, setSliders] = useState([]);
  const [message, setMessage] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editImageId, setEditImageId] = useState(null);

  const { user } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (user.role !== "headmaster") {
      router.push("/unauthorized");
    }
  }, [user]);

  useEffect(() => {
    if (user && user.role === "headmaster") {
      fetchSliderImages();
    }
  }, [user]);

  const fetchSliderImages = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/slider/sliders`);
      const data = await response.json();
      const sliderUrls = data.map((slider) => ({
        id: slider.id,
        image: `${BASE_URL}${slider.image}`,
      }));
      setSliders(sliderUrls);
    } catch (error) {
      console.error("Error fetching slider images:", error);
      setMessage({ type: "error", text: "Failed to fetch slider images" });
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!newImage) {
      setMessage({ type: "error", text: "Please select an image to upload" });
      return;
    }
    const formData = new FormData();
    formData.append("image", newImage);

    try {
      const response = await fetch(`${BASE_URL}/api/slider/sliders`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setMessage({ type: "success", text: data.message });
        fetchSliderImages();
        setNewImage(null);
        setImagePreview(null);
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (error) {
      console.error("Error uploading slider image:", error);
      setMessage({ type: "error", text: "Failed to upload slider image" });
    }
  };

  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    setNewImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    if (!newImage || editImageId === null) {
      setMessage({ type: "error", text: "Please select an image to update" });
      return;
    }
    const formData = new FormData();
    formData.append("image", newImage);
    formData.append("id", editImageId);

    try {
      const response = await fetch(`${BASE_URL}/api/slider/sliders`, {
        method: "PUT",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setMessage({ type: "success", text: data.message });
        fetchSliderImages();
        setNewImage(null);
        setImagePreview(null);
        setEditMode(false);
        setEditImageId(null);
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (error) {
      console.error("Error updating slider image:", error);
      setMessage({ type: "error", text: "Failed to update slider image" });
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/api/slider/sliders/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (response.ok) {
        setMessage({ type: "success", text: data.message });
        fetchSliderImages();
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (error) {
      console.error("Error deleting slider image:", error);
      setMessage({ type: "error", text: "Failed to delete slider image" });
    }
  };

  return (
    user &&
    user.role === "headmaster" && (
      // <AdminLayout>
        <div className="flex-1 mx-12">
          <div className="container max-w-5xl">
            {message && (
              <div
                className={`p-4 mb-6 font-medium rounded-lg ${
                  message.type === "error" ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="grid gap-6">
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-xl font-semibold">
                    {editMode ? "Edit Slider Image" : "Add New Slider Image"}
                  </h2>
                  <p className="text-gray-500">
                    {editMode
                      ? "Update the selected slider image"
                      : "Upload a new image to the slider"}
                  </p>
                </div>
                <div className="p-6 flex flex-col items-center gap-4">
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

                  <button
                    className="w-full max-w-sm bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition"
                    onClick={editMode ? handleUpdate : handleImageUpload}
                  >
                    {editMode ? "Update Image" : "Add Image"}
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-xl font-semibold">Slider Images</h2>
                  <p className="text-gray-500">Manage your existing slider images</p>
                </div>
                <div className="p-6 overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="p-4 bg-gray-50 border-b text-left text-gray-800 font-semibold">Image ID</th>
                        <th className="p-4 bg-gray-50 border-b text-left text-gray-800 font-semibold">Preview</th>
                        <th className="p-4 bg-gray-50 border-b text-left text-gray-800 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sliders.map((slider) => (
                        <tr key={slider.id} className="border-b">
                          <td className="p-4">#{slider.id}</td>
                          <td className="p-4">
                            <img
                              alt={`Slider ${slider.id}`}
                              src={slider.image}
                              className="w-40 h-24 object-cover rounded"
                            />
                          </td>
                          <td className="p-4 flex space-x-4">
                            <button
                              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                              onClick={() => {
                                setEditMode(true);
                                setEditImageId(slider.id);
                                setImagePreview(slider.image);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="px-4 py-2 bg-red-200 text-red-800 rounded hover:bg-red-300"
                              onClick={() => handleDelete(slider.id)}
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
            </div>
          </div>
        </div>
      // </AdminLayout>
    )
  );
};

export default SliderPage;
