const AWS = require("aws-sdk");
const { HEADERS, deleteItem } = require("/opt/nodejs/index");
const COGNITO_CLIENT = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-19",
  region: "us-east-1"
});

exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    const token = body.token;
    const tweetId = body.tweetID;
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
    const deleteData = {
        user: username,
        tweetId
    };
    try {
        await deleteItem(deleteData);
        response = {
            statusCode: 200,
            body: JSON.stringify({
                message: "Tweet deleted successfully"
            }),
            headers: HEADERS
          };
    } catch (error) {
        console.log("ERROR FROM DELETE FUNCTION =>", error);
        response = {
            statusCode: error.statusCode,
            body: JSON.stringify( { message: error.code } ),
            headers: HEADERS
        };
    }
    
    return response;
 
};