import { Request, Response } from 'express';
import Report from '../modules/report/report.model';
import User from '../modules/user/user.model';
import { ReportFormat, ReportStatus, ReportType, ReportVisibility } from '../modules/report/report.types';
import mongoose from 'mongoose';

import Employee from '../modules/employee/employee.model';
import Company from '../modules/company/company.model';

export const seedReportsData = async (req: Request, res: Response) => {
  try {
    console.log('Seeding Reports and User Access Details...');

    // 1. Seed Reports (only a few if not already seeded)
    const users = await User.find().limit(10);
    if (users.length === 0) {
      return res.status(400).json({ message: 'No users found to seed reports.' });
    }

    // 2. Fix Users (lastLogin, status)
    for (const user of users) {
      const loginHistory = [];
      const now = new Date();
      for (let j = 0; j < 5; j++) {
        const date = new Date();
        date.setDate(now.getDate() - Math.floor(Math.random() * 30));
        
        loginHistory.push({
          loginAt: date,
          ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
          browser: Math.random() > 0.5 ? 'Chrome' : 'Firefox',
          operatingSystem: Math.random() > 0.5 ? 'Windows' : 'MacOS',
          location: Math.random() > 0.5 ? 'New York, US' : 'London, UK',
          successful: Math.random() > 0.2, // 80% success rate
        });
      }

      // Ensure lastLogin is set
      const lastLogin = new Date();
      lastLogin.setDate(lastLogin.getDate() - Math.floor(Math.random() * 5));

      // Make some users inactive
      const status = Math.random() > 0.8 ? 'INACTIVE' : 'ACTIVE';
      
      await User.updateOne(
        { _id: user._id }, 
        { 
          $set: { 
            loginHistory,
            lastLogin,
            status,
          } 
        }
      );
    }

    // 3. Create dummy Employee details for these users so "Emp. ID", "Company", "Department" aren't NA
    let defaultCompany = await Company.findOne();
    if (!defaultCompany) {
      defaultCompany = await Company.create({ 
        companyCode: 'COMP-01',
        companyName: 'Acme Corp',
        ownerName: 'Admin',
        email: 'acme@example.com',
        phone: '9999999999'
      });
    }

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const empExists = await Employee.findOne({ userId: user._id });
      
      if (!empExists) {
        await Employee.create({
          userId: user._id,
          employeeCode: `EMP-${1000 + i}`,
          firstName: user.firstName || 'User',
          lastName: user.lastName || `${i}`,
          email: user.email || `user${i}@example.com`,
          phone: `123456789${i}`,
          designation: 'Staff',
          role: user.role || 'INVIGILATOR',
          joiningDate: new Date(),
          department: ['Engineering', 'HR', 'Operations', 'Sales'][i % 4],
          companyId: defaultCompany._id,
        });
      } else {
        await Employee.updateOne({ userId: user._id }, {
          $set: {
            employeeCode: empExists.employeeCode || `EMP-${1000 + i}`,
            department: empExists.department || ['Engineering', 'HR', 'Operations', 'Sales'][i % 4],
            companyId: defaultCompany._id,
            firstName: user.firstName || 'User',
            lastName: user.lastName || `${i}`,
            email: user.email || `user${i}@example.com`,
            phone: empExists.phone || `123456789${i}`,
            designation: empExists.designation || 'Staff',
            role: user.role || 'INVIGILATOR',
            joiningDate: empExists.joiningDate || new Date(),
          }
        });
      }
    }

    console.log(`Updated login history, status, lastLogin, and Employee details for ${users.length} users.`);

    res.status(200).json({ message: 'Seeding User Access details completed successfully.' });
  } catch (error: any) {
    console.error('Error seeding data:', error);
    res.status(500).json({ message: 'Error seeding data', error: error.message });
  }
};

if (require.main === module) {
  const mongoose = require('mongoose');
  require('dotenv').config();
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/exam_saas')
    .then(() => {
      console.log('Connected to DB. Running seed...');
      // mock req and res
      const req = {} as any;
      const res = {
        status: (code: number) => ({
          json: (data: any) => {
            console.log(`Status ${code}:`, data);
            mongoose.disconnect();
            process.exit(0);
          }
        })
      } as any;
      seedReportsData(req, res);
    })
    .catch((err: any) => {
      console.error(err);
      process.exit(1);
    });
}
