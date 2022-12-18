const AWS = require("aws-sdk");
const {randomUUID} = require('crypto');
const { HEADERS } = require("/opt/nodejs/index");
const COGNITO_CLIENT = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-19",
  region: "us-east-1"
});
const dynamodb = new AWS.DynamoDB();
const moment = require('moment');

exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    const token = body.token;
    const tweet = body.tweet;
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
    const nickname = user.UserAttributes.find((item)=>item.Name === "custom:username").Value;
    const paramsTweet = {
        Item: {
            "user":{
                S: username
            },
            "tweet-id":{
                S: randomUUID()
            },
            "tweet":{
                S: tweet
            },
            "nickname":{
                S: nickname
            },
            "createdAt":{
                S: moment().format('YYYY-MM-DD HH:mm:ss')
            }
        },
    ReturnConsumedCapacity: "TOTAL", 
    TableName: process.env.TWEETS_TABLE_NAME
    };
    await dynamodb.putItem(paramsTweet).promise()
    .then(() =>{
        response = {
            statusCode: 200,
            body: JSON.stringify({
                message: "Tweet created successfully"
            }),
            headers: HEADERS
          };
    })
    .catch((error) =>{
        console.log("ERROR FROM DYNAMODB PUTITEM => ", error);
        response = {
            statusCode: error.statusCode,
            body: JSON.stringify( { message: error.code } ),
            headers: HEADERS
        };
    })
    return response;
 
};