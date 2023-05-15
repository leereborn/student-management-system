const AWS = require("aws-sdk");
const { awsConfig, studentTableName } = require("../config.js");

AWS.config.update(awsConfig);
const dynamodb = new AWS.DynamoDB.DocumentClient();

const studentDAO = {
  // create or udpate a student
  post: async (student) => {
    const params = {
      TableName: studentTableName,
      Item: student,
    };
    return await dynamodb.put(params).promise();
  },

  // list all students
  list: async () => {
    const params = {
      TableName: studentTableName,
    };
    return await dynamodb.scan(params).promise();
  },

  // get a student
  get: async (email) => {
    const params = {
      TableName: studentTableName,
      Key: {
        email,
      },
    };
    return await dynamodb.get(params).promise();
  },
};

module.exports = studentDAO;
