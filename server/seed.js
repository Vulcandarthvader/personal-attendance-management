// seed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Student from './models/Student.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/attendance-system';

const seedStudents = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Clear old data
    await Student.deleteMany({});

    // Seed data
    const students = [
      { name: "Mahima", rollNumber: "18" },
      { name: "Nandita", rollNumber: "19" },
      { name: "Gargi", rollNumber: "20" },
      { name: "Aditi", rollNumber: "21" },
      { name: "Saana", rollNumber: "22" }
    ];

    for (let student of students) {
      const newStudent = new Student({
        ...student,
        attendance: {
          dbms: [],
          mpmc: [],
          toc: [],
          coa: [],
          se: []
        }
      });
      await newStudent.save();
    }

    console.log("✅ Database seeded with students.");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedStudents();
