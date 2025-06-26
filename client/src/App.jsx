import React from 'react';
import StudentForm from './components/StudentForm';
import StudentTable from './components/StudentTable';
import './App.css';

function App() {
  return (
    <div className="app">
      <header>
        <h1>Student Attendance System</h1>
      </header>
      
      <main>
        <StudentForm />
        <StudentTable />
      </main>
    </div>
  );
}

export default App;