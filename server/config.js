const awsConfig = {
  accessKeyId: "YOUR_ACCESS_KEY_ID",
  secretAccessKey: "YOUR_SECRET_ACCESS_KEY",
  region: "us-east-1",
  endpoint: "http://localhost:8000",
};

const courseTableName = "courses";
const studentTableName = "students";
const resultTableName = "results";

module.exports = {
  awsConfig,
  courseTableName,
  studentTableName,
  resultTableName,
};
