import "./Sidebar.css";
import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/addstudent">Add New Students</Link>
        </li>
        <li>
          <Link to="/liststudent">Students List</Link>
        </li>
        <li>
          <Link to="/addcourse">Add New Courses</Link>
        </li>
        <li>
          <Link to="/listcourse">Courses List</Link>
        </li>
        <li>
          <Link to="/addresult">Add New Results</Link>
        </li>
        <li>
          <Link to="/listresult">Results List</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
