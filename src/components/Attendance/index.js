// // src/components/Attendance.js

// import { useState } from 'react';
// import { markAttendance } from '../config/apiConfig';  // Import the API call

// const Attendance = () => {
//   const [date, setDate] = useState('');
//   const [status, setStatus] = useState('present');
//   const [classId, setClassId] = useState('');
//   const [sectionId, setSectionId] = useState('');
//   const [subjectId, setSubjectId] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await markAttendance(date, status, classId, sectionId, subjectId);
//       console.log('Attendance marked successfully:', response);
//     } catch (error) {
//       console.error('Error marking attendance:', error);
//     }
//   };

//   return (
//     <div>
//       <h2>Mark Attendance</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="date"
//           value={date}
//           onChange={(e) => setDate(e.target.value)}
//           required
//         />
//         <select value={status} onChange={(e) => setStatus(e.target.value)} required>
//           <option value="present">Present</option>
//           <option value="absent">Absent</option>
//         </select>
//         <input
//           type="text"
//           value={classId}
//           onChange={(e) => setClassId(e.target.value)}
//           placeholder="Class ID"
//           required
//         />
//         <input
//           type="text"
//           value={sectionId}
//           onChange={(e) => setSectionId(e.target.value)}
//           placeholder="Section ID"
//           required
//         />
//         <input
//           type="text"
//           value={subjectId}
//           onChange={(e) => setSubjectId(e.target.value)}
//           placeholder="Subject ID"
//           required
//         />
//         <button type="submit">Mark Attendance</button>
//       </form>
//     </div>
//   );
// };

// export default Attendance;
