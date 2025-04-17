import { useState, useEffect, useContext } from "react";
import BASE_URL from "@/components/config/apiConfig";
import { useRouter } from "next/router";
import { UserContext } from "@/context/UserContext";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function QuickAttendancePage() {
  const [teacherSections, setTeacherSections] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedSection, setSelectedSection] = useState("");
  const [maleCount, setMaleCount] = useState(0);
  const [femaleCount, setFemaleCount] = useState(0);
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // 'YYYY-MM-DD'
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(UserContext);
  const router = useRouter();

  // Redirect if not logged in or unauthorized role
  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (user.role !== "headmaster" && user.role !== "teacher") {
      router.push("/unauthorized");
    }
  }, [user, router]);

  // Fetch teacher's sections and attendance records on load
  useEffect(() => {
    if (user && user.id) {
      fetchTeacherSections();
      fetchAttendanceRecords();
    }
  }, [user]);

  // Fetch sections for the teacher
  const fetchTeacherSections = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/api/teacher-sections/${user.id}/sections`
      );
      const data = await response.json();
      setTeacherSections(data);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to fetch sections",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all quick attendance records
  const fetchAttendanceRecords = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/quickattendance/quick`);
      const data = await response.json();
  
      if (Array.isArray(data)) {
        setAttendanceRecords(data); // Set state if response is an array
      } else {
        console.error("Unexpected API response format:", data);
        setAttendanceRecords([]); // Default to an empty array
      }
    } catch (err) {
      console.error("Error fetching attendance records:", err);
      setAttendanceRecords([]); // Default to an empty array on error
    }
  };
  

  // Check if attendance is already recorded for the selected section and date
  const isDuplicateAttendance = () => {
    if (!Array.isArray(attendanceRecords)) {
      console.error("attendanceRecords is not an array:", attendanceRecords);
      return false;
    }
  
    return attendanceRecords.some(
      (record) =>
        record.section_id === selectedSection &&
        record.attendance_date === attendanceDate
    );
  };
  

  // Handle Quick Attendance submission
  const submitQuickAttendance = async () => {
    setIsLoading(true);
    try {
      if (!user || !user.id) throw new Error("User not logged in");
      if (!selectedSection) throw new Error("No section selected");
      if (maleCount === 0 && femaleCount === 0)
        throw new Error("Please enter valid male and female counts");

      // Check for duplicate attendance
      if (isDuplicateAttendance()) {
        throw new Error(
          "Attendance for this section and date has already been recorded."
        );
      }

      const attendanceData = {
        sectionId: selectedSection,
        attendanceDate: attendanceDate,
        maleCount: maleCount,
        femaleCount: femaleCount,
        recordedBy: user.id,
      };

      // Send attendance data to API
      const response = await fetch(`${BASE_URL}/api/quickattendance/quick`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(attendanceData),
      });

      if (!response.ok) {
        // Parse the response body to get the error message if not ok
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to submit quick attendance"
        );
      }

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Quick attendance recorded successfully",
      });

      // Reload the attendance records after successful submission
      fetchAttendanceRecords();
    } catch (err) {
      // Display error message using SweetAlert2
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };
  const filteredAttendanceRecords = () => {
    if (!Array.isArray(attendanceRecords)) return [];
    return attendanceRecords.filter(
      (record) =>
        !searchQuery ||
        record.sectionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.attendance_date.includes(searchQuery) ||
        record.teacher_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  
  

  const paginatedRecords = filteredAttendanceRecords().slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const totalPages = Math.ceil(
    filteredAttendanceRecords().length / recordsPerPage
  );

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-6">
            Quick Attendance Form
          </h2>

          {/* Form Layout with Two Fields per Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="section"
                className="block text-lg font-semibold mb-2"
              >
                Select Section
              </label>
              <select
                id="section"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">--Select Section--</option>
                {teacherSections.map((section) => (
                  <option key={section.section_id} value={section.section_id}>
                    {section.sectionName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="attendanceDate"
                className="block text-lg font-semibold mb-2"
              >
                Attendance Date
              </label>
              <input
                type="date"
                id="attendanceDate"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label
                htmlFor="maleCount"
                className="block text-lg font-semibold mb-2"
              >
                Male Count
              </label>
              <input
                type="number"
                id="maleCount"
                value={maleCount}
                onChange={(e) => setMaleCount(e.target.value)}
                min="0"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter male count"
              />
            </div>

            <div>
              <label
                htmlFor="femaleCount"
                className="block text-lg font-semibold mb-2"
              >
                Female Count
              </label>
              <input
                type="number"
                id="femaleCount"
                value={femaleCount}
                onChange={(e) => setFemaleCount(e.target.value)}
                min="0"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter female count"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-4">
            <button
              onClick={submitQuickAttendance}
              disabled={isLoading}
              className={`${
                isLoading ? "bg-gray-400" : "bg-blue-600"
              } text-white px-6 py-2 rounded-md`}
            >
              {isLoading ? "Submitting..." : "Submit Attendance"}
            </button>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="mt-8 bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Attendance Records</h3>
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Search by any field"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md"
            />
          </div>

          {paginatedRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 border">Section</th>
                    <th className="px-4 py-2 border">Attendance Date</th>
                    <th className="px-4 py-2 border">Male Count</th>
                    <th className="px-4 py-2 border">Female Count</th>
                    <th className="px-4 py-2 border">Recorded By</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">{record.sectionName}</td>
                      <td className="px-4 py-2 border">
                        {new Date(record.attendance_date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 border">{record.male_count}</td>
                      <td className="px-4 py-2 border">{record.female_count}</td>
                      <td className="px-4 py-2 border">{record.teacher_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No attendance records found.</p>
          )}

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 rounded-md"
            >
              Previous
            </button>
            <span className="text-lg font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 rounded-md"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
