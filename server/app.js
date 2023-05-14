const express = require("express");
const cors = require("cors");
const {
  updateStudent,
  listStudents,
  deleteStudent,
} = require("./controllers/studentController.js");

const {
  updaCourse,
  listCourses,
  deleteCourse,
  updateCourse,
} = require("./controllers/courseController.js");

const {
  updateResult,
  listResults,
} = require("./controllers/resultController.js");

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: "http://localhost:3000",
};
app.use(cors(corsOptions));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Wellcome to the student management system!");
});

app.post("/api/students", updateStudent);
app.get("/api/students", listStudents);
app.delete("/api/students/:email", deleteStudent);

app.post("/api/courses", updateCourse);
app.get("/api/courses", listCourses);
app.delete("/api/courses/:name", deleteCourse);

app.post("/api/results", updateResult);
app.get("/api/results", listResults);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
