import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { CenterPhoto } from './centerPhoto.model';
import fileStorageService from "../file-storage/fileStorage.service";
import { FileType } from "../file-storage/fileStorage.types";
import mongoose from "mongoose";
import path from "path";

export class CenterPhotoController {
  
  static async getPhotos(req: Request, res: Response) {
    try {
      let centerId = req.user?.centerId;
      
      if (req.query.centerId) {
        centerId = req.query.centerId as string;
      }

      if (!centerId) {
        return res.status(401).json({ message: 'Unauthorized. Center ID not found.' });
      }

      let photos = await CenterPhoto.findOne({ centerId: new Types.ObjectId(centerId) });
      
      if (!photos) {
        photos = new CenterPhoto({ centerId: new Types.ObjectId(centerId) });
      }

      return res.status(200).json({
        message: 'Center photos retrieved successfully',
        data: photos,
      });

    } catch (error: any) {
      console.error('Error fetching center photos:', error);
      return res.status(500).json({ message: 'Failed to fetch center photos', error: error.message });
    }
  }

  static async updatePhoto(req: Request, res: Response) {
    try {
      const centerId = req.user?.centerId;
      if (!centerId) {
        return res.status(401).json({ message: 'Unauthorized. Center ID not found.' });
      }

      const { category, url, status } = req.body;
      
      const validCategories = ['frontFacade', 'computerLab1', 'serverRoom', 'cctvRoom'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({ message: 'Invalid photo category' });
      }

      const updateQuery = {
        $set: {
          [`${category}.url`]: url,
          [`${category}.status`]: status || 'Uploaded'
        }
      };

      const updatedPhotos = await CenterPhoto.findOneAndUpdate(
        { centerId: new Types.ObjectId(centerId) },
        updateQuery,
        { new: true, upsert: true }
      );

      return res.status(200).json({
        message: 'Center photo updated successfully',
        data: updatedPhotos,
      });

    } catch (error: any) {
      console.error('Error updating center photo:', error);
      return res.status(500).json({ message: 'Failed to update center photo', error: error.message });
    }
  }

  static async uploadPhoto(req: Request, res: Response) {
    try {
      const centerId = req.user?.centerId;
      if (!centerId) {
        return res.status(401).json({ message: 'Unauthorized. Center ID not found.' });
      }

      const category = req.body.category;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: 'No file uploaded.' });
      }

      const validCategories = ['frontFacade', 'computerLab1', 'serverRoom', 'cctvRoom'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({ message: 'Invalid photo category' });
      }

      const ext = file.originalname ? path.extname(file.originalname).replace(".", "").toLowerCase() : "";

      const uploadedFile = await fileStorageService.upload({
        fileName: `center_${centerId}_${category}_${Date.now()}_${file.originalname}`,
        originalName: file.originalname,
        extension: ext,
        mimeType: file.mimetype,
        fileType: FileType.IMAGE,
        uploadedBy: new mongoose.Types.ObjectId(req.user!.userId) as any,
      }, file);
      
      const fileUrl = (uploadedFile as any).url;

      const updateQuery = {
        $set: {
          [`${category}.url`]: fileUrl,
          [`${category}.status`]: 'Uploaded'
        }
      };

      const updatedPhotos = await CenterPhoto.findOneAndUpdate(
        { centerId: new Types.ObjectId(centerId) },
        updateQuery,
        { new: true, upsert: true }
      );

      return res.status(200).json({
        message: 'Center photo uploaded and saved successfully',
        data: updatedPhotos,
      });

    } catch (error: any) {
      console.error('Error uploading center photo:', error);
      return res.status(500).json({ message: 'Failed to upload center photo', error: error.message });
    }
  }
}
