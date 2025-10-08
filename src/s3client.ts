import {  S3Client } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import * as dotenv from "dotenv";
import { NodeHttpHandler } from "@smithy/node-http-handler";
import { Agent as HttpsAgent } from "https";

dotenv.config();

function createS3Client(): S3Client {
  try {
    const identityClient = new CognitoIdentityClient({
      region: process.env.AWS_REGION as string,
      requestHandler: new NodeHttpHandler({
        connectionTimeout: 10000,
        socketTimeout: 15000,
        httpsAgent: new HttpsAgent({ keepAlive: true, family: 4 }), // Prefer IPv4
      }),
    });

    const credentialsProvider = fromCognitoIdentityPool({
      client: identityClient,
      identityPoolId: process.env.AWS_COGNITOPOOLID as string,
    });

    return new S3Client({
      region: process.env.AWS_REGION as string,
      credentials: credentialsProvider,
      requestHandler: new NodeHttpHandler({
        connectionTimeout: 10000,
        socketTimeout: 15000,
        httpsAgent: new HttpsAgent({ keepAlive: true, family: 4 }), // IPv4
      }),
    });
  } catch (error) {
    throw new Error("failed to create s3 client");
  }
}

export const s3clinet = createS3Client();
