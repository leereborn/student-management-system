const AWS = require("aws-sdk");
const { awsConfig } = require("../config.js");
const courseDAO = require("../dao/coursedao.js");
const resultDAO = require("../dao/resultdao.js");

AWS.config.update(awsConfig);
const dynamodb = new AWS.DynamoDB.DocumentClient();

const courseTableName = "courses";
const resultTableName = "results";

module.exports.updateCourse = async (req, res) => {
  const { name } = req.body;
  const course = {
    name,
  };
  try {
    await courseDAO.post(course);
    const message = `${name} saved successfully`;
    console.log(message);
    res.status(200).json({ message });
  } catch (err) {
    const message = `Error saving ${name}`;
    console.log(err);
    res.status(500).send(message);
  }
};

module.exports.listCourses = async (req, res) => {
  try {
    const data = await courseDAO.list();
    console.log(`Got ${data.Items.length} courses`);
    res.status(200).json(data.Items);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching courses" });
  }
};

module.exports.deleteCourse = async (req, res) => {
  const TransactItems = [
    {
      Delete: {
        TableName: courseTableName,
        Key: { name: req.params.name },
      },
    },
  ];

  try {
    const data = await resultDAO.queryByCourse(req.params.name);
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "error" });
  }
};
