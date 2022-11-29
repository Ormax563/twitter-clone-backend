const AWS = require("aws-sdk");

const COGNITO_CLIENT = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-19",
  region: "us-east-1"
});

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const params = {
    ClientId: process.env.USER_POOL_CLIENT, 
    Password: body.password, 
    Username: body.email, 
    UserAttributes: []
  };
  let response = {
    statusCode: 200,
    body: JSON.stringify({message: "User created successfully"})
  };
  await COGNITO_CLIENT.signUp(params).promise().catch((error)=>{
    console.log("ERROR FROM COGNITO =>", error);
    response = {
      statusCode: error.statusCode,
      body: JSON.stringify( { message: error.code } )
    };
  });
  
  return response;
};