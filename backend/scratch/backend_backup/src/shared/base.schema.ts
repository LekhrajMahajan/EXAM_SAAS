import { Schema } from "mongoose";

export const BaseSchemaFields = {
  isDeleted: {
    type: Boolean,
    default: false,
    index: true,
  },

  deletedAt: {
    type: Date,
    default: null,
  },

  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
};

const CompanySchema = new Schema(
  {
    companyName: String,

    ...BaseSchemaFields,
  },
  {
    timestamps: true,
  }
);

export default CompanySchema;