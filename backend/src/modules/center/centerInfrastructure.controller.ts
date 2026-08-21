import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { CenterInfrastructure } from './centerInfrastructure.model';

export class CenterInfrastructureController {
  
  static async saveInfrastructure(req: Request, res: Response) {
    try {
      // For Center users, authMiddleware populates req.user with { centerId, role: 'CENTER_MANAGER', ... }
      const centerId = req.user?.centerId;
      if (!centerId) {
        return res.status(401).json({ message: 'Unauthorized. Center ID not found.' });
      }

      const { spaceAndFacilities, technical, security } = req.body;

      const filter = { centerId: new Types.ObjectId(centerId) };
      const update = { 
        $set: {
          spaceAndFacilities,
          technical,
          security
        }
      };

      // Upsert: Create if it doesn't exist, update if it does.
      const infrastructure = await CenterInfrastructure.findOneAndUpdate(
        filter,
        update,
        { new: true, upsert: true }
      );

      return res.status(200).json({
        message: 'Center infrastructure saved successfully',
        infrastructure,
      });

    } catch (error: any) {
      console.error('Error saving center infrastructure:', error);
      return res.status(500).json({ message: 'Failed to save infrastructure details', error: error.message });
    }
  }

  static async getInfrastructure(req: Request, res: Response) {
    try {
      let centerId = req.user?.centerId;
      
      if (req.query.centerId) {
        centerId = req.query.centerId as string;
      }

      if (!centerId) {
        return res.status(401).json({ message: 'Unauthorized. Center ID not found.' });
      }

      const infrastructure = await CenterInfrastructure.findOne({ centerId: new Types.ObjectId(centerId) });
      
      // If none found, return empty object with 200 so UI can display empty state
      return res.status(200).json({
        infrastructure: infrastructure || null
      });

    } catch (error: any) {
      console.error('Error fetching center infrastructure:', error);
      return res.status(500).json({ message: 'Failed to fetch infrastructure details', error: error.message });
    }
  }
}
