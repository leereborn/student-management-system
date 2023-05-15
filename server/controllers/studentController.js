const AWS = require("aws-sdk");
const {
  awsConfig,
  studentTableName,
  resultTableName,
} = require("../config.js");
const studentDAO = require("../dao/studentdao.js");
const resultDAO = require("../dao/resultdao.js");

AWS.config.update(awsConfig);
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.updateStudent = async (req, res) => {
  const { firstName, lastName, email, dateOfBirth } = req.body;
  const student = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    dateOfBirth: dateOfBirth,
  };

  try {
    await studentDAO.post(student);
    const message = `Student ${firstName} ${lastName} updated successfully`;
    console.log(message);
    res.status(200).json({ message });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message });
  }
};

module.exports.listStudents = async (req, res) => {
  try {
    const data = await studentDAO.list();
    console.log(`Got ${data.Items.length} students`);
    res.status(200).json(data.Items);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching students" });
  }
};

module.exports.deleteStudent = async (req, res) => {
  const TransactItems = [
    {
      Delete: {
        TableName: studentTableName,
        Key: { email: req.params.email },
      },
    },
  ];

  try {
    const data = await resultDAO.queryByStudent(req.params.email);
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
    const message = `Student ${req.params.email} deleted successfully`;
    console.log(message);
    res.status(200).json({ message });
  } catch (err) {
    const message = `Error deleting student ${req.params.email}`;
    console.error(message, err);
    res.status(500).json({ message });
  }
};
