import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import './App.css';

const styles = `
.container {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.title {
  text-align: center;
  color: #4CAF50;
}
.label, .detail {
  display: block;
  margin: 10px 0 5px;
  font-weight: bold;
}
.input, .submit-button, .add-button, .delete-button, .edit-button {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.submit-button, .add-button {
  background-color: #4CAF50;
  color: #fff;
  cursor: pointer;
}
.delete-button {
  background-color: #f44336;
  color: #fff;
  cursor: pointer;
}
.edit-button {
  background-color: #2196F3;
  color: #fff;
  cursor: pointer;
}
.list-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #e3f2fd;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 5px;
}
.submitted-details {
  background-color: #d1f7d1;
  padding: 10px;
  border: 1px solid #4CAF50;
  border-radius: 5px;
}
`;

const styleElement = document.createElement("style");
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);

function StudentDetails({ students }) {
  const { id } = useParams();
  const student = students.find((student) => student.id === Number(id));

  if (!student) {
    return <div>Student not found</div>;
  }

  return (
    <div className="container">
      <h1 className="title">Student Details</h1>
      <p className="detail">Name: {student.name}</p>
      <p className="detail">Age: {student.age}</p>
      <p className="detail">Grade: {student.grade}</p>
      <p className="detail">Email: {student.email}</p>
      <p className="detail">Phone Number: {student.phoneNumber}</p>
      <p className="detail">Address: {student.address}</p>
    </div>
  );
}

function App() {
  const [students, setStudents] = useState(() => {
    const storedStudents = localStorage.getItem('students');
    return storedStudents ? JSON.parse(storedStudents) : [];
  });

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  const addStudent = (newStudent) => {
    setStudents([...students, newStudent]);
  };

  const deleteStudent = (id) => {
    setStudents(students.filter((student) => student.id !== id));
  };

  const editStudent = (updatedStudent) => {
    setStudents(
      students.map((student) =>
        student.id === updatedStudent.id ? updatedStudent : student
      )
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <StudentList
              students={students}
              deleteStudent={deleteStudent}
              editStudent={editStudent}
            />
          }
        />
        <Route
          path="/add-student"
          element={<StudentForm addStudent={addStudent} />}
        />
        <Route
          path="/student/:id"
          element={<StudentDetails students={students} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

function StudentList({ students, deleteStudent, editStudent }) {
  return (
    <div className="container">
      <h1 className="title">Student List</h1>
      <ul className="list">
        {students.map((student) => (
          <li key={student.id} className="list-item">
            <Link to={`/student/${student.id}`}>
              {student.name} ({student.age}) - Grade {student.grade}
            </Link>
            <button className="delete-button" onClick={() => deleteStudent(student.id)}>Delete</button>
            <button className="edit-button" onClick={() => editStudent(student)}>Edit</button>
          </li>
        ))}
      </ul>
      <Link to="/add-student" className="add-button">Add New Student</Link>
    </div>
  );
}

function StudentForm({ addStudent }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [grade, setGrade] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [submittedStudent, setSubmittedStudent] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && age.trim() && grade.trim()) {
      const newStudent = {
        id: Date.now(),
        name,
        age,
        grade,
        email,
        phoneNumber,
        address
      };
      addStudent(newStudent);
      setSubmittedStudent(newStudent);

      setName('');
      setAge('');
      setGrade('');
      setEmail('');
      setPhoneNumber('');
      setAddress('');
    }
  };

  return (
    <div className="container">
      <h1 className="title">Add New Student</h1>
      <form onSubmit={handleSubmit} className="form">
        <label className="label">Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input" />
        </label>
        <label className="label">Age:
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="input" />
        </label>
        <label className="label">Grade:
          <input type="number" value={grade} onChange={(e) => setGrade(e.target.value)} className="input" />
        </label>
        <label className="label">Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
        </label>
        <label className="label">Phone Number:
          <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="input" />
        </label>
        <label className="label">Address:
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="input" />
        </label>
        <button type="submit" className="submit-button">Add Student</button>
      </form>
      {submittedStudent && (
        <div className="submitted-details">
          <h2>Submitted Student Details</h2>
          <p>Name: {submittedStudent.name}</p>
          <p>Age: {submittedStudent.age}</p>
          <p>Grade: {submittedStudent.grade}</p>
          <p>Email: {submittedStudent.email}</p>
          <p>Phone Number: {submittedStudent.phoneNumber}</p>
          <p>Address: {submittedStudent.address}</p>
        </div>
      )}
    </div>
  );
}

export default App;
