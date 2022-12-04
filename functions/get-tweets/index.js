const AWS = require("aws-sdk");

const COGNITO_CLIENT = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-19",
  region: "us-east-1"
});
const dynamodb = new AWS.DynamoDB();

exports.handler = async (event) => {
    const body = JSON.parse(event.body);
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
    
    const paramsTweet = {
        ExpressionAttributeValues: {
            ":v1": {
                S: username
               }
        },
        KeyConditionExpression: "#user = :v1",
        TableName: process.env.TWEETS_TABLE_NAME,
        ExpressionAttributeNames: {
            "#user": "user"
        }
    };
    await dynamodb.query(paramsTweet).promise()
    .then((res) =>{
        response = {
            statusCode: 200,
            body: JSON.stringify( { tweets: res.Items.map(item =>{
                return(
                    {
                        tweetID: item["tweet-id"]["S"],
                        user: item["user"]["S"],
                        tweet: item["tweet"]["S"]
                    }
                )
            }) 
        })
        };
    })
    .catch((error) =>{
        console.log("ERROR FROM DYNAMODB QUERY => ", error);
        response = {
            statusCode: error.statusCode,
            body: JSON.stringify( { message: error.code } )
        };
    })
    return response;
 
};