const AWS = require("aws-sdk");
const { HEADERS, updateItem } = require("/opt/nodejs/index");
const COGNITO_CLIENT = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-19",
  region: "us-east-1"
});

exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    const token = body.token;
    const tweetId = body.tweetID;
    const newTweet = body.newTweet;
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
    const updateData = {
        user: username,
        tweetId,
        tweet: newTweet
    };

    try {
        await updateItem(updateData);
        response = {
            statusCode: 200,
            body: JSON.stringify({
                message: "Tweet updated successfully"
            }),
            headers: HEADERS
        };
    } catch (error) {
        console.log("ERROR FROM UPDATE ITEM => ", error);
        response = {
            statusCode: error.statusCode,
            body: JSON.stringify( { message: error.code } ),
            headers: HEADERS
        };
    }
    
    return response;
 
};