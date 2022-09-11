import { OsLanguage } from "../opensubtitles/types";
import { AskQuestion } from "../utils/askquestion";
import { ErrorMessage } from "../utils/messages";

export const AskLanguage = async (
  validLanguages: OsLanguage[]
): Promise<OsLanguage> => {
  const chosenLanguage = await AskQuestion(
    "In wich language do you want to download subtitles?\n\rType 'show' to view all available languages\n\rLanguage code: "
  );

  if (chosenLanguage === "show") {
    console.table(validLanguages);
    return AskLanguage(validLanguages);
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
