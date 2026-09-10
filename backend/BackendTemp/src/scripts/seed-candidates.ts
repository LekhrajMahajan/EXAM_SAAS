import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Candidate from '../modules/candidate/candidate.model';
import { CandidateStatus, Gender, Category } from '../modules/candidate/candidate.types';
import Exam from '../modules/exam/exam.model';
import { ExamStatus } from '../modules/exam/exam.types';
import Company from '../modules/company/company.model';
import Center from '../modules/center/center.model';

export const seedCandidatesData = async (req: Request, res: Response) => {
  try {
    console.log('Seeding Candidates...');

    let company = await Company.findOne();
    if (!company) {
      company = await Company.create({
        companyCode: 'COMP-SEED',
        companyName: 'Seed Company',
        ownerName: 'Admin',
        email: 'seed@example.com',
        phone: '1234567890'
      });
    }

    let center = await Center.findOne();
    if (!center) {
      center = await Center.create({
        centerCode: 'CEN-01',
        centerName: 'Main Exam Center',
        companyId: company._id,
        email: 'center@example.com',
        phone: '0987654321',
        capacity: 100,
        address: '123 Main', city: 'City', state: 'State', postalCode: '12345', country: 'Country'
      });
    }

    let exam = await Exam.findOne();
    if (!exam) {
      exam = await Exam.create({
        companyId: company._id,
        centerId: center._id,
        examCode: 'EXAM-001',
        examTitle: 'Sample Seeded Exam',
        examType: 'ONLINE',
        status: ExamStatus.ACTIVE,
        duration: 120,
        totalMarks: 100,
        passingMarks: 40,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
      });
    }

    const count = await Candidate.countDocuments();
    if (count < 20) {
      for (let i = 0; i < 25; i++) {
        await Candidate.create({
          companyId: company._id,
          centerId: center._id,
          examId: exam._id,
          candidateCode: `CAND-${1000 + i}`,
          applicationNo: `APP-${2000 + i}`,
          enrollmentNo: `ENR-${3000 + i}`,
          firstName: 'Candidate',
          lastName: `${i}`,
          fullName: `Candidate ${i}`,
          mobile: `98765432${i.toString().padStart(2, '0')}`,
          gender: Gender.MALE,
          dob: new Date('2000-01-01'),
          category: Category.GENERAL,
          address: '123 Main St',
          city: 'Metropolis',
          state: 'State',
          postalCode: '123456',
          email: `candidate${i}@example.com`,
          qualification: 'B.Tech',
          college: 'Global Engineering College',
          course: 'Computer Science',
          year: 1,
          status: Math.random() > 0.8 ? CandidateStatus.INACTIVE : CandidateStatus.ACTIVE,
          biometricVerified: Math.random() > 0.3,
          faceVerified: Math.random() > 0.3,
          hallTicketGenerated: Math.random() > 0.2,
          isDeleted: false
        });
      }
    }

    res.status(200).json({ message: 'Seeding candidates successfully!' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

if (require.main === module) {
  require('dotenv').config();
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/exam_saas')
    .then(() => {
      console.log('Connected to DB. Running candidate seed...');
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
      seedCandidatesData(req, res);
    })
    .catch((err: any) => {
      console.error(err);
      process.exit(1);
    });
}
