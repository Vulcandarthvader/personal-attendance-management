import Student from '../models/Student.js';
import AttendanceSummary from '../models/AttendanceSummary.js';
import AttendanceRecord from '../models/AttendanceRecord.js';

// ========== Create Student ==========
export const createStudent = async (req, res) => {
  try {
    const { name, rollNumber } = req.body;

    if (!name || !rollNumber) {
      return res.status(400).json({
        success: false,
        message: "Name and rollNumber are required"
      });
    } 

    let student = await Student.findOne({ rollNumber });
    if (student) {
      return res.status(200).json({
        success: true,
        message: "Student already exists",
        student
      });
    }

    student = new Student({ name, rollNumber });
    await student.save();

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      student
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};

// ========== Add Attendance ==========
export const addAttendance = async (req, res) => {
  try {
    const { rollNumber, course, date, status } = req.body;

    if (!rollNumber || !course || !date || !status) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const student = await Student.findOne({ rollNumber });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    // Check for duplicate attendance on same date
    const existing = await AttendanceRecord.findOne({
      rollNumber,
      course,
      date: new Date(date)
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Attendance already marked for this date"
      });
    }

    // Save new attendance record
    await AttendanceRecord.create({
      rollNumber,
      course,
      date: new Date(date),
      status
    });

    // Update summary table
    await AttendanceSummary.findOneAndUpdate(
      { rollNumber, course },
      {
        $inc: {
          totalClasses: 1,
          classesAttended: status === 'present' ? 1 : 0
        },
        $set: { lastUpdated: new Date() }
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      message: "Attendance recorded successfully"
    });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate attendance entry"
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};

// ========== Get Attendance Percentage ==========
export const getAttendancePercentage = async (req, res) => {
  try {
    const { rollNumber } = req.params;
    const student = await Student.findOne({ rollNumber });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    const records = await AttendanceRecord.find({ rollNumber });

    const courseWise = {};
    for (const rec of records) {
      const course = rec.course;
      if (!courseWise[course]) {
        courseWise[course] = { total: 0, present: 0 };
      }
      courseWise[course].total++;
      if (rec.status === 'present') courseWise[course].present++;
    }

    const results = {};
    for (const course in courseWise) {
      const { total, present } = courseWise[course];
      results[course] = total ? (present / total) * 100 : 0;
    }

    res.status(200).json({
      success: true,
      data: results
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};

// ========== Get Attendance Summary ==========
export const getAttendanceSummary = async (req, res) => {
  try {
    const { rollNumber } = req.params;
    const summaries = await AttendanceSummary.find({ rollNumber });

    if (!summaries.length) {
      return res.status(404).json({
        success: false,
        message: "No summaries found for this student"
      });
    }

    res.status(200).json({
      success: true,
      data: summaries
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};

// ========== Get Student By Roll Number ==========
export const getStudentByRollNumber = async (req, res) => {
  try {
    const { rollNumber } = req.params;
    const student = await Student.findOne({ rollNumber });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.status(200).json({
      success: true,
      data: {
        name: student.name
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};
