const AWS = require("aws-sdk");
const { awsConfig, courseTableName, resultTableName } = require("../config.js");
const courseDAO = require("../dao/coursedao.js");
const resultDAO = require("../dao/resultdao.js");

AWS.config.update(awsConfig);
const dynamodb = new AWS.DynamoDB.DocumentClient();

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
    await dynamodb.transactWrite(transactionParams).promise();
    const message = `Course ${req.params.name} deleted successfully`;
    console.log(message);
    res.status(200).json({ message });
  } catch (err) {
    const message = `Error deleting Course ${req.params.name}`;
    console.error(message, err);
    res.status(500).json({ message });
  }
};
