const AWS = require("aws-sdk");
const { awsConfig } = require("../config.js");

AWS.config.update(awsConfig);
const dynamodb = new AWS.DynamoDB.DocumentClient();

const resultTableName = "results";

const resultDAO = {
  // create or udpate a result
  post: async (result) => {
    const params = {
      TableName: resultTableName,
      Item: result,
    };
    return await dynamodb.put(params).promise();
  },

  // list all results
  list: async () => {
    const params = {
      TableName: resultTableName,
    };
    return await dynamodb.scan(params).promise();
  },

  // query by course name
  queryByCourse: async (courseName) => {
    const params = {
      TableName: resultTableName,
      KeyConditionExpression: "courseName = :val",
      ExpressionAttributeValues: { ":val": courseName },
    };
    return await dynamodb.query(params).promise();
  },

  // query by student name
  queryByStudent: async (studentEmail) => {
    const params = {
      TableName: resultTableName,
      IndexName: "studentEmail",
      KeyConditionExpression: "studentEmail = :val",
      ExpressionAttributeValues: { ":val": studentEmail },
    };
    return await dynamodb.query(params).promise();
  },
};

module.exports = resultDAO;
