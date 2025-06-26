import React, { useState } from 'react';
import axios from 'axios';
import './StudentForm.css';

function StudentForm({ refreshAttendance }) {
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    course: 'dbms',
    date: '2025-04-17',
    status: 'present'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/attendance', {
        rollNumber: formData.rollNumber,
        course: formData.course,
        date: formData.date,
        status: formData.status
      });

      alert(`✅ Attendance recorded for rollno. ${formData.rollNumber}`);

      setFormData(prev => ({
        ...prev,
        name: '',
        rollNumber: ''
      }));

      if (refreshAttendance) {
        refreshAttendance(formData.rollNumber);
      }

    } catch (error) {
      console.error('Full error:', error);
      const errorMessage = error?.response?.data?.message || 'Failed to submit attendance';
      alert(`❌ ${errorMessage}`);
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const day = selectedDate.getDay(); // 0 = Sunday, 6 = Saturday

    if (day === 0 || day === 6) {
      alert('❌ No classes allowed on weekends 😃');
      return;
    }

    setFormData({ ...formData, date: e.target.value });
  };

  return (
    <div className="attendance-form">
      <h2>Mark Attendance</h2>
      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Roll Number</label>
          <input
            type="text"
            value={formData.rollNumber}
            onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Course</label>
          <select
            value={formData.course}
            onChange={(e) => setFormData({ ...formData, course: e.target.value })}
          >
            <option value="dbms">DBMS</option>
            <option value="mpmc">MPMC</option>
            <option value="toc">TOC</option>
            <option value="coa">COA</option>
            <option value="se">SE</option>
          </select>
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={formData.date}
            min="2025-04-17"
            max="2025-04-30"
            onChange={handleDateChange}
            required
          />
        </div>

        <div className="form-group radio-group">
          <label>Status:</label>
          <div>
            <label>
              <input
                type="radio"
                name="status"
                value="present"
                checked={formData.status === 'present'}
                onChange={() => setFormData({ ...formData, status: 'present' })}
              />
              Present
            </label>
            <label>
              <input
                type="radio"
                name="status"
                value="absent"
                checked={formData.status === 'absent'}
                onChange={() => setFormData({ ...formData, status: 'absent' })}
              />
              Absent
            </label>
          </div>
        </div>

        <button type="submit">Submit Attendance</button>
      </form>
    </div>
  );
}

export default StudentForm;
