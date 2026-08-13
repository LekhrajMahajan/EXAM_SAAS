import { Schema, model, Document, Types } from 'mongoose';

export interface ICenterInfrastructure extends Document {
  centerId: Types.ObjectId;
  spaceAndFacilities: {
    totalArea: string;
    examRooms: string;
    washrooms: string;
    parkingCapacity: string;
  };
  technical: {
    serverRooms: string;
    powerBackup: string;
    internetISP: string;
    internetSpeed: string;
  };
  security: {
    cctvCameras: string;
    biometricDevices: string;
    friskingEnclosures: string;
    baggageCounter: string;
  };
}

const centerInfrastructureSchema = new Schema<ICenterInfrastructure>({
  centerId: { type: Schema.Types.ObjectId, ref: 'Center', required: true, unique: true },
  spaceAndFacilities: {
    totalArea: { type: String, default: '' },
    examRooms: { type: String, default: '' },
    washrooms: { type: String, default: '' },
    parkingCapacity: { type: String, default: '' },
  },
  technical: {
    serverRooms: { type: String, default: '' },
    powerBackup: { type: String, default: '' },
    internetISP: { type: String, default: '' },
    internetSpeed: { type: String, default: '' },
  },
  security: {
    cctvCameras: { type: String, default: '' },
    biometricDevices: { type: String, default: '' },
    friskingEnclosures: { type: String, default: '' },
    baggageCounter: { type: String, default: '' },
  },
}, { timestamps: true });

export const CenterInfrastructure = model<ICenterInfrastructure>('CenterInfrastructure', centerInfrastructureSchema);
