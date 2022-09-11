import {
  OpensubtitleSettings,
  OsDownloadRequest,
  OsDownloadResponse,
  OsItem,
  OsLanguage,
  OsPaginatedResponse,
  OsRequest,
  OsResponse,
} from "./types";
import got from "got";

export class OpenSubtitles {
  private readonly _baseUrl: string = "https://api.opensubtitles.com/api/v1/";
  private readonly _settings: OpensubtitleSettings;

  constructor(settings: OpensubtitleSettings) {
    this._settings = settings;
  }

  public async languages(): Promise<OsLanguage[]> {
    const request: OsRequest<any> = {
      method: "GET",
      relativePath: "infos/languages",
    };

    return this._call<OsResponse<OsLanguage>>(request).then((response) => {
      return response.data;
    });
  }

  public async search(moviehash: string) {
    const request: OsRequest<any> = {
      method: "GET",
      relativePath: "subtitles",
    };

    const parameters = new URLSearchParams();
    parameters.set("moviehash", moviehash);

    return this._call<OsPaginatedResponse<OsItem>>(request, parameters);
  }

  public async downloadSubtitle(item: OsItem) {
    const request: OsRequest<OsDownloadRequest> = {
      method: "POST",
      relativePath: "download",
      body: {
        file_id: item.attributes.files[0]?.file_id,
      },
    };

    return this._call<OsDownloadResponse>(request);
  }

  public login() {}

  public logout() {}

  private async _call<TResponse>(
    request: OsRequest<object>,
    parameters?: URLSearchParams
  ): Promise<TResponse> {
    let endpoint = `${this._baseUrl}${request.relativePath}`;
    if (parameters) {
      endpoint += `?${parameters.toString()}`;
    }

    return await got(endpoint, {
      method: request.method,
      body: request.body && JSON.stringify(request.body),
      headers: {
        Accept: "*/*",
        "User-Agent": this._settings.appName,
        "Api-Key": this._settings.apiKey,
        "Content-Type": "application/json",
      },
    }).json<TResponse>();
  }
}
