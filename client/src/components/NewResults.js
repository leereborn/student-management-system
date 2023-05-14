import React, { useState, useEffect } from "react";

const NewResults = () => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedScore, setSelectedScore] = useState("");
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/students")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setStudents(data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:3001/api/courses")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setCourses(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: submit the form data to the server
    fetch("http://localhost:3001/api/results", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        selectedCourse,
        selectedStudent,
        selectedScore,
      }),
    })
      .then((response) => console.log(response))
      .then((data) => console.log(data))
      .catch((error) => console.error(error));

    alert("Result added successfully!");
    setSelectedCourse("");
    setSelectedStudent("");
    setSelectedScore("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Course Name:
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          required
        >
          <option value="">-- Select a course --</option>
          {courses &&
            courses.map((course) => (
              <option key={course.name} value={course.name}>
                {course.name}
              </option>
            ))}
        </select>
      </label>
      <br />
      <label>
        Student Name:
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          required
        >
          <option value="">-- Select a student --</option>
          {students &&
            students.map((student) => (
              <option
                key={student.email}
                value={student.email}
              >{`${student.firstName} ${student.lastName}`}</option>
            ))}
        </select>
      </label>
      <br />
      <label>
        Score:
        <select
          value={selectedScore}
          onChange={(e) => setSelectedScore(e.target.value)}
          required
        >
          <option value="">-- Select a score --</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
          <option value="E">E</option>
          <option value="F">F</option>
        </select>
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
};

export default NewResults;
