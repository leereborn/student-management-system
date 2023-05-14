const AWS = require("aws-sdk");
const { awsConfig } = require("../config.js");

AWS.config.update(awsConfig);
const dynamodb = new AWS.DynamoDB.DocumentClient();

const resultTableName = "results";
const studentTableName = "students";

module.exports.updateResult = (req, res) => {
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
};

module.exports.listResults = (req, res) => {
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
};
