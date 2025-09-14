import { useState, useEffect, useContext } from "react";
import BASE_URL from "@/components/config/apiConfig";
import { useRouter } from "next/router";
import { UserContext } from "@/context/UserContext";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function AttendancePage() {
  const [teacherSections, setTeacherSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [sectionData, setSectionData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
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

  const fetchSectionStudents = async (sectionId) => {
    setIsLoading(true);
    try {
      const studentsResponse = await fetch(
        `${BASE_URL}/api/students/sections/${sectionId}/students`
      );
      const studentsData = await studentsResponse.json();

      const attendanceResponse = await fetch(
        `${BASE_URL}/api/attendance/sections/${sectionId}/attendance`
      );
      const attendanceData = (await attendanceResponse.json()) || [];

      const studentsWithAttendance = studentsData.map((student) => ({
        studentId: student.id,
        studentName: student.name,
        status:
          attendanceData.find((att) => att.student_id === student.id)?.status ||
          "present",
        remarks:
          attendanceData.find((att) => att.student_id === student.id)
            ?.remarks || "",
      }));

      setSectionData((prevData) => ({
        ...prevData,
        [sectionId]: {
          students: studentsWithAttendance,
          attendance: studentsWithAttendance,
        },
      }));

      setSelectedSection(sectionId);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch students or attendance",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setSectionData((prevData) => {
      const updatedAttendance = prevData[selectedSection].attendance.map(
        (record) =>
          record.studentId === studentId ? { ...record, status } : record
      );
      return {
        ...prevData,
        [selectedSection]: {
          ...prevData[selectedSection],
          attendance: updatedAttendance,
        },
      };
    });
  };

  const handleRemarksChange = (studentId, remarks) => {
    setSectionData((prevData) => {
      const updatedAttendance = prevData[selectedSection].attendance.map(
        (record) =>
          record.studentId === studentId ? { ...record, remarks } : record
      );
      return {
        ...prevData,
        [selectedSection]: {
          ...prevData[selectedSection],
          attendance: updatedAttendance,
        },
      };
    });
  };

  const submitAttendance = async () => {
    setIsLoading(true);
    try {
      if (!user || !user.id) throw new Error("User not logged in");

      const attendanceRecords = sectionData[selectedSection].attendance.map(
        (student) => ({
          studentId: student.studentId,
          attendanceDate: date,
          status: student.status,
          recordedBy: user.id, // Use logged-in user's ID
          remarks: student.remarks || null,
        })
      );

      const response = await fetch(`${BASE_URL}/api/attendance/bulk-record`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attendanceData: attendanceRecords }),
      });

      if (!response.ok) throw new Error("Failed to submit attendance");

      setSummary({
        totalStudents: sectionData[selectedSection].students.length,
        present: sectionData[selectedSection].attendance.filter(
          (record) => record.status === "present"
        ).length,
        absent: sectionData[selectedSection].attendance.filter(
          (record) => record.status === "absent"
        ).length,
        late: sectionData[selectedSection].attendance.filter(
          (record) => record.status === "late"
        ).length,
        excused: sectionData[selectedSection].attendance.filter(
          (record) => record.status === "excused"
        ).length,
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Attendance recorded successfully",
      });
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

  const getStatusStyles = (status) => {
    const baseStyles =
      "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";
    switch (status) {
      case "present":
        return `${baseStyles} bg-green-100 text-green-800`;
      case "absent":
        return `${baseStyles} bg-red-100 text-red-800`;
      case "late":
        return `${baseStyles} bg-yellow-100 text-yellow-800`;
      case "excused":
        return `${baseStyles} bg-blue-100 text-blue-800`;
      default:
        return `${baseStyles} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Date Selector */}
        <div className="flex items-center mb-8">
          <div className="bg-white rounded-lg shadow-lg p-4 w-72">
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-2 text-center"
            >
              Select Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Sections */}
          {teacherSections.map((section) => (
            <div
              key={section.id}
              onClick={() => fetchSectionStudents(section.section_id)}
              className={`p-6 rounded-xl shadow-lg cursor-pointer transform hover:scale-105 transition duration-300
                ${
                  selectedSection === section.id
                    ? "bg-blue-50 border-2 border-blue-500"
                    : "bg-white hover:bg-gray-50 border border-gray-200"
                }`}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {section.className} - {section.sectionName}
              </h3>
              <div className="flex items-center space-x-2">
                <p className="text-gray-700 text-sm">
                  {section.studentsCount} Students
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Students */}
        {selectedSection && sectionData[selectedSection] && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Students</h2>
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-left">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {sectionData[selectedSection].students.map((student) => (
                    <tr key={student.studentId}>
                      <td className="border-t px-4 py-2">
                        {student.studentName}
                      </td>
                      <td className="border-t px-4 py-2">
                        <div className="status-checkbox-group">
                          {[
                            { value: "present", label: "Present" },
                            { value: "absent", label: "Absent" },
                            { value: "late", label: "Late" },
                            { value: "excused", label: "Excused" },
                          ].map((option) => (
                            <label
                              key={option.value}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                checked={student.status === option.value}
                                onChange={() =>
                                  handleStatusChange(
                                    student.studentId,
                                    option.value
                                  )
                                }
                                className={`rounded-md focus:ring-2 ${getStatusStyles(
                                  student.status
                                )}`}
                              />
                              <span>{option.label}</span>
                            </label>
                          ))}
                        </div>
                      </td>

                      <td className="border-t px-4 py-2">
                        <input
                          type="text"
                          value={student.remarks}
                          onChange={(e) =>
                            handleRemarksChange(
                              student.studentId,
                              e.target.value
                            )
                          }
                          placeholder="Add remarks..."
                          className="w-full border border-gray-300 rounded-md shadow-sm px-2 py-1 focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={submitAttendance}
                disabled={isLoading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700 transition duration-200"
              >
                {isLoading ? "Saving..." : "Submit Attendance"}
              </button>
            </div>
          </div>
        )}

        {/* Summary */}
        {summary && (
          <div className="bg-green-50 border border-green-200 rounded-xl shadow-lg p-6 mt-6">
            <h3 className="text-xl font-bold text-green-800 mb-4">Summary</h3>
            <p>Total Students: {summary.totalStudents}</p>
            <p>Present: {summary.present}</p>
            <p>Absent: {summary.absent}</p>
            <p>Late: {summary.late}</p>
            <p>Excused: {summary.excused}</p>
          </div>
        )}
      </div>
    </div>
  );
}
