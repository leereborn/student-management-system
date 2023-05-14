const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

const deleteItem = async (params) => {
  return await dynamodb.delete(params).promise();
};

const deleteItems = async (params) => {
  const queryResult = await dynamodb.query(params).promise();
  for (const item of queryResult.Items) {
    const deleteParams = {
      TableName: "YourTableName",
      Key: {
        PartitionKey: item.PartitionKey,
        SortKey: item.SortKey,
      },
    };
    await deleteItem(deleteParams);
  }
};

module.exports = {
  deleteItem,
  deleteItems,
};
