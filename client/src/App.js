import "./App.css";
import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";

import Home from "./pages/Home";
import ListCourses from "./pages/ListCourses";
import ListResults from "./pages/ListResults";
import ListStudents from "./pages/ListStudents";
import NewCourses from "./pages/NewCourses";
import NewResults from "./pages/NewResults";
import NewStudents from "./pages/NewStudents";
import Sidebar from "./components/Sidebar";

function App() {
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
