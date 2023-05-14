import "./App.css";
import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";

import Home from "./components/Home";
import ListCourses from "./components/ListCourses";
import ListResults from "./components/ListResults";
import ListStudents from "./components/ListStudents";
import NewCourses from "./components/NewCourses";
import NewResults from "./components/NewResults";
import NewStudents from "./components/NewStudents";
import Sidebar from "./components/Sidebar";

function App() {
  const tempElement = <h1>Temp Element</h1>;
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/addstudent" element={<NewStudents />} />
          <Route path="/liststudent" element={<ListStudents />} />
          <Route path="/addcourse" element={<NewCourses />} />
          <Route path="/listcourse" element={<ListCourses />} />
          <Route path="/addresult" element={<NewResults />} />
          <Route path="/listresult" element={<ListResults />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
