import { OsLanguage } from "../opensubtitles/types";
import { AskQuestion } from "../utils/askquestion";
import { ErrorMessage } from "../utils/messages";

export const AskLanguage = async (
  validLanguages: OsLanguage[]
): Promise<OsLanguage> => {
  const chosenLanguage = await AskQuestion(
    "In wich language do you want to download subtitles?\n\rType 'show' to view all available language codes. Type 'all' to fetch all available subtitles.\n\rLanguage code: "
  );

  if (chosenLanguage === "show") {
    console.table(validLanguages);
    return AskLanguage(validLanguages);
  }

  if (chosenLanguage === "all") {
    return {
      language_code: "all",
      language_name: "All",
    };
  }

  const osLanguage = validLanguages.find(
    (language) => language.language_code === chosenLanguage
  );

  if (osLanguage) {
    return osLanguage;
  } else {
    ErrorMessage("Invalid language code given.");
    return AskLanguage(validLanguages);
  }
};
