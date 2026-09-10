import { z } from "zod";

import { SearchEntity, SearchMode, SortOrder } from "./search.types";

/*
|--------------------------------------------------------------------------
| Common Search Query
|--------------------------------------------------------------------------
*/

const searchQuerySchema = z.object({
  keyword: z.string().trim().min(1, "Keyword is required."),

  page: z.coerce.number().min(1).default(1),

  limit: z.coerce.number().min(1).max(100).default(10),

  sortBy: z.string().optional(),

  sortOrder: z.nativeEnum(SortOrder).optional(),

  mode: z.nativeEnum(SearchMode).optional(),
});

/*
|--------------------------------------------------------------------------
| Global Search
|--------------------------------------------------------------------------
*/

export const globalSearchSchema = z.object({
  query: searchQuerySchema,
});

/*
|--------------------------------------------------------------------------
| Candidate Search
|--------------------------------------------------------------------------
*/

export const candidateSearchSchema = z.object({
  query: searchQuerySchema,
});

/*
|--------------------------------------------------------------------------
| Employee Search
|--------------------------------------------------------------------------
*/

export const employeeSearchSchema = z.object({
  query: searchQuerySchema,
});

/*
|--------------------------------------------------------------------------
| Company Search
|--------------------------------------------------------------------------
*/

export const companySearchSchema = z.object({
  query: searchQuerySchema,
});

/*
|--------------------------------------------------------------------------
| Branch Search
|--------------------------------------------------------------------------
*/

export const branchSearchSchema = z.object({
  query: searchQuerySchema,
});

/*
|--------------------------------------------------------------------------
| Center Search
|--------------------------------------------------------------------------
*/

export const centerSearchSchema = z.object({
  query: searchQuerySchema,
});

/*
|--------------------------------------------------------------------------
| Subject Search
|--------------------------------------------------------------------------
*/

export const subjectSearchSchema = z.object({
  query: searchQuerySchema,
});

/*
|--------------------------------------------------------------------------
| Chapter Search
|--------------------------------------------------------------------------
*/

export const chapterSearchSchema = z.object({
  query: searchQuerySchema,
});

/*
|--------------------------------------------------------------------------
| Topic Search
|--------------------------------------------------------------------------
*/

export const topicSearchSchema = z.object({
  query: searchQuerySchema,
});

/*
|--------------------------------------------------------------------------
| Question Search
|--------------------------------------------------------------------------
*/

export const questionSearchSchema = z.object({
  query: searchQuerySchema,
});

/*
|--------------------------------------------------------------------------
| Paper Search
|--------------------------------------------------------------------------
*/

export const paperSearchSchema = z.object({
  query: searchQuerySchema,
});

/*
|--------------------------------------------------------------------------
| Exam Search
|--------------------------------------------------------------------------
*/

export const examSearchSchema = z.object({
  query: searchQuerySchema,
});

/*
|--------------------------------------------------------------------------
| Result Search
|--------------------------------------------------------------------------
*/

export const resultSearchSchema = z.object({
  query: searchQuerySchema,
});

/*
|--------------------------------------------------------------------------
| Certificate Search
|--------------------------------------------------------------------------
*/

export const certificateSearchSchema = z.object({
  query: searchQuerySchema,
});

/*
|--------------------------------------------------------------------------
| Search Suggestions
|--------------------------------------------------------------------------
*/

export const searchSuggestionSchema = z.object({
  query: z.object({
    keyword: z.string().trim().min(1),

    entity: z.nativeEnum(SearchEntity).optional(),

    limit: z.coerce.number().min(1).max(20).default(10),
  }),
});
