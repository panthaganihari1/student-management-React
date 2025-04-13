import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ name: '', age: '' });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    fetch('http://localhost:8080/api/students')
      .then(res => res.json())
      .then(data => setStudents(data))
      .catch(err => console.error("Error:", err));
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    fetch('http://localhost:8080/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(newStudent => {
        setStudents(prev => [...prev, newStudent]);
        setFormData({ name: '', age: '' });
      })
      .catch(err => console.error("Save error:", err));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:8080/api/students/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setStudents(prev => prev.filter(student => student.id !== id));
      })
      .catch(err => console.error("Delete error:", err));
  };

  return (
    <div className="container py-5">
      <div className="card shadow p-4">
        <h2 className="text-center mb-4 text-primary">🎓 Student Directory</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-3">
            <input
              type="text"
              name="name"
              placeholder="Enter name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="number"
              name="age"
              placeholder="Enter age"
              className="form-control"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100">Add Student</button>
        </form>

        {/* Table */}
        <table className="table table-bordered table-hover">
          <thead className="table-primary">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.age}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(student.id)}
                  >
                    Delete 🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
