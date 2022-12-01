const AWS = require("aws-sdk");

const COGNITO_CLIENT = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-19",
  region: "us-east-1"
});
const dynamodb = new AWS.DynamoDB();

exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    const token = body.token;
    const follow = body.follow;
    const params = {
        AccessToken: token
    };
    let user;
    let response;
    try {
        user = await COGNITO_CLIENT.getUser(params).promise();
    } catch (error) {
        return{
            statusCode: error.statusCode,
            body: JSON.stringify({ message: error.code })
        }
    }
    
    const username = user.Username;
    
    const paramsTweet = {
        Key: {
            "user":{
                S: username
            },
            "follow":{
                S: follow
            }
        },
    TableName: process.env.FOLLOWERS_TABLE_NAME
    };
    await dynamodb.deleteItem(paramsTweet).promise()
    .then(() =>{
        response = {
            statusCode: 200,
            body: JSON.stringify({
                message: "Follower deleted successfully"
            })
          };
    })
    .catch((error) =>{
        console.log("ERROR FROM DYNAMODB DELETEFOLLOWER => ", error);
        response = {
            statusCode: error.statusCode,
            body: JSON.stringify( { message: error.code } )
        };
    })
    return response;
 
};