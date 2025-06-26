import mongoose from 'mongoose';

const AttendanceRecordSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true },
  course: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['present', 'absent'], required: true }
}, { timestamps: true });

AttendanceRecordSchema.index({ rollNumber: 1, course: 1, date: 1 }, { unique: true });

const AttendanceRecord = mongoose.model('AttendanceRecord', AttendanceRecordSchema);
export default AttendanceRecord;
