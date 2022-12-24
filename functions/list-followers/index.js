const { HEADERS, getFollowers } = require("/opt/nodejs/index");

exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    const user = body.user;
    const limit = body.limit ? body.limit : 10;
    const lastKey = body.lastKey ? body.lastKey: undefined;
    const dataList = {
        user,
        limit
    };
    if(lastKey) dataList.lastKey = lastKey;
    try {
        const followers = await getFollowers(dataList);
        response = {
            statusCode: 200,
            body: JSON.stringify({
                followers: followers.followers,
                lastKey: followers.lastKey
            }),
            headers: HEADERS
        }
    } catch (error) {
        console.log("ERROR FROM LIST FOLLOWERS => ", error);
        response = {
            statusCode: error.statusCode,
            body: JSON.stringify( { message: error.code } ),
            headers: HEADERS
        };
    }

    return response;
};