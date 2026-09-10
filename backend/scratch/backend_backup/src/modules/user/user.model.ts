import mongoose, { Schema, model } from "mongoose";

import { Gender, UserLanguage, UserStatus, UserTheme } from "./user.types";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    middleName: {
      type: String,
      trim: true,
      default: null,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    employeeId: {
      type: String,
      trim: true,
      default: null,
    },

    department: {
      type: String,
      trim: true,
      default: null,
    },

    designation: {
      type: String,
      trim: true,
      default: null,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    username: {
      type: String,
      sparse: true,
      lowercase: true,
      trim: true,
    },

    mobileNumber: {
      type: String,
      required: true,
    },

    alternateMobile: {
      type: String,
      default: null,
    },

    password: {
      type: String,

      required: true,

      select: false,
    },

    role: {
      type: String,

      required: true,
    },

    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },

    gender: {
      type: String,

      enum: Object.values(Gender),
    },

    profileImage: {
      type: String,

      default: null,
    },

    status: {
      type: String,

      enum: Object.values(UserStatus),

      default: UserStatus.ACTIVE,
    },

    preferences: {
      theme: {
        type: String,

        enum: Object.values(UserTheme),

        default: UserTheme.SYSTEM,
      },

      language: {
        type: String,

        enum: Object.values(UserLanguage),

        default: UserLanguage.ENGLISH,
      },

      notifications: {
        email: {
          type: Boolean,

          default: true,
        },

        sms: {
          type: Boolean,

          default: true,
        },

        push: {
          type: Boolean,

          default: true,
        },
      },
    },

    devices: [
      {
        deviceId: String,

        deviceName: String,

        browser: String,
        
        browserVersion: String,

        operatingSystem: String,

        trusted: {
          type: Boolean,

          default: false,
        },
        
        isBlocked: {
          type: Boolean,
          
          default: false,
        },
        
        riskScore: {
          type: Number,
          
          default: 0,
        },

        ipAddress: String,
        
        location: String,
        
        firstLoginAt: Date,

        lastLoginAt: Date,
      },
    ],

    sessions: [
      {
        sessionId: String,

        deviceId: String,

        ipAddress: String,

        browser: String,

        operatingSystem: String,

        loginAt: Date,

        lastActivityAt: Date,

        expiresAt: Date,
      },
    ],

    loginHistory: [
      {
        ipAddress: String,

        browser: String,

        operatingSystem: String,

        location: String,

        loginAt: Date,

        successful: Boolean,
      },
    ],

    lastLoginAt: {
      type: Date,
    },

    passwordChangedAt: {
      type: Date,
    },

    profileCompleted: {
      type: Boolean,

      default: false,
    },
  },

  {
    timestamps: true,

    versionKey: false,
  },
);

const User = mongoose.models.User || model(
  "User",
  userSchema,
);

export default User;
