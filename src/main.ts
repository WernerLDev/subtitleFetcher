#!/usr/bin/env node
import yargs from "yargs/yargs";
import { headAsciiArt, subhead } from "./constants";
import { BlueMessage, ErrorMessage, InfoMessage } from "./utils/messages";
import { AskQuestion } from "./utils/askquestion";
import { OpenSubtitles } from "./opensubtitles/opensubtitles";
import { AskLanguage } from "./questions/ask-language";
import * as fs from "fs";
import { GenerateOpenSubtitleHash } from "./opensubtitles/opensubtitlehash";
import chalk from "chalk";
import { DownloadFile } from "./utils/downloadFile";

(async () => {
  /**
   * Header of output with some fancy ASCII-art
   */
  BlueMessage(headAsciiArt);
  InfoMessage(subhead);
  //console.log("\n\r");

  /**
   * Parsing command line arguments
   * language: countrycode (eg: en, nl, de)
   * movie: path to an mp4 file (required)
   */
  const argv = yargs(process.argv.slice(2))
    .options({
      language: { type: "string" },
      movie: { type: "string", demandOption: true },
    })
    .parseSync();

  /**
   * Check if given movie points to an existing file on disk
   */
  if (!fs.existsSync(argv.movie)) {
    ErrorMessage(`The movie '${argv.movie}' could not be found`);
    await AskQuestion("[Press enter]");
    return;
  }

  const movieDirectory = argv.movie.split("/").slice(0, -1).join("/");

  const processName = (release: string) => {
    if (fileName?.startsWith(release)) {
      return chalk.bgYellow(chalk.black(release));
    }
    return release;
  };

  const fileName = argv.movie.split("/").pop() ?? "";
  InfoMessage(`Selected file: ${processName(fileName)}`);

  const client = new OpenSubtitles({
    apiKey: "OsAfYaKxddIdKM3bilkrJbXXwlirNPkz",
    appName: "KDEServiceMenu",
  });

  /**
   * Determine in which language the subtitles need to be
   */
  const languages = await client.languages();
  let chosenLanguage = languages.find((x) => x.language_code === argv.language);

  if (chosenLanguage == undefined) {
    chosenLanguage = await AskLanguage(languages);
  }

  InfoMessage(`Chosen language: ${chosenLanguage.language_name}`);

  /**
   * Generate moviehash and search subtitles
   */
  const moviehash = await GenerateOpenSubtitleHash(argv.movie);

  const searchResponse = await client.search(moviehash, fileName);
  const filteredSearchResponse = searchResponse.data.filter(
    (x) =>
      x.attributes.language === chosenLanguage?.language_code ||
      chosenLanguage?.language_code == "all"
  );

  if (searchResponse.total_count > 0) {
    InfoMessage(
      filteredSearchResponse
        .map(
          (row, index) =>
            `${index} - ${processName(row.attributes.release)} (${
              row.attributes.language
            })`
        )
        .join("\n\r")
    );

    let indexAsString: string | null = null;
    let subtitleIndex: number | null = null;

    while (!subtitleIndex || !filteredSearchResponse[subtitleIndex]) {
      indexAsString = await AskQuestion("Choose subtitle to download: ");
      subtitleIndex = Number.parseInt(indexAsString);
    }

    const downloadResponse = await client.downloadSubtitle(
      searchResponse.data[subtitleIndex]
    );

    InfoMessage(JSON.stringify(searchResponse.data[subtitleIndex]));

    try {
      await DownloadFile(
        downloadResponse.link,
        `${movieDirectory}/${downloadResponse.file_name}`
      );
    } catch (e) {
      console.log(e);
    }

    InfoMessage(
      `Downloaded ${downloadResponse.file_name} to current directory.`
    );
  } else {
    ErrorMessage("No subtitles found :(");
  }

  AskQuestion("[Press enter to close terminal]");
})();
