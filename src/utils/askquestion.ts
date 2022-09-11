import { createInterface } from "readline";

export const AskQuestion = (question: string) => {
  const readLine = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise<string>((resolve) => {
    readLine.question(question, resolve);
  }).finally(() => readLine.close());
};
