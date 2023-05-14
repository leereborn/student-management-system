const AWS = require("aws-sdk");
const { awsConfig } = require("../config.js");

AWS.config.update(awsConfig);
const dynamodb = new AWS.DynamoDB.DocumentClient();

const studentTableName = "students";
const resultTableName = "results";

module.exports.updateStudent = (req, res) => {
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
};

module.exports.listStudents = (req, res) => {
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
};

module.exports.deleteStudent = (req, res) => {
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
};
