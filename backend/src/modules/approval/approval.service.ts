import { Model } from "mongoose";
import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";

export interface ApprovalConfig {
  entityName: string;
  statusField: string;
  reasonField?: string;
  statusMap: {
    submit?: string;
    review?: string;
    approve: string;
    reject: string;
    publish?: string;
  };
}

export class ApprovalService<T> {
  private model: Model<T>;
  private config: ApprovalConfig;

  constructor(model: Model<T>, config: ApprovalConfig) {
    this.model = model;
    this.config = config;
  }

  /*
  |--------------------------------------------------------------------------
  | Get By Id
  |--------------------------------------------------------------------------
  */

  async getById(id: string) {
    const doc = await this.model.findById(id);
    if (!doc) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, `${this.config.entityName} not found.`);
    }
    return doc;
  }

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */

  async submit(id: string) {
    if (!this.config.statusMap.submit) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Submit action not supported for ${this.config.entityName}.`);
    }

    const doc = await this.model.findById(id);
    if (!doc) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, `${this.config.entityName} not found.`);
    }

    const updatePayload: any = { [this.config.statusField]: this.config.statusMap.submit };
    return this.model.findByIdAndUpdate(id, updatePayload, { new: true });
  }

  /*
  |--------------------------------------------------------------------------
  | Review
  |--------------------------------------------------------------------------
  */

  async review(id: string) {
    if (!this.config.statusMap.review) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Review action not supported for ${this.config.entityName}.`);
    }

    const doc = await this.model.findById(id);
    if (!doc) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, `${this.config.entityName} not found.`);
    }

    const updatePayload: any = { [this.config.statusField]: this.config.statusMap.review };
    return this.model.findByIdAndUpdate(id, updatePayload, { new: true });
  }

  /*
  |--------------------------------------------------------------------------
  | Approve
  |--------------------------------------------------------------------------
  */

  async approve(id: string) {
    const doc = await this.model.findById(id);
    if (!doc) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, `${this.config.entityName} not found.`);
    }

    const updatePayload: any = { [this.config.statusField]: this.config.statusMap.approve };
    return this.model.findByIdAndUpdate(id, updatePayload, { new: true });
  }

  /*
  |--------------------------------------------------------------------------
  | Publish
  |--------------------------------------------------------------------------
  */

  async publish(id: string) {
    if (!this.config.statusMap.publish) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Publish action not supported for ${this.config.entityName}.`);
    }

    const doc = await this.model.findById(id);
    if (!doc) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, `${this.config.entityName} not found.`);
    }

    const updatePayload: any = { [this.config.statusField]: this.config.statusMap.publish };
    return this.model.findByIdAndUpdate(id, updatePayload, { new: true });
  }

  /*
  |--------------------------------------------------------------------------
  | Reject
  |--------------------------------------------------------------------------
  */

  async reject(id: string, reason?: string) {
    const doc = await this.model.findById(id);
    if (!doc) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, `${this.config.entityName} not found.`);
    }

    const updatePayload: any = { [this.config.statusField]: this.config.statusMap.reject };
    if (this.config.reasonField && reason) {
      updatePayload[this.config.reasonField] = reason;
    }

    return this.model.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true }
    );
  }
}
