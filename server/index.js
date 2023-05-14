const express = require("express");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3001;
const AWS = require("aws-sdk");
const { awsConfig } = require("./config.js");
const { deleteItems, deleteItem } = require("./dynamodb.js");

AWS.config.update(awsConfig);
const dynamodb = new AWS.DynamoDB.DocumentClient();

const corsOptions = {
  origin: "http://localhost:3000",
};
app.use(cors(corsOptions));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Wellcome to the student management system!");
});

const studentTableName = "students";
const courseTableName = "courses";
const resultTableName = "results";

// update student
app.post("/api/students", (req, res) => {
  const { firstName, lastName, email, dateOfBirth } = req.body;
  const student = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    dateOfBirth: dateOfBirth,
  };
  const params = {
    TableName: studentTableName,
    Item: student,
  };
  dynamodb.put(params, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Error saving student" });
    } else {
      console.log("Student saved successfully");
      res.status(200).json({ message: "Student saved successfully" });
    }
  });
});

// List students
app.get("/api/students", (req, res) => {
  const params = {
    TableName: studentTableName,
  };
  dynamodb.scan(params, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error fetching students");
    } else {
      console.log(data);
      const students = data.Items.map((item) => {
        return {
          firstName: item.firstName,
          lastName: item.lastName,
          dateOfBirth: item.dateOfBirth,
          email: item.email,
        };
      });
      console.log(students);
      console.log(JSON.stringify(students));
      res.send(JSON.stringify(students));
    }
  });
});

// Delete student
app.delete("/api/students/:email", async (req, res) => {
  const TransactItems = [
    {
      Delete: {
        TableName: studentTableName,
        Key: { email: req.params.email },
      },
    },
  ];

  // result table query params
  const params = {
    TableName: resultTableName,
    IndexName: "studentEmail",
    KeyConditionExpression: "studentEmail = :val",
    ExpressionAttributeValues: { ":val": req.params.email },
  };
  dynamodb.query(params, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "error" });
    } else {
      console.log("Query succeeded.");
      const resultItems = data.Items.map((item) => {
        return {
          Delete: {
            TableName: resultTableName,
            Key: {
              studentEmail: item.studentEmail,
              courseName: item.courseName,
            },
          },
        };
      });
      TransactItems.push(...resultItems);
      const transactionParams = { TransactItems };
      dynamodb.transactWrite(transactionParams, (err, data) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: "error" });
        } else {
          console.log(`Student ${req.params.email} deleted successfully`);
          res.status(200).json({ message: "success" });
        }
      });
    }
  });
});

// update course
app.post("/api/courses", (req, res) => {
  const { name } = req.body;
  const course = {
    name,
  };
  const params = {
    TableName: courseTableName,
    Item: course,
  };
  dynamodb.put(params, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error saving course");
    } else {
      console.log("Course saved successfully");
      res.send("Course saved successfully");
    }
  });
});

// List courses
app.get("/api/courses", (req, res) => {
  const params = {
    TableName: courseTableName,
  };
  dynamodb.scan(params, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error fetching courses");
    } else {
      console.log(data);
      const courses = data.Items.map((item) => {
        return {
          name: item.name,
        };
      });
      console.log(courses);
      console.log(JSON.stringify(courses));
      res.send(JSON.stringify(courses));
    }
  });
});

// Delete course
app.delete("/api/courses/:name", (req, res) => {
  const TransactItems = [
    {
      Delete: {
        TableName: courseTableName,
        Key: { name: req.params.name },
      },
    },
  ];

  // result table query params
  const params = {
    TableName: resultTableName,
    KeyConditionExpression: "courseName = :val",
    ExpressionAttributeValues: { ":val": req.params.name },
  };
  dynamodb.query(params, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "error" });
    } else {
      console.log("Query succeeded.");
      const resultItems = data.Items.map((item) => {
        return {
          Delete: {
            TableName: resultTableName,
            Key: {
              studentEmail: item.studentEmail,
              courseName: item.courseName,
            },
          },
        };
      });
      TransactItems.push(...resultItems);
      const transactionParams = { TransactItems };
      dynamodb.transactWrite(transactionParams, (err, data) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: "error" });
        } else {
          console.log(`Student ${req.params.email} deleted successfully`);
          res.status(200).json({ message: "success" });
        }
      });
    }
  });
});

// update result
app.post("/api/results", (req, res) => {
  const { selectedCourse, selectedStudent, selectedScore } = req.body;
  // get student
  const studentParams = {
    TableName: studentTableName,
    Key: {
      email: selectedStudent,
    },
  };
  dynamodb.get(studentParams, (err, data) => {
    if (err) {
      console.error("Unable to get item:", err);
    } else {
      console.log("GetItem succeeded:", data);
      const result = {
        courseName: selectedCourse,
        studentEmail: selectedStudent,
        studentName: data.Item.firstName + " " + data.Item.lastName,
        score: selectedScore,
      };
      const params = {
        TableName: resultTableName,
        Item: result,
      };
      dynamodb.put(params, (err, data) => {
        if (err) {
          console.log(err);
          res.status(500).send("Error saving course");
        } else {
          console.log("Course saved successfully");
          res.send("Course saved successfully");
        }
      });
    }
  });
});

// List results
app.get("/api/results", (req, res) => {
  const params = {
    TableName: resultTableName,
  };
  dynamodb.scan(params, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Error fetching results" });
    } else {
      console.log(data);
      const results = data.Items.map((item) => {
        return {
          courseName: item.courseName,
          studentName: item.studentName,
          studentEmail: item.studentEmail,
          score: item.score,
        };
      });
      console.log(results);
      console.log(JSON.stringify(results));
      res.send(JSON.stringify(results));
    }
  });
});

app.listen(PORT, () => {
  console.log("Server started on port 3001");
});
