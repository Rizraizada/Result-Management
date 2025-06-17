import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '@/context/UserContext';
import BASE_URL from '@/components/config/apiConfig';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { AttendancePDF } from '/utility/quickattendencePage';

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const router = useRouter();

  const [sections, setSections] = useState([]);
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sectionId, setSectionId] = useState('');
  const [classId, setClassId] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [attendanceReport, setAttendanceReport] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'headmaster') {
      router.push('/unauthorized');
    } else {
      fetchSections();
      fetchUsers();
      fetchClasses();
    }
  }, [user]);

  const fetchSections = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/sections`);
      const data = await response.json();
      setSections(data);
    } catch (err) {
      console.error('Error fetching sections:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/users`);
      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/classes`);
      const data = await response.json();
      setClasses(data);
    } catch (err) {
      console.error('Error fetching classes:', err);
    }
  };

  const generateAttendanceReport = async (e) => {
    e.preventDefault();
    setLoading(true);

    const query = [];
    if (startDate && endDate) query.push(`startDate=${startDate}`, `endDate=${endDate}`);
    if (sectionId) query.push(`sectionId=${sectionId}`);
    if (classId) query.push(`classId=${classId}`);
    if (teacherId) query.push(`teacherId=${teacherId}`);

    try {
      const response = await fetch(`${BASE_URL}/api/quickattendance/report?${query.join('&')}`);
      const result = await response.json();

      if (Array.isArray(result.data)) {
        setAttendanceReport(result.data);
      } else {
        setAttendanceReport([]);
      }
    } catch (err) {
      console.error('Error fetching attendance report:', err);
      setAttendanceReport([]);
    } finally {
      setLoading(false);
    }
  };

  const renderPDFDownload = () => {
    if (!attendanceReport || attendanceReport.length === 0) return null;

    return (
      <PDFDownloadLink
        document={<AttendancePDF attendanceData={attendanceReport} date={new Date().toLocaleDateString('bn-BD')} />}
        fileName={`attendance_report_${startDate}_${endDate}.pdf`}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
      >
        {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
      </PDFDownloadLink>
    );
  };

  if (!user || user.role !== 'headmaster') return null;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Report Wizard</h1>
      <form onSubmit={generateAttendanceReport} className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border rounded flex-1"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border rounded flex-1"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <select
            value={sectionId}
            onChange={(e) => setSectionId(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Select Section</option>
            {sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.sectionName}
              </option>
            ))}
          </select>

          <select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Select Class</option>
            {classes.map((classData) => (
              <option key={classData.id} value={classData.id}>
                {classData.className}
              </option>
            ))}
          </select>

          <select
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Select Teacher</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.full_name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Generate Attendance Report'}
        </button>
      </form>

      {renderPDFDownload()}

      {attendanceReport?.length > 0 && (
        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Teacher</th>
                <th className="border p-2">Class</th>
                <th className="border p-2">Section</th>
                <th className="border p-2">Total Students</th>
                <th className="border p-2">Present Male</th>
                <th className="border p-2">Present Female</th>
                <th className="border p-2">Attendance %</th>
              </tr>
            </thead>
            <tbody>
              {attendanceReport.map((record, index) => (
                <tr key={index}>
                  <td className="border p-2 text-center">{record.teacher_name}</td>
                  <td className="border p-2 text-center">{record.className}</td>
                  <td className="border p-2 text-center">{record.sectionName}</td>
                  <td className="border p-2 text-center">{record.male_count + record.female_count}</td>
                  <td className="border p-2 text-center">{record.male_count}</td>
                  <td className="border p-2 text-center">{record.female_count}</td>
                  <td className="border p-2 text-center">{record.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
