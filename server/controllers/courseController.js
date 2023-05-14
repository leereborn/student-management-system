const AWS = require("aws-sdk");
const { awsConfig } = require("../config.js");

AWS.config.update(awsConfig);
const dynamodb = new AWS.DynamoDB.DocumentClient();

const courseTableName = "courses";
const resultTableName = "results";

module.exports.updateCourse = (req, res) => {
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
};

module.exports.listCourses = (req, res) => {
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
};

module.exports.deleteCourse = (req, res) => {
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
};
