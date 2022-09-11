import * as https from "https";
import * as fs from "fs";

export const DownloadFile = (url: string, dest: string) => {
  return new Promise<void>((resolve) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on("finish", () => {
        file.close(() => resolve());
      });
    });
  });
};
