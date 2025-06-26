import React, { useState } from 'react';
import axios from 'axios';
import './StudentTable.css';

function StudentTable() {
  const [rollNumber, setRollNumber] = useState('');
  const [attendance, setAttendance] = useState(null);
  const [studentName, setStudentName] = useState('');

  const handleView = async () => {
    if (!rollNumber.trim()) return;

    try {
      const nameResponse = await axios.get(`http://localhost:5000/api/student/${rollNumber}`);
      setStudentName(nameResponse.data.data.name);

      const attendanceResponse = await axios.get(`http://localhost:5000/api/attendance/${rollNumber}`);
      setAttendance(attendanceResponse.data.data);
    } catch (error) {
      console.error('Fetch error:', error);
      alert(error.response?.data?.message || 'Failed to fetch data');
      setStudentName('');
      setAttendance(null);
    }
  };

  return (
    <div className="attendance-viewer">
      <h2>View Attendance</h2>
      <div className="search-box">
        <input
          type="text"
          placeholder="Enter Roll Number"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
        />
        <button onClick={handleView}>View Attendance</button>
      </div>

      {studentName && (
        <div className="student-info">
          <h3>Student Name: {studentName}</h3>
          <p>Roll Number: {rollNumber}</p>
        </div>
      )}

      {attendance && (
        <div className="results">
          <h3>Attendance Percentage</h3>
          <table>
            <thead>
              <tr>
                <th>Course</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(attendance).map(([course, percentage]) => (
                <tr key={course}>
                  <td>{course.toUpperCase()}</td>
                  <td>{percentage.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default StudentTable;
