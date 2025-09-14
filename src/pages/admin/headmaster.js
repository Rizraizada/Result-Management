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
    } else if (user.role !== 'headmaster' && user.role !== 'teacher') {
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
      setAttendanceReport(Array.isArray(result.data) ? result.data : []);
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
        document={
          <AttendancePDF
            attendanceData={attendanceReport}
            date={new Date().toLocaleDateString('bn-BD')}
          />
        }
        fileName={`attendance_report_${startDate}_${endDate}.pdf`}
        className="inline-block"
      >
        {({ loading }) => (
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition mt-4"
            disabled={loading}
            type="button"
          >
            {loading ? 'Generating PDF...' : 'Download PDF'}
          </button>
        )}
      </PDFDownloadLink>
    );
  };

  if (!user || (user.role !== 'headmaster' && user.role !== 'teacher')) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
<h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6">
  Attendance Report Wizard
</h1>

      <form onSubmit={generateAttendanceReport} className="bg-white shadow-md rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Section</label>
            <select
              value={sectionId}
              onChange={(e) => setSectionId(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select Section</option>
              {sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.sectionName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Class</label>
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.className}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Teacher</label>
            <select
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select Teacher</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.full_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Generate Attendance Report'}
        </button>
      </form>

      {renderPDFDownload()}

      {attendanceReport?.length > 0 && (
        <div className="mt-10 overflow-x-auto">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full text-sm text-center border">
              <thead className="bg-gray-100 text-gray-800 font-semibold">
                <tr>
                  <th className="border px-4 py-2">Teacher</th>
                  <th className="border px-4 py-2">Class</th>
                  <th className="border px-4 py-2">Section</th>
                  <th className="border px-4 py-2">Total Students</th>
                  <th className="border px-4 py-2">Present Male</th>
                  <th className="border px-4 py-2">Present Female</th>
                  <th className="border px-4 py-2">Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {attendanceReport.map((record, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="border px-3 py-2">{record.teacher_name}</td>
                    <td className="border px-3 py-2">{record.className}</td>
                    <td className="border px-3 py-2">{record.sectionName}</td>
                    <td className="border px-3 py-2">
                      {record.male_count + record.female_count}
                    </td>
                    <td className="border px-3 py-2">{record.male_count}</td>
                    <td className="border px-3 py-2">{record.female_count}</td>
                    <td className="border px-3 py-2">{record.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
