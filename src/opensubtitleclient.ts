const OS = require("opensubtitles.com");
const os = new OS({ apikey: "OsAfYaKxddIdKM3bilkrJbXXwlirNPkz" });

export class OpensubtitlesClient {
  public constructor() {}

  public search(query: string) {
    console.log(os);

    os.languages()
      .then((response: object) => {
        console.log(response);
        /* response {
        total_pages: 1,
        total_count: 13,
        page: 1,
        data: <SUBTITLES LIST>
      } */
      })
      .catch(console.error);
  }
}
