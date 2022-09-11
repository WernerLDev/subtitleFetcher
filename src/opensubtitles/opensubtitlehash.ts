import * as fs from "fs";

export async function GenerateOpenSubtitleHash(
  filePath: string
): Promise<string> {
  let HASH_CHUNK_SIZE = 65536, //64 * 1024
    size = fs.statSync(filePath).size,
    longs: number[] = [],
    temp = size;

  function read(start: number, end?: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const stream: fs.ReadStream = fs.createReadStream(filePath, {
        start: start,
        end: end,
      });

      const chunks: Buffer[] = [];
      stream.on("data", (chunk: Buffer) => {
        chunks.push(chunk);
      });
      stream.on("error", (error) => {
        reject(error.message);
      });
      stream.on("end", () => {
        resolve(Buffer.concat(chunks).toString("binary"));
      });
    });
  }

  function process(chunk: string) {
    for (var i = 0; i < chunk.length; i++) {
      longs[(i + 8) % 8] += chunk.charCodeAt(i);
    }
  }

  function bin2hex(bytes: number[]) {
    const b = 255;
    bytes[1] += bytes[0] >> 8;
    bytes[0] = bytes[0] & b;
    bytes[2] += bytes[1] >> 8;
    bytes[1] = bytes[1] & b;
    bytes[3] += bytes[2] >> 8;
    bytes[2] = bytes[2] & b;
    bytes[4] += bytes[3] >> 8;
    bytes[3] = bytes[3] & b;
    bytes[5] += bytes[4] >> 8;
    bytes[4] = bytes[4] & b;
    bytes[6] += bytes[5] >> 8;
    bytes[5] = bytes[5] & b;
    bytes[7] += bytes[6] >> 8;
    bytes[6] = bytes[6] & b;
    bytes[7] = bytes[7] & b;

    let hexString = bytes
      .reverse()
      .map((x) => x.toString(16))
      .join("");

    if (hexString.length % 2) hexString = "0" + hexString;
    return hexString;
  }

  for (var i = 0; i < 8; i++) {
    longs[i] = temp & 255;
    temp = temp >> 8;
  }

  process(await read(0, HASH_CHUNK_SIZE - 1));
  process(await read(Math.max(size - HASH_CHUNK_SIZE, 0)));

  return bin2hex(longs);
}
