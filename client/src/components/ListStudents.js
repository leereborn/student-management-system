import React, { useState, useEffect } from "react";

const ListStudents = () => {
  const [students, setStudents] = useState([
    {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      dateOfBirth: "2002-01-01",
    },
    {
      firstName: "Jane",
      lastName: "Doe",
      email: "jane.doe@example.com",
      dateOfBirth: "2003-02-02",
    },
    {
      firstName: "Bob",
      lastName: "Smith",
      email: "bob.smith@example.com",
      dateOfBirth: "2004-03-03",
    },
  ]);

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
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "success") {
          setStudents(students.filter((student) => student.email !== email));
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
          {students &&
            students.map((student) => (
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
