// s3Watcher.js
import { Observable } from "rxjs";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { s3clinet } from "./s3client";
import * as dotenv from "dotenv";
import { TrackLogType } from "./util/enum";
dotenv.config();

const date = generateFilePathDate();
const prefixies = [
  `${TrackLogType.CENTRAL_BATCH_JOB}/error/${date}`,
  `${TrackLogType.CENTRAL_BATCH_PAGES}/error/${date}`,
  `${TrackLogType.SCAN_SYNC_FAILED_INSERT}/error/${date}`,
  `${TrackLogType.SCAN_REJECT_INSERT}/error/${date}`,
  `${TrackLogType.SCAN_TRACE_INSERT}/error/${date}`,
  `${TrackLogType.SCAN_SYNC_INSERT}/error/${date}`,
];

export function watchS3Bucket(bucket: string, intervalMs: number = 5000) {
  return new Observable((subscriber) => {
    let lastSeen = new Set();

    const interval = setInterval(async () => {
      try {
        for (let i = 0; i < prefixies.length; i++) {
          const params = {
            Bucket: bucket,
            Prefix: prefixies[i],
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
        }
      } catch (err) {
        console.log(err);
        // console.error(err.message)
        throw new Error("Failed to list objects in S3 bucket");
      }
    }, intervalMs);

    return () => clearInterval(interval);
  });
}

function generateFilePathDate(): string {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();

  const datePart = `${day}-${month}-${year}`;

  return datePart;
}
