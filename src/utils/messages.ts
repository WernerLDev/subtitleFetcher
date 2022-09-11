import chalk from "chalk";
import { border } from "../constants";

export const ErrorMessage = (msg: string) => {
  console.log(chalk.red(border));
  console.log(chalk.red("Error: " + msg));
  console.log(chalk.red(border));
};

export const SuccessMessage = (msg: string) => {
  console.log(chalk.green(border));
  console.log(chalk.green("Success: " + msg));
  console.log(chalk.green(border));
};

export const BlueMessage = (msg: string) => {
  console.log(chalk.blue(msg));
};

export const InfoMessage = (msg: string) => {
  console.log(border);
  console.log(msg);
  console.log(border);
};
