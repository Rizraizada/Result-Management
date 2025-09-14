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
  const [absentStudentIds, setAbsentStudentIds] = useState("");
  const [maleCount, setMaleCount] = useState(0);
  const [totalMale, setTotalMale] = useState(0);
  const [totalFemale, setTotalFemale] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [femaleCount, setFemaleCount] = useState(0);
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (user.role !== "headmaster" && user.role !== "teacher") {
      router.push("/unauthorized");
    }
  }, [user, router]);

  useEffect(() => {
    if (user && user.id) {
      fetchTeacherSections();
      fetchAttendanceRecords();
    }
  }, [user]);

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

  const fetchAttendanceRecords = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/quickattendance/quick`);
      const json = await response.json();
      if (Array.isArray(json.data)) {
        setAttendanceRecords(json.data);
      } else {
        console.error("Unexpected API response format:", json);
        setAttendanceRecords([]);
      }
    } catch (err) {
      console.error("Error fetching attendance records:", err);
      setAttendanceRecords([]);
    }
  };

  const isDuplicateAttendance = () => {
    if (!Array.isArray(attendanceRecords)) {
      console.error("attendanceRecords is not an array:", attendanceRecords);
      return false;
    }

    return attendanceRecords.some((record) => {
      const recordDate = new Date(record.attendance_date)
        .toISOString()
        .split("T")[0];
      return record.section_id == selectedSection && recordDate === attendanceDate;
    });
  };

  const submitQuickAttendance = async () => {
    setIsLoading(true);
    try {
      if (!user || !user.id) throw new Error("User not logged in");
      if (!selectedSection) throw new Error("No section selected");
      if (maleCount === 0 && femaleCount === 0)
        throw new Error("Please enter valid male and female counts");

      if (isDuplicateAttendance()) {
        throw new Error(
          "Attendance for this section and date has already been recorded."
        );
      }

      const attendanceData = {
        sectionId: selectedSection,
        attendanceDate: attendanceDate,
        maleCount: Number(maleCount),
        totalmale: Number(totalMale),
        totalfemale: Number(totalFemale),
        totalstudents: Number(totalStudents),
        femaleCount: Number(femaleCount),
        recordedBy: user.id,
        absentStudentIds: absentStudentIds || null,
      };

      const response = await fetch(`${BASE_URL}/api/quickattendance/quick`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(attendanceData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit quick attendance");
      }

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Quick attendance recorded successfully",
      });

      setSelectedSection("");
      setMaleCount(0);
      setFemaleCount(0);
      setTotalMale(0);
      setTotalFemale(0);
      setTotalStudents(0);
      setAttendanceDate(new Date().toISOString().split("T")[0]);
      setAbsentStudentIds("");

      fetchAttendanceRecords();
    } catch (err) {
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

  const totalPages = Math.ceil(filteredAttendanceRecords().length / recordsPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-3 sm:py-8 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Quick Attendance Form */}
        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 mb-6 sm:mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-800">
            Quick Attendance Form
          </h2>

          {/* Form Fields */}
          <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
            {/* Section Selector */}
            <div className="sm:col-span-2 lg:col-span-1">
              <label
                htmlFor="section"
                className="block text-sm sm:text-lg font-semibold mb-2 text-gray-700"
              >
                Select Section
              </label>
              <select
                id="section"
                value={selectedSection}
                onChange={(e) => {
    const sectionId = e.target.value;
    setSelectedSection(sectionId);
    const selected = teacherSections.find(
      (s) => String(s.section_id) === sectionId
    );
    if (selected) {
      setTotalMale(selected.total_male ?? 0);
      setTotalFemale(selected.total_female ?? 0);
      setTotalStudents(selected.total_students ?? 0);
    } else {
      setTotalMale(0);
      setTotalFemale(0);
      setTotalStudents(0);
    }
}}
                className="w-full p-3 sm:p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-white"
              >
                <option value="">--Select Section--</option>
                {teacherSections.map((section) => (
                  <option key={section.section_id} value={section.section_id}>
                    {section.sectionName}
                  </option>
                ))}
              </select>
            </div>

            {/* Attendance Date */}
            <div className="sm:col-span-2 lg:col-span-1">
              <label
                htmlFor="attendanceDate"
                className="block text-sm sm:text-lg font-semibold mb-2 text-gray-700"
              >
                Attendance Date
              </label>
              <input
                type="date"
                id="attendanceDate"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="w-full p-3 sm:p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm"
              />
            </div>

            {/* Present Counts Row */}
            <div className="sm:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Male Present */}
                <div>
                  <label
                    htmlFor="maleCount"
                    className="block text-sm sm:text-lg font-semibold mb-2 text-gray-700"
                  >
                    Male Present
                  </label>
                  <input
                    type="number"
                    id="maleCount"
                    value={maleCount}
                    onChange={(e) => setMaleCount(e.target.value)}
                    min="0"
                    className="w-full p-3 sm:p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm"
                    placeholder="Enter male count"
                  />
                </div>

                {/* Female Present */}
                <div>
                  <label
                    htmlFor="femaleCount"
                    className="block text-sm sm:text-lg font-semibold mb-2 text-gray-700"
                  >
                    Female Present
                  </label>
                  <input
                    type="number"
                    id="femaleCount"
                    value={femaleCount}
                    onChange={(e) => setFemaleCount(e.target.value)}
                    min="0"
                    className="w-full p-3 sm:p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm"
                    placeholder="Enter female count"
                  />
                </div>
              </div>
            </div>

            {/* Total Counts Row */}
            <div className="sm:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Total Male */}
                <div>
                  <label
                    htmlFor="totalMale"
                    className="block text-sm sm:text-lg font-semibold mb-2 text-gray-700"
                  >
                    Total Male
                  </label>
                  <input
                    type="number"
                    id="totalMale"
                    value={totalMale}
                    readOnly
                    className="w-full p-3 sm:p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 text-base sm:text-sm"
                    placeholder="Total Male"
                  />
                </div>

                {/* Total Female */}
                <div>
                  <label
                    htmlFor="totalFemale"
                    className="block text-sm sm:text-lg font-semibold mb-2 text-gray-700"
                  >
                    Total Female
                  </label>
                  <input
                    type="number"
                    id="totalFemale"
                    value={totalFemale}
                    readOnly
                    className="w-full p-3 sm:p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 text-base sm:text-sm"
                    placeholder="Total Female"
                  />
                </div>

                {/* Total Students */}
                <div>
                  <label
                    htmlFor="totalStudents"
                    className="block text-sm sm:text-lg font-semibold mb-2 text-gray-700"
                  >
                    Total Students
                  </label>
                  <input
                    type="number"
                    id="totalStudents"
                    value={totalStudents}
                    readOnly
                    className="w-full p-3 sm:p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 text-base sm:text-sm"
                    placeholder="Total Students"
                  />
                </div>
              </div>
            </div>

            {/* Absent Student IDs */}
            <div className="sm:col-span-2">
              <label
                htmlFor="absentStudentIds"
                className="block text-sm sm:text-lg font-semibold mb-2 text-gray-700"
              >
                Absent Student IDs (comma separated)
              </label>
              <input
                type="text"
                id="absentStudentIds"
                value={absentStudentIds}
                onChange={(e) => setAbsentStudentIds(e.target.value)}
                className="w-full p-3 sm:p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm"
                placeholder="e.g., 123, 456, 789"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              onClick={submitQuickAttendance}
              disabled={isLoading}
              className={`${
                isLoading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
              } text-white px-6 py-3 rounded-md w-full transition-colors duration-200 font-medium text-base sm:text-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              {isLoading ? "Submitting..." : "Submit Attendance"}
            </button>
          </div>
        </div>

        {/* Attendance Records */}
        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-800">
            Attendance Records
          </h3>

          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by section, date, or teacher name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 sm:p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm"
            />
          </div>

          {/* Records Display - Responsive Table */}
          {paginatedRecords.length > 0 ? (
            <div className="overflow-x-auto border border-gray-300 rounded-lg">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-300 text-left font-semibold text-gray-700 text-xs sm:text-sm">
                      Section
                    </th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-300 text-left font-semibold text-gray-700 text-xs sm:text-sm">
                      Date
                    </th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-300 text-left font-semibold text-gray-700 text-xs sm:text-sm">
                      M Present
                    </th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-300 text-left font-semibold text-gray-700 text-xs sm:text-sm">
                      F Present
                    </th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-300 text-left font-semibold text-gray-700 text-xs sm:text-sm hidden sm:table-cell">
                      Total M
                    </th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-300 text-left font-semibold text-gray-700 text-xs sm:text-sm hidden sm:table-cell">
                      Total F
                    </th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-300 text-left font-semibold text-gray-700 text-xs sm:text-sm">
                      Total
                    </th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-300 text-left font-semibold text-gray-700 text-xs sm:text-sm hidden md:table-cell">
                      Recorded By
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {paginatedRecords.map((record, index) => (
                    <tr key={record.id} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-200 text-xs sm:text-sm text-gray-800">
                        {record.sectionName}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-200 text-xs sm:text-sm text-gray-800">
                        {new Date(record.attendance_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: '2-digit'
                        })}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-200 text-xs sm:text-sm text-gray-800 text-center">
                        {record.male_count}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-200 text-xs sm:text-sm text-gray-800 text-center">
                        {record.female_count}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-200 text-xs sm:text-sm text-gray-600 text-center hidden sm:table-cell">
                        {record.total_male}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-200 text-xs sm:text-sm text-gray-600 text-center hidden sm:table-cell">
                        {record.total_female}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-200 text-xs sm:text-sm text-gray-800 text-center font-medium">
                        {record.total_students}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 border-b border-gray-200 text-xs sm:text-sm text-gray-600 hidden md:table-cell">
                        {record.teacher_name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 border border-gray-200 rounded-lg bg-gray-50">
              <p className="text-gray-500 text-base">No attendance records found.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 flex-wrap gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
              >
                Previous
              </button>
              <span className="text-sm sm:text-lg font-medium text-gray-700 px-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}