import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import * as dotenv  from "dotenv"

dotenv.config(); 

function createS3Client(): S3Client {
  try {
    const identityClient = new CognitoIdentityClient({
      region: process.env.AWS_REGION as string,
    });

    const credentialsProvider = fromCognitoIdentityPool({
      client: identityClient,
      identityPoolId: process.env.AWS_COGNITOPOOLID as string,
    });

    return new S3Client({
      region: process.env.AWS_REGION as string,
      credentials: credentialsProvider,
    });
  } catch (error) {
    throw new Error("failed to create s3 client");
  }
}

export const s3clinet = createS3Client();
