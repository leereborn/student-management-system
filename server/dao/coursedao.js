const AWS = require("aws-sdk");
const { awsConfig } = require("../config.js");

AWS.config.update(awsConfig);
const dynamodb = new AWS.DynamoDB.DocumentClient();

const courseTableName = "courses";

const courseDAO = {
  // create or udpate a course
  post: async (course) => {
    const params = {
      TableName: courseTableName,
      Item: course,
    };
    return await dynamodb.put(params).promise();
  },
  // list all courses
  list: async () => {
    const params = {
      TableName: courseTableName,
    };
    return await dynamodb.scan(params).promise();
  },
};

module.exports = courseDAO;
