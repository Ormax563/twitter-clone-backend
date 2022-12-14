const AWS = require("aws-sdk");
const { HEADERS } = require("/opt/nodejs/index");
const COGNITO_CLIENT = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-19",
  region: "us-east-1"
});

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const user_pool_id = process.env.USER_POOL;
  const token = body.token;
  const paramsUser = {
    AccessToken: token
  };
  let user;
  try {
      user = await COGNITO_CLIENT.getUser(paramsUser).promise();
  } catch (error) {
      return{
          statusCode: error.statusCode,
          body: JSON.stringify({ message: error.code })
      }
  }
  const params = {
    UserPoolId: user_pool_id,
    Username: user.Username
 };
  let response; 
  await COGNITO_CLIENT.adminUserGlobalSignOut(params).promise()
  .then(() =>{
    response = {
        statusCode: 200,
        body: JSON.stringify({
            message: "Success sign-out"
        }),
        headers: HEADERS
      };
  })
  .catch((error)=>{
    console.log("ERROR FROM COGNITO =>", error);
    response = {
      statusCode: error.statusCode,
      body: JSON.stringify( { message: error.code } ),
      headers: HEADERS
    };
  });
  
  return response;
};