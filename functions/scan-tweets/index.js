const { HEADERS, scanItems } = require("/opt/nodejs/index");

exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    const limit = body.limit ? body.limit : 10;
    const lastKey = body.lastKey ? body.lastKey: undefined;
    const dataScan = {
        limit
    };
    if(lastKey) dataScan.lastKey = lastKey;
    let response;
    try {
        const tweets = await scanItems(dataScan);
        response = {
            statusCode: 200,
            body: JSON.stringify({
                tweets: tweets.tweets,
                lastKey: tweets.lastKey
            }),
            headers: HEADERS
        }
    } catch (error) {
        console.log("ERROR FROM DYNAMODB SCAN => ", error);
        response = {
            statusCode: error.statusCode,
            body: JSON.stringify( { message: error.code } ),
            headers: HEADERS
        };
    }
    
   return response;
};