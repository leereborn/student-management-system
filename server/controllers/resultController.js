const AWS = require("aws-sdk");
const { awsConfig } = require("../config.js");
const studentDAO = require("../dao/studentdao.js");
const resultDAO = require("../dao/resultdao.js");

AWS.config.update(awsConfig);
const dynamodb = new AWS.DynamoDB.DocumentClient();

const resultTableName = "results";
const studentTableName = "students";

module.exports.updateResult = async (req, res) => {
  const { selectedCourse, selectedStudent, selectedScore } = req.body;

  try {
    const studentData = await studentDAO.get(selectedStudent);
    const studentName =
      studentData.Item.firstName + " " + studentData.Item.lastName;
    const result = {
      courseName: selectedCourse,
      studentEmail: selectedStudent,
      studentName: studentName,
      score: selectedScore,
    };
    await resultDAO.post(result);
    const message = `${studentName}'s result for ${selectedCourse} saved successfully`;
    console.log(message);
    res.status(200).send(message);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error saving result");
  }
};

module.exports.listResults = async (req, res) => {
  try {
    const data = await resultDAO.list();
    console.log(`Got ${data.Items.length} results`);
    res.status(200).json(data.Items);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching results" });
  }
};
