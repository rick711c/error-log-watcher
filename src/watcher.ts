// s3Watcher.js
import { Observable } from "rxjs";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { s3clinet } from "./s3client";


export async function watchS3Bucket(
  intervalMs: number = 5000
) {
  return new Observable((subscriber) => {
    let lastSeen = new Set();

    const interval = setInterval(async () => {
      try {
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME as string,
        };
        const command = new ListObjectsV2Command(params);
        const data = (await s3clinet.send(command)).Contents || [];
        const newFiles = data.filter(
          (item) => item.Key && !lastSeen.has(item.Key)
        );
        newFiles.forEach((item) => {
          lastSeen.add(item.Key);
          subscriber.next(item.Key);
        });
      } catch {
        throw new Error("Failed to list objects in S3 bucket");
      }
    }, intervalMs);

    return () => clearInterval(interval);
  });
}
