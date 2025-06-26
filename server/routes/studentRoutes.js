import express from 'express';
import {
  createStudent,
  addAttendance,
  getAttendancePercentage,
  getAttendanceSummary,
  getStudentByRollNumber
} from '../controllers/studentController.js';

const router = express.Router();

router.post('/students', createStudent);
router.post('/attendance', addAttendance);
router.get('/attendance/:rollNumber', getAttendancePercentage);
router.get('/summary/:rollNumber', getAttendanceSummary);
router.get('/student/:rollNumber', getStudentByRollNumber);


export default router;