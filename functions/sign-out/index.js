const AWS = require("aws-sdk");

const COGNITO_CLIENT = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-19",
  region: "us-east-1"
});

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const user_pool_id = process.env.USER_POOL;
  const params = {
    UserPoolId: user_pool_id,
    Username: body.email
 };
  let response; 
  await COGNITO_CLIENT.adminUserGlobalSignOut(params).promise()
  .then(() =>{
    response = {
        statusCode: 200,
        body: JSON.stringify({
            message: "Success sign-out"
        })
      };
  })
  .catch((error)=>{
    console.log("ERROR FROM COGNITO =>", error);
    response = {
      statusCode: error.statusCode,
      body: JSON.stringify( { message: error.code } )
    };
  });
  
  return response;
};