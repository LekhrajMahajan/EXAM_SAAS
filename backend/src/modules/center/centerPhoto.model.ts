import { Schema, model, Document, Types } from 'mongoose';

export interface PhotoField {
  url: string;
  status: 'Pending' | 'Uploaded' | 'Approved' | 'Rejected';
}

export interface ICenterPhoto extends Document {
  centerId: Types.ObjectId;
  frontFacade: PhotoField;
  computerLab1: PhotoField;
  serverRoom: PhotoField;
  cctvRoom: PhotoField;
}

const photoFieldSchema = new Schema({
  url: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['Pending', 'Uploaded', 'Approved', 'Rejected'], 
    default: 'Pending' 
  }
}, { _id: false });

const centerPhotoSchema = new Schema<ICenterPhoto>({
  centerId: {
    type: Schema.Types.ObjectId,
    ref: 'Center',
    required: true,
    unique: true
  },
  frontFacade: { type: photoFieldSchema, default: () => ({ url: '', status: 'Pending' }) },
  computerLab1: { type: photoFieldSchema, default: () => ({ url: '', status: 'Pending' }) },
  serverRoom: { type: photoFieldSchema, default: () => ({ url: '', status: 'Pending' }) },
  cctvRoom: { type: photoFieldSchema, default: () => ({ url: '', status: 'Pending' }) },
}, {
  timestamps: true,
  collection: 'centerphotos'
});

export const CenterPhoto = model<ICenterPhoto>('CenterPhoto', centerPhotoSchema);
