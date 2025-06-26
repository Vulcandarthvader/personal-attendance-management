import mongoose from 'mongoose';

const attendanceRecordSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  status: { type: String, enum: ['present', 'absent'], required: true }
});

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: v => /^[A-Za-z0-9]+$/.test(v),
      message: props => `${props.value} is not a valid roll number!`
    }
  },
  attendance: {
    dbms: [attendanceRecordSchema],
    mpmc: [attendanceRecordSchema],
    toc: [attendanceRecordSchema],
    coa: [attendanceRecordSchema],
    se: [attendanceRecordSchema]
  }
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);
export default Student;