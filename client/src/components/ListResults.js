import React, { useEffect, useState } from "react";

const ListResults = () => {
  const [results, setResults] = useState([]);

  // Fetch results from server on component mount
  useEffect(() => {
    fetch("http://localhost:3001/api/results")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setResults(data);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Course name</th>
          <th>Student name</th>
          <th>Score</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {results.map((result) => (
          <tr key={`${result.courseName}#${result.studentEmail}`}>
            <td>{result.courseName}</td>
            <td>{result.studentName}</td>
            <td>{result.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ListResults;
