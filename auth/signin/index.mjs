import dotenv from 'dotenv';
import {
  InitiateAuthCommand,
  CognitoIdentityProviderClient,
  AuthFlowType
} from '@aws-sdk/client-cognito-identity-provider';
import { getAwsSecretHash } from './client-secret.js';

dotenv.config();

const cognitoClient = new CognitoIdentityProviderClient({ 
  region: process.env.AWS_COGNITO_REGION,
});

export const handler = async (event) => {
  const { email, password } = event;
  
  const command = new InitiateAuthCommand({
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
      SECRET_HASH: getAwsSecretHash(email)
    },
    ClientId: process.env.AWS_COGNITO_CLIENT_ID,
  });

  try {
    const response = await cognitoClient.send(command);
    
    return {
      statusCode: 200,
      response: response,
    };
  } catch (error) {
    console.error('Error during signIn:', error);

    throw new Error('SignIn failed.');
  }
};