import React, { useState } from "react";

const NewCourses = () => {
  const [courseName, setCourseName] = useState("");
  const [notification, setNotification] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    // add the new course to the system
    fetch("http://localhost:3001/api/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: courseName,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          setNotification(`${courseName} added successfully`);
          setCourseName("");
        } else {
          setNotification(
            `Something went wrong. Server responded with ${response.status}.`
          );
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h1>Add New Course</h1>
      {notification && <div>{notification}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="courseName">Course Name:</label>
          <input
            type="text"
            id="courseName"
            value={courseName}
            onChange={(event) => setCourseName(event.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default NewCourses;
