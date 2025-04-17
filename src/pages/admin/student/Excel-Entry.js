import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import BASE_URL from "@/components/config/apiConfig";
import { UserContext } from "@/context/UserContext";
import Swal from "sweetalert2"; // Import SweetAlert2

const ExcelEntry = () => {
  const [excelFile, setExcelFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { user } = useContext(UserContext);

  // Redirect if user is not logged in or has insufficient privileges
  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (user.role !== "headmaster" && user.role !== "teacher") {
      router.push("/unauthorized");
    }
  }, [user, router]);

  // Handle file changes for image and excel files
  const handleFileChange = (e) => {
    if (e.target.name === "excelFile") {
      setExcelFile(e.target.files[0]);
    } else {
      setImageFile(e.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!excelFile && !imageFile) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please upload an Excel file or an image.",
      });
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    if (imageFile) {
      formData.append("image", imageFile);
    }
    if (excelFile) {
      formData.append("excelFile", excelFile);
    }

    try {
      const response = await fetch(`${BASE_URL}/api/students/students/excel`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const result = await response.json();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: result.message,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
          <div className="px-6 py-8 bg-gradient-to-r from-blue-600 to-blue-700">
            <h2 className="text-3xl font-bold text-white">Upload Image or Excel File</h2>
            <p className="mt-2 text-blue-100">Upload an Excel file to add multiple students or an image</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-white shadow-md rounded-lg">
            {/* Excel File Input */}
            <div className="flex flex-col">
              <label htmlFor="excelFile" className="text-sm font-medium text-gray-700">Excel File</label>
              <input
                type="file"
                id="excelFile"
                name="excelFile"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="mt-2 w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Image File Input */}
            <div className="flex flex-col">
              <label htmlFor="image" className="text-sm font-medium text-gray-700">Image File (optional)</label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-2 w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`mt-4 w-full py-2 px-4 rounded-md ${isSubmitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"} text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              {isSubmitting ? "Uploading..." : "Upload Students"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExcelEntry;
