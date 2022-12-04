const AWS = require("aws-sdk");

const dynamodb = new AWS.DynamoDB();

exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    const limit = body.limit ? body.limit : 10;
    const lastKey = body.lastKey ? body.lastKey: undefined;
    const paramsTweet = {
        TableName: process.env.TWEETS_TABLE_NAME,
        Limit: limit
    };
    if(lastKey) paramsTweet.ExclusiveStartKey = lastKey;
    await dynamodb.scan(paramsTweet).promise()
    .then((res) =>{
        response = {
            statusCode: 200,
            body: JSON.stringify( { 
                tweets: res.Items.map(item =>{
                    return(
                        {
                            tweetID: item["tweet-id"]["S"],
                            user: item["user"]["S"],
                            tweet: item["tweet"]["S"]
                        }
                    )
                }) ,
                lastKey:  res.LastEvaluatedKey 
            } )
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