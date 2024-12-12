import dotenv from 'dotenv';
import {
  SignUpCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { getAwsSecretHash } from './client-secret.js';

dotenv.config();

const cognitoClient = new CognitoIdentityProviderClient({ 
  region: process.env.AWS_COGNITO_REGION, 
});

export const handler = async (event) => {
  const { email, password } = event;

  const command = new SignUpCommand({
    ClientId: process.env.AWS_COGNITO_CLIENT_ID,
    Username: email,
    Password: password,
    SecretHash: getAwsSecretHash(email),
    UserAttributes: [{ Name: "email", Value: email }],
  });

  try {
    const response = await cognitoClient.send(command);

    return {
      statusCode: 200,
      response,
    };
  } catch (error) {
    console.error('Error during signUp:', error);

    throw new Error('SignUp failed.');
  }
};