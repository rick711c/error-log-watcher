async function streamToString(stream: ReadableStream<any>) {
  const chunks = [];
  // `for await...of` iterates over the stream asynchronously
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  // Concatenate all chunks and convert the buffer to a UTF-8 string
  return Buffer.concat(chunks).toString("utf8");
}

export async function readLogStream(stream: ReadableStream<any>) {
  try {
    const jsonString = await streamToString(stream);
    return JSON.parse(jsonString);
  } catch (err) {
    throw new Error("failed to read the stream");
  }
}
