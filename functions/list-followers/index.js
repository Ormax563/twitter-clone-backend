const AWS = require("aws-sdk");

const dynamodb = new AWS.DynamoDB();

exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    const user = body.user;
    const limit = body.limit ? body.limit : 1;
    const lastKey = body.lastKey ? body.lastKey: undefined;
    const paramsFollowers = {
        ExpressionAttributeValues: {
            ":v1": {
                S: user
               }
        },
        TableName: process.env.FOLLOWERS_TABLE_NAME,
        KeyConditionExpression: "follow = :v1",
        IndexName: process.env.FOLLOWERS_GSI_NAME,
        Limit: limit
    };
    if(lastKey) paramsFollowers.ExclusiveStartKey = lastKey;
    await dynamodb.query(paramsFollowers).promise()
    .then((res) =>{
        response = {
            statusCode: 200,
            body: JSON.stringify( { 
                followers: res.Items,
                lastKey:  res.LastEvaluatedKey 
            } )
          };
    })
    .catch((error) =>{
        console.log("ERROR FROM DYNAMODB SCAN => ", error);
        response = {
            statusCode: error.statusCode,
            body: JSON.stringify( { message: error.code } )
        };
    })
    return response;
 
};