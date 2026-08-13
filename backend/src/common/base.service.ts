import { Document } from "mongoose";
import ApiError from "../utils/ApiError";
import { HTTP_STATUS } from "../constants/httpStatus";
import { BaseRepository } from "./base.repository";

export class BaseService<T> {
  constructor(
    protected readonly repository: BaseRepository<T>,
    protected readonly entityName: string = "Document"
  ) {}

  async create(payload: Partial<T>, session?: import("mongoose").ClientSession) {
    return await this.repository.create(payload, session);
  }

  async getById(id: string, populateFields?: string[]) {
    const doc = await this.repository.findById(id, populateFields);
    if (!doc) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, `${this.entityName} not found.`);
    }
    return doc;
  }

  async getActiveById(id: string, populateFields?: string[]) {
    const doc = await this.repository.findById(id, populateFields);
    if (!doc) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, `${this.entityName} not found.`);
    }
    
    if ((doc as any).status !== undefined && ["DELETED", "ARCHIVED", "BANNED"].includes(String((doc as any).status).toUpperCase())) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, `${this.entityName} is disabled or archived and cannot be used.`);
    }
    
    return doc;
  }

  async getAll(
    filters: {
      page?: number;
      limit?: number;
      search?: string;
      searchFields?: string[];
      extraQuery?: Record<string, unknown>;
      [key: string]: any;
    },
    populateFields?: string[]
  ): Promise<{
    data?: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    [key: string]: any;
  }> {
    return await this.repository.findAll(filters, populateFields);
  }

  async update(id: string, payload: Partial<T>, populateFields?: string[], session?: import("mongoose").ClientSession) {
    const doc = await this.repository.update(id, payload, populateFields, session);
    if (!doc) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, `${this.entityName} not found.`);
    }
    return doc;
  }

  async updateStatus(id: string, status: string, populateFields?: string[], session?: import("mongoose").ClientSession) {
    const doc = await this.repository.updateStatus(id, status, populateFields, session);
    if (!doc) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, `${this.entityName} not found.`);
    }
    return doc;
  }

  async delete(id: string, session?: import("mongoose").ClientSession) {
    const doc = await this.repository.softDelete(id, session);
    if (!doc) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, `${this.entityName} not found.`);
    }
    return doc;
  }

  async restore(id: string, session?: import("mongoose").ClientSession) {
    const doc = await this.repository.restore(id, session);
    if (!doc) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, `${this.entityName} not found.`);
    }
    return doc;
  }

  async count(extraQuery?: Record<string, unknown>) {
    return await this.repository.count(extraQuery);
  }
}
