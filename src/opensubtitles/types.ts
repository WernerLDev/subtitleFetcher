export type OpensubtitleSettings = {
  apiKey: string;
  appName: string;
  username?: string;
  password?: string;
};

export type OsRequest<T> = {
  relativePath: string;
  method: "GET" | "POST" | "DELETE";
  body?: T;
};

export type OsResponse<T> = {
  data: T[];
};

export type OsPaginatedResponse<T> = OsResponse<T> & {
  total_pages: number;
  total_count: number;
  page: number;
};

export type OsLanguage = {
  language_code: string;
  language_name: string;
};

export type OsItem = {
  id: string;
  type: "subtitle";
  attributes: OsSubtitleAttributes;
};

export type OsSubtitleAttributes = {
  id: string;
  language: string;
  release: string;
  feature_details: OsSubtitleFeatureDetails;
  files: {
    file_id: number;
    cd_number: number;
    file_name: string;
  }[];
};

export type OsSubtitleFeatureDetails = {
  feature_id: number;
  feature_type: string;
  year: number;
  title: string;
  movie_name: string;
  imdb_id: number;
  tmdb_id: number;
};

export type OsDownloadRequest = {
  file_id: number;
  sub_format?: string;
  file_name?: string /* Desired filename */;
  in_fps?: number /* used for conversions, in_fps and out_fps must then be indicated */;
  out_fps?: number /* used for conversions, in_fps and out_fps must then be indicated */;
  timeshift?: number;
  force_download?: boolean;
};

export type OsDownloadResponse = {
  link: string;
  file_name: string;
  requests: number;
  remaining: number;
  message: string;
  reset_time: string;
  reset_time_utc: string;
};
