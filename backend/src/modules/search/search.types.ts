/*
|--------------------------------------------------------------------------
| Search Entity
|--------------------------------------------------------------------------
*/

export enum SearchEntity {
  CANDIDATE = "CANDIDATE",

  EMPLOYEE = "EMPLOYEE",

  COMPANY = "COMPANY",

  BRANCH = "BRANCH",

  CENTER = "CENTER",

  SUBJECT = "SUBJECT",

  CHAPTER = "CHAPTER",

  TOPIC = "TOPIC",

  QUESTION = "QUESTION",

  PAPER = "PAPER",

  EXAM = "EXAM",

  RESULT = "RESULT",

  CERTIFICATE = "CERTIFICATE",
}

/*
|--------------------------------------------------------------------------
| Search Mode
|--------------------------------------------------------------------------
*/

export enum SearchMode {
  GLOBAL = "GLOBAL",

  EXACT = "EXACT",

  PREFIX = "PREFIX",

  FULL_TEXT = "FULL_TEXT",
}

/*
|--------------------------------------------------------------------------
| Sort Order
|--------------------------------------------------------------------------
*/

export enum SortOrder {
  ASC = "ASC",

  DESC = "DESC",
}

/*
|--------------------------------------------------------------------------
| Search Request
|--------------------------------------------------------------------------
*/

export interface ISearchRequest {
  entity?: SearchEntity;

  keyword: string;

  page?: number;

  limit?: number;

  sortBy?: string;

  sortOrder?: SortOrder;

  mode?: SearchMode;

  filters?: Record<string, unknown>;
}

/*
|--------------------------------------------------------------------------
| Search Suggestion
|--------------------------------------------------------------------------
*/

export interface ISearchSuggestion {
  label: string;

  value: string;

  entity: SearchEntity;
}

/*
|--------------------------------------------------------------------------
| Search Result
|--------------------------------------------------------------------------
*/

export interface ISearchResult<T = unknown> {
  page: number;

  limit: number;

  total: number;

  totalPages: number;

  data: T[];
}
