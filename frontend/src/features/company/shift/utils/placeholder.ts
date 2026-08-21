import type { Shift } from '../types';

export const DUMMY_SHIFTS: Shift[] = [
  {
    id: 's-101',
    general: {
      name: 'Morning Shift - Physics',
      code: 'SHF-PHY-M',
      examId: 'Physics Final 2024',

      centerId: 'Center A',
      stateId: 'California',
      cityId: 'Los Angeles',
    },
    schedule: {
      date: '2024-05-15',
      reportingTime: '08:00 AM',
      gateClosingTime: '08:45 AM',
      examStartTime: '09:00 AM',
      examEndTime: '12:00 PM',
      lateEntryAllowed: false,
      session: 'Morning',
    },
    capacity: {
      maxCapacity: 500,
      reservedSeats: 20,
      expectedCandidates: 480,
    },
    status: 'Upcoming',
    assignedCandidates: 450,
  },
  {
    id: 's-102',
    general: {
      name: 'Afternoon Shift - Math',
      code: 'SHF-MTH-A',
      examId: 'Mathematics Final 2024',

      centerId: 'Center B',
      stateId: 'California',
      cityId: 'San Francisco',
    },
    schedule: {
      date: '2024-05-15',
      reportingTime: '01:00 PM',
      gateClosingTime: '01:45 PM',
      examStartTime: '02:00 PM',
      examEndTime: '05:00 PM',
      lateEntryAllowed: true,
      lateEntryDuration: 15,
      session: 'Afternoon',
    },
    capacity: {
      maxCapacity: 300,
      reservedSeats: 10,
      expectedCandidates: 250,
    },
    status: 'Upcoming',
    assignedCandidates: 220,
  },
  {
    id: 's-103',
    general: {
      name: 'Evening Shift - Chemistry',
      code: 'SHF-CHM-E',
      examId: 'Chemistry Basics',

      centerId: 'Center C',
      stateId: 'New York',
      cityId: 'New York City',
    },
    schedule: {
      date: '2024-04-10',
      reportingTime: '04:00 PM',
      gateClosingTime: '04:45 PM',
      examStartTime: '05:00 PM',
      examEndTime: '08:00 PM',
      lateEntryAllowed: false,
      session: 'Evening',
    },
    capacity: {
      maxCapacity: 200,
      reservedSeats: 5,
      expectedCandidates: 195,
    },
    status: 'Completed',
    assignedCandidates: 180,
  },
];
