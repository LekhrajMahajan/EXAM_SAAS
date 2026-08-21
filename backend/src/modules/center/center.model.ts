import { Schema, model } from "mongoose";

import { ICenter, CenterStatus, CenterType, CenterSetupStatus, DocumentApprovalStatus } from "./center.types";

import { BaseSchemaFields } from "../../shared/base.schema";

const CenterSchema = new Schema<ICenter>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    centerManagerId: {
      type: Schema.Types.ObjectId,
      ref: "Manager",
      default: null,
      index: true,
    },

    centerCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    centerName: {
      type: String,
      required: true,
      trim: true,
    },

    centerType: {
      type: String,
      enum: Object.values(CenterType),
      default: CenterType.COLLEGE,
      required: true,
      index: true,
    },

    centerCategory: {
      type: String,
      default: "Standard Center",
    },

    displayCenterType: {
      type: String,
      default: "Standard Center",
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    alternatePhone: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    country: {
      type: String,
      required: true,
      trim: true,
    },

    postalCode: {
      type: String,
      required: true,
      trim: true,
    },

    latitude: {
      type: Number,
      default: null,
    },

    longitude: {
      type: Number,
      default: null,
    },

    capacity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    availableCapacity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    managerName: {
      type: String,
      default: "",
      trim: true,
    },

    examCategories: {
      type: [String],
      default: ["COMPETITIVE_EXAM", "ENTRANCE_TEST", "PROFESSIONAL_CERTIFICATION"],
    },

    mouPdfUrl: {
      type: String,
      default: "",
    },

    mouFileName: {
      type: String,
      default: "",
    },

    facilities: {
      type: [String],
      default: [],
    },

    shifts: {
      type: [Schema.Types.Mixed],
      default: [],
    },

    commercialAgreement: {
      type: [Schema.Types.Mixed],
      default: [],
    },

    setupStatus: {
      type: String,
      enum: Object.values(CenterSetupStatus),
      default: CenterSetupStatus.DRAFT,
      index: true,
    },

    setupCurrentStep: {
      type: Number,
      default: 1,
    },

    completionPercentage: {
      type: Number,
      default: 0,
    },

    readinessScore: {
      type: Number,
      default: 0,
    },

    complianceScore: {
      type: Number,
      default: 0,
    },

    profileExtension: {
      website: { type: String, default: "" },
      alternateContact: { type: String, default: "" },
      googleMapUrl: { type: String, default: "" },
      latitude: { type: Number },
      longitude: { type: Number },
      buildingType: { type: String, default: "Commercial Building" },
      parking: { type: String, default: "Available for 50 vehicles" },
      nearbyLandmark: { type: String, default: "" },
      officeHours: { type: String, default: "08:00 AM - 08:00 PM" },
      emergencyContacts: [
        {
          name: { type: String },
          relationship: { type: String },
          phone: { type: String },
        },
      ],
    },

    staffList: [
      {
        employeeId: { type: String, required: true },
        fullName: { type: String, required: true },
        role: { type: String, required: true },
        department: { type: String, default: "Exam Administration" },
        email: { type: String, required: true },
        mobile: { type: String, required: true },
        emergencyContact: { type: String, default: "" },
        qualification: { type: String, default: "" },
        experience: { type: String, default: "1-3 Years" },
        joiningDate: { type: Date, default: Date.now },
        photoUrl: { type: String, default: "" },
        signatureUrl: { type: String, default: "" },
        aadhaarNumber: { type: String, default: "" },
        panNumber: { type: String, default: "" },
        isPoliceVerified: { type: Boolean, default: true },
        isBackgroundVerified: { type: Boolean, default: true },
        isMedicalFit: { type: Boolean, default: true },
        isFaceVerified: { type: Boolean, default: true },
        isEmailVerified: { type: Boolean, default: true },
        isMobileVerified: { type: Boolean, default: true },
        employeeStatus: { type: String, default: "ACTIVE" },
      },
    ],

    infrastructureNodes: [
      {
        building: { type: String, default: "Main Academic Block" },
        floor: { type: String, default: "Ground Floor" },
        wing: { type: String, default: "North Wing" },
        roomNumber: { type: String, required: true },
        roomType: { type: String, default: "Computer Lab" },
        capacity: { type: Number, default: 50 },
        computerCount: { type: Number, default: 50 },
        hasLan: { type: Boolean, default: true },
        hasWifi: { type: Boolean, default: true },
        internetSpeedMbps: { type: Number, default: 300 },
        hasUps: { type: Boolean, default: true },
        hasGenerator: { type: Boolean, default: true },
        powerBackupHrs: { type: Number, default: 6 },
        hasAC: { type: Boolean, default: true },
        projectorCount: { type: Number, default: 1 },
        printerCount: { type: Number, default: 2 },
        scannerCount: { type: Number, default: 2 },
        barcodeScannerCount: { type: Number, default: 4 },
        biometricDeviceCount: { type: Number, default: 4 },
        metalDetectorCount: { type: Number, default: 2 },
        cctvCameraCount: { type: Number, default: 8 },
        hasEmergencyExit: { type: Boolean, default: true },
        hasFireExtinguisher: { type: Boolean, default: true },
        isWheelchairAccessible: { type: Boolean, default: true },
      },
    ],

    examReadiness: {
      hasControlRoom: { type: Boolean, default: true },
      hasStrongRoom: { type: Boolean, default: true },
      hasQuestionPaperStorage: { type: Boolean, default: true },
      biometricCountersCount: { type: Number, default: 6 },
      waitingAreaCapacity: { type: Number, default: 150 },
      hasMedicalRoom: { type: Boolean, default: true },
      hasHelpDesk: { type: Boolean, default: true },
      hasSecurityDesk: { type: Boolean, default: true },
      powerBackupTested: { type: Boolean, default: true },
      internetBackupTested: { type: Boolean, default: true },
      emergencyExitClear: { type: Boolean, default: true },
      disasterRecoveryPlanUrl: { type: String, default: "" },
      readinessChecklistNotes: { type: String, default: "All exam control parameters operational." },
      readinessScore: { type: Number, default: 0 },
    },

    shiftPlans: [
      {
        shiftName: { type: String, required: true },
        maximumCandidates: { type: Number, default: 0 },
        availableLabs: { type: Number, default: 0 },
        availableSystems: { type: Number, default: 0 },
        assignedInvigilators: { type: Number, default: 0 },
        assignedSupervisors: { type: Number, default: 0 },
        assignedBiometricStaff: { type: Number, default: 0 },
        assignedTechnicalStaff: { type: Number, default: 0 },
        assignedSecurityStaff: { type: Number, default: 0 },
        waitingAreaCapacity: { type: Number, default: 0 },
        parkingCapacity: { type: Number, default: 0 },
        powerConsumptionKw: { type: Number, default: 25 },
        expectedRevenue: { type: Number, default: 0 },
        isInfrastructureValid: { type: Boolean, default: true },
      },
    ],

    complianceChecklist: {
      fireSafetyTested: { type: Boolean, default: true },
      biometricTested: { type: Boolean, default: true },
      cctvWorking: { type: Boolean, default: true },
      networkTested: { type: Boolean, default: true },
      powerBackupTested: { type: Boolean, default: true },
      generatorTested: { type: Boolean, default: true },
      computersTested: { type: Boolean, default: true },
      printerTested: { type: Boolean, default: true },
      scannerTested: { type: Boolean, default: true },
      staffAssigned: { type: Boolean, default: true },
      emergencyContactPosted: { type: Boolean, default: true },
      medicalRoomReady: { type: Boolean, default: true },
      strongRoomReady: { type: Boolean, default: true },
      questionStorageReady: { type: Boolean, default: true },
      complianceScore: { type: Number, default: 0 },
    },

    status: {
      type: String,
      enum: Object.values(CenterStatus),
      default: CenterStatus.ACTIVE,
      index: true,
    },

    ...BaseSchemaFields,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/*
|--------------------------------------------------------------------------
| Virtual
|--------------------------------------------------------------------------
*/

CenterSchema.virtual("fullAddress").get(function () {
  return `${this.address}, ${this.city}, ${this.state}, ${this.country} - ${this.postalCode}`;
});

/*
|--------------------------------------------------------------------------
| Compound Indexes
|--------------------------------------------------------------------------
*/

// Center Code unique within a Branch
CenterSchema.index(
  {
    companyId: 1,
    centerCode: 1,
  },
  {
    unique: true,
  },
);

// Center Name unique within a Branch
CenterSchema.index(
  {
    companyId: 1,
    centerName: 1,
  },
  {
    unique: true,
  },
);



CenterSchema.index({
  companyId: 1,
  city: 1,
});

CenterSchema.index({
  companyId: 1,
  state: 1,
});

CenterSchema.index({
  companyId: 1,
  status: 1,
});

CenterSchema.index({
  companyId: 1,
  isDeleted: 1,
});

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

const Center = model<ICenter>("Center", CenterSchema);

export default Center;
