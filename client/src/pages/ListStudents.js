import React, { useState, useEffect } from "react";

const ListStudents = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/students")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setStudents(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleDeleteClick = (email) => {
    fetch(`http://localhost:3001/api/students/${email}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.status === 200) {
          setStudents(students.filter((student) => student.email !== email));
        } else {
          console.error(
            `Unabel to delete ${email}. Server responded with ${response.status}.`
          );
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h1>Student List</h1>
      <table>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Date of Birth</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.email}>
              <td>{`${student.firstName} ${student.lastName}`}</td>
              <td>{student.email}</td>
              <td>{student.dateOfBirth}</td>
              <td>
                <button onClick={() => handleDeleteClick(student.email)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListStudents;
