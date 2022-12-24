const AWS = require("aws-sdk");
const { HEADERS, getItems } = require("/opt/nodejs/index");
const COGNITO_CLIENT = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-19",
  region: "us-east-1"
});

exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    const limit = body.limit ? body.limit : 10;
    const lastKey = body.lastKey ? body.lastKey: undefined;
    const token = body.token;
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
    const getData = {
        user: username,
        limit
    };
    if(lastKey) getData.lastKey = lastKey;
    try {
        const result = await getItems(getData);
        response = {
            statusCode: 200,
            body: JSON.stringify({
                tweets: result
            }),
            headers: HEADERS
        };
    } catch (error) {
        console.log("ERROR FROM GET ITEMS => ", error);
        response = {
            statusCode: error.statusCode,
            body: JSON.stringify( { message: error.code } ),
            headers: HEADERS
        };
    }
    return response;

};