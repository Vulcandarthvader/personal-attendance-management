import mongoose from 'mongoose';

const attendanceSummarySchema = new mongoose.Schema({
  rollNumber: { type: String, required: true },
  course: { type: String, required: true, enum: ['dbms', 'mpmc', 'toc', 'coa', 'se'] },
  totalClasses: { type: Number, required: true, default: 0 },
  classesAttended: { type: Number, required: true, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

attendanceSummarySchema.index({ rollNumber: 1, course: 1 }, { unique: true });

const AttendanceSummary = mongoose.model('AttendanceSummary', attendanceSummarySchema);
export default AttendanceSummary;
