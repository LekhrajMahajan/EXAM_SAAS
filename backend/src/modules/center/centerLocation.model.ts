import { Schema, model, Document, Types } from 'mongoose';

export interface ICenterLocation extends Document {
  centerId: Types.ObjectId;
  latitude: number | string;
  longitude: number | string;
  googleMapUrl: string;
}

const centerLocationSchema = new Schema<ICenterLocation>({
  centerId: {
    type: Schema.Types.ObjectId,
    ref: 'Center',
    required: true,
    unique: true
  },
  latitude: {
    type: Schema.Types.Mixed,
    default: null
  },
  longitude: {
    type: Schema.Types.Mixed,
    default: null
  },
  googleMapUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  collection: 'centerlocations'
});

export const CenterLocation = model<ICenterLocation>('CenterLocation', centerLocationSchema);
