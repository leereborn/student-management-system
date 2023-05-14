import React, { useState, useEffect } from "react";

const Home = () => {
  const [data, setData] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/")
      .then((res) => res.text())
      .then((data) => setData(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="Home">
      <h1>{data}</h1>
    </div>
  );
};

export default Home;
