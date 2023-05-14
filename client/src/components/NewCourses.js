import React, { useState } from "react";

const NewCourses = () => {
  const [courseName, setCourseName] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (courseName.trim() === "") {
      alert("Please enter a course name");
      return;
    }

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
      .then((response) => console.log(response))
      .then((data) => console.log(data))
      .catch((error) => console.error(error));

    setShowSuccessMessage(true);
    setCourseName("");
  };

  return (
    <div>
      <h1>Add New Course</h1>
      {showSuccessMessage && <div>New course added successfully</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="courseName">Course Name:</label>
          <input
            type="text"
            id="courseName"
            value={courseName}
            onChange={(event) => setCourseName(event.target.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default NewCourses;
