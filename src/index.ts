import { readLogStream } from "./readLogStream";
import { s3FileStreamDownloader } from "./s3downloader";
import { watchS3Bucket } from "./watcher";
const bucket = process.env.AWS_BUCKET_NAME as string;
watchS3Bucket(bucket).subscribe({
  next: async (key) => {
    const stream = await s3FileStreamDownloader(bucket,key as string);
    const data = await readLogStream(stream)
    console.log(data);
  },
  error: (err) => console.error(err),
});
