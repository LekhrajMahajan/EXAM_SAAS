import { Request, Response } from "express";
import httpStatus from "http-status";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";

import searchService from "./search.service";
import { SearchEntity } from "./search.types";

/*
|--------------------------------------------------------------------------
| Global Search
|--------------------------------------------------------------------------
*/

export const globalSearch = asyncHandler(
  async (req: Request, res: Response) => {
    const results = await searchService.globalSearch(req.body.query || req.query);

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Global search completed successfully",
      data: results,
    });
  }
);

/*
|--------------------------------------------------------------------------
| Entity Search
|--------------------------------------------------------------------------
*/

export const searchByEntity = asyncHandler(
  async (req: Request, res: Response) => {
    const { entity } = req.params;
    const results = await searchService.searchByEntity(
      entity as SearchEntity,
      req.body.query || req.query
    );

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: `${entity} search completed successfully`,
      data: results,
    });
  }
);

/*
|--------------------------------------------------------------------------
| Search Suggestions
|--------------------------------------------------------------------------
*/

export const getSuggestions = asyncHandler(
  async (req: Request, res: Response) => {
    const results = await searchService.getSuggestions(req.body.query || req.query);

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Search suggestions fetched successfully",
      data: results,
    });
  }
);
