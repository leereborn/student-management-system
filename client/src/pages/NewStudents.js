import React, { useState } from "react";
import { getAgeFromBirthday, isValidEmail } from "../utils/utils";

const NewStudents = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [notification, setNotification] = useState("");

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const age = getAgeFromBirthday(dateOfBirth);

    if (!isValidEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (age < 10) {
      alert("The student must be at least 10 years old.");
      return;
    }

    // Add the new student to the system
    fetch("http://localhost:3001/api/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        dateOfBirth,
      }),
    })
      .then((response) => {
        console.log(response);
        setNotification(
          `${firstName} ${lastName} has been added to the system.`
        );
        setFirstName("");
        setLastName("");
        setEmail("");
        setDateOfBirth("");
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h1>Add New Student</h1>
      {notification && <p>{notification}</p>}
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="firstName">First Name:</label>
        <input
          type="text"
          id="firstName"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          required
        />

        <label htmlFor="lastName">Last Name:</label>
        <input
          type="text"
          id="lastName"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          required
        />

        <label htmlFor="email">Email Address:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="dateOfBirth">Date of Birth (YYYY-MM-DD):</label>
        <input
          type="date"
          id="dateOfBirth"
          value={dateOfBirth}
          onChange={(event) => setDateOfBirth(event.target.value)}
          required
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default NewStudents;
