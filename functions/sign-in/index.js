const AWS = require("aws-sdk");
const { HEADERS } = require("/opt/nodejs/index");
const COGNITO_CLIENT = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-19",
  region: "us-east-1"
});

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const user_pool_id = process.env.USER_POOL;
  const client_id = process.env.USER_POOL_CLIENT;
  const params = {
    AuthFlow: "ADMIN_NO_SRP_AUTH", 
    UserPoolId: user_pool_id,
    ClientId: client_id,
    AuthParameters: {
        USERNAME: body.email,
        PASSWORD: body.password
      }
  };
  let response; 
  await COGNITO_CLIENT.adminInitiateAuth(params).promise()
  .then((res) =>{
    response = {
        statusCode: 200,
        body: JSON.stringify({
            message: "User authenticated successfully",
            token: res.AuthenticationResult.AccessToken
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