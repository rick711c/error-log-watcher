import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3clinet } from "./s3client";

export async function s3FileStreamDownloader(bucket: string, key: string) {
  try {
    const params = {
      Bucket: bucket,
      Key: key,
    };
    const command = new GetObjectCommand(params);
    const res = await s3clinet.send(command);
    const stream = res.Body as ReadableStream<any>;
    return stream;
  } catch (err) {
    throw new Error("failed to download the file from s3");
  }
}
