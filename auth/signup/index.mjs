import {
  CognitoUserAttribute,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';

export const handler = async (event) => {
  const { email, password, name } = event;

  const userPool = new CognitoUserPool({
    UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
    ClientId: process.env.AWS_COGNITO_CLIENT_ID,
  });

  const attributesList = [
    new CognitoUserAttribute({ Name: 'name', Value: name }),
    new CognitoUserAttribute({ Name: 'email', Value: email }),
  ];

  try {
    const response = await new Promise((resolve, reject) => {
      userPool.signUp(name, password, attributesList, null, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });

    return response;
  } catch (error) {
    console.error({ error });

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to sign up",
        error: error.message,
      }),
    };
  }
};