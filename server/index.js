import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import studentRoutes from './routes/studentRoutes.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());


app.use('/api', studentRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date()
  });
});

const PORT = 5000; 
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});