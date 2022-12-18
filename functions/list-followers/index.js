const AWS = require("aws-sdk");
const { HEADERS } = require("/opt/nodejs/index");
const dynamodb = new AWS.DynamoDB();

exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    const user = body.user;
    const limit = body.limit ? body.limit : 10;
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
                followers: res.Items.map(item =>{
                    return(
                        {
                            follow: item["follow"]["S"],
                            user: item["user"]["S"]
                        }
                    )
                }),
                lastKey:  res.LastEvaluatedKey 
            } ),
            headers: HEADERS
          };
    })
    .catch((error) =>{
        console.log("ERROR FROM DYNAMODB SCAN => ", error);
        response = {
            statusCode: error.statusCode,
            body: JSON.stringify( { message: error.code } ),
            headers: HEADERS
        };
    })
    return response;
 
};