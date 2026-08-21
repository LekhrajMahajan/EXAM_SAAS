import type { Staff, StaffDetails } from "../types/staff.types";

export const MOCK_STAFF: Staff[] = [
  {
    id: "s1",
    employeeCode: "EMP-001",
    firstName: "Amit",
    lastName: "Kumar",
    email: "amit.k@company.com",
    phone: "+91 9876543210",
    role: "Center Manager",
    department: "Operations",

    center: "Tech Hub Mumbai",
    status: "Active",
    joiningDate: "2024-01-15T00:00:00Z",
    employmentType: "Full-time",
    lastLogin: "2026-07-19T10:30:00Z",
  },
  {
    id: "s2",
    employeeCode: "EMP-002",
    firstName: "Priya",
    lastName: "Singh",
    email: "priya.s@company.com",
    phone: "+91 8765432109",
    role: "Invigilator",
    department: "Examination",

    center: "Pune Exam Center",
    status: "Active",
    joiningDate: "2025-06-01T00:00:00Z",
    employmentType: "Contract",
    lastLogin: "2026-07-18T14:15:00Z",
  },
  {
    id: "s3",
    employeeCode: "EMP-003",
    firstName: "Rajesh",
    lastName: "Sharma",
    email: "rajesh.s@company.com",
    phone: "+91 7654321098",
    role: "Technical Manager",
    department: "IT Support",

    center: "Bangalore Digital Center",
    status: "On Leave",
    joiningDate: "2023-11-20T00:00:00Z",
    employmentType: "Full-time",
    lastLogin: "2026-07-15T09:45:00Z",
  }
];

export const MOCK_STAFF_DETAILS: StaffDetails = {
  ...MOCK_STAFF[0],
  gender: "Male",
  dateOfBirth: "1990-05-15",
  aadhaarNumber: "123456789012",
  panNumber: "ABCDE1234F",
  emergencyContact: "+91 9988776655",
  address: "401, Sapphire Apartments, Andheri West, Mumbai",
  username: "amit.kumar",
  documents: [
    { type: 'Aadhaar', name: 'aadhaar_card.pdf', url: '#', uploadedAt: '2024-01-16T10:00:00Z' },
    { type: 'Education', name: 'degree_certificate.pdf', url: '#', uploadedAt: '2024-01-16T10:15:00Z' },
  ],
  activities: [
    { id: 'a1', action: 'Logged in', date: '2026-07-19T10:30:00Z', ipAddress: '192.168.1.100' },
    { id: 'a2', action: 'Updated profile', date: '2026-07-15T14:20:00Z', ipAddress: '192.168.1.100', details: 'Changed emergency contact' },
    { id: 'a3', action: 'Assigned to Shift', date: '2026-07-10T09:10:00Z', ipAddress: '10.0.0.5', details: 'Morning Shift - Tech Hub Mumbai' },
  ],
  assignments: [
    { id: 'as1', type: 'Center', name: 'Tech Hub Mumbai', role: 'Center Manager', startDate: '2024-01-15T00:00:00Z', status: 'Active' },
    { id: 'as2', type: 'Exam', name: 'TCS NQT 2026', role: 'Chief Supervisor', startDate: '2026-08-01T00:00:00Z', endDate: '2026-08-05T00:00:00Z', status: 'Upcoming' },
  ]
};
