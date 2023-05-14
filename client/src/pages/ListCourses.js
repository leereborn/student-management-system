import React, { useState, useEffect } from "react";

const ListCourses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/courses")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setCourses(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleDeleteCourse = (name) => {
    fetch(`http://localhost:3001/api/courses/${name}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "success") {
          setCourses(courses.filter((course) => course.name !== name));
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h1>Courses List</h1>
      <table>
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.name}>
              <td>{course.name}</td>
              <td>
                <button onClick={() => handleDeleteCourse(course.name)}>
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

export default ListCourses;
