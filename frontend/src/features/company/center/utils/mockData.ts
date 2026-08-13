import type { Center, Infrastructure, Room, Device, Document, Approval } from "../types/center.types";

export const MOCK_CENTERS: Center[] = [
  {
    id: "65b12a3f9e8a7d6c5b4a3c01",
    centerCode: "CEN-001",
    centerName: "Tech Hub Mumbai",
    branch: "Mumbai Central",
    state: "Maharashtra",
    city: "Mumbai",
    address: "123 Tech Park, Andheri East",
    pincode: "400069",
    headName: "Rahul Sharma",
    headEmail: "rahul.s@techhub.com",
    headMobile: "+91 9876543210",
    capacity: {
      maxCandidates: 500,
      maxRooms: 10,
      maxSystems: 550,
    },
    status: "Active",
    approvalStatus: "Approved",
    createdAt: "2026-01-15T08:00:00Z",
  },
  {
    id: "65b12a3f9e8a7d6c5b4a3c02",
    centerCode: "CEN-002",
    centerName: "Pune Exam Center",
    branch: "Pune Hub",
    state: "Maharashtra",
    city: "Pune",
    address: "45 Knowledge Valley, Hinjewadi",
    pincode: "411057",
    headName: "Priya Patel",
    headEmail: "priya.p@puneexam.com",
    headMobile: "+91 8765432109",
    capacity: {
      maxCandidates: 300,
      maxRooms: 6,
      maxSystems: 320,
    },
    status: "Inactive",
    approvalStatus: "Pending",
    createdAt: "2026-02-20T09:30:00Z",
  },
  {
    id: "65b12a3f9e8a7d6c5b4a3c03",
    centerCode: "CEN-003",
    centerName: "Bangalore Digital Center",
    branch: "Bangalore Tech",
    state: "Karnataka",
    city: "Bangalore",
    address: "78 Silicon Way, Electronic City",
    pincode: "560100",
    headName: "Karthik N.",
    headEmail: "karthik.n@blrtech.com",
    headMobile: "+91 7654321098",
    capacity: {
      maxCandidates: 800,
      maxRooms: 15,
      maxSystems: 850,
    },
    status: "Active",
    approvalStatus: "Approved",
    createdAt: "2026-05-10T11:15:00Z",
  }
];

export const MOCK_INFRASTRUCTURE: Infrastructure = {
  id: "infra-1",
  centerId: "65b12a3f9e8a7d6c5b4a3c01",
  internetAvailable: true,
  powerBackup: true,
  generator: true,
  ups: true,
  airConditioning: true,
  cctvAvailable: true,
  biometricDevice: true,
  metalDetector: true,
  parking: true,
  waitingArea: true,
  medicalRoom: false,
  washroom: true,
  drinkingWater: true,
};

export const MOCK_ROOMS: Room[] = [
  { id: "r1", centerId: "65b12a3f9e8a7d6c5b4a3c01", roomNumber: "Lab 1", floor: "Ground", capacity: 50, systemCount: 55, projector: true, camera: true, status: "Active" },
  { id: "r2", centerId: "65b12a3f9e8a7d6c5b4a3c01", roomNumber: "Lab 2", floor: "Ground", capacity: 50, systemCount: 55, projector: true, camera: true, status: "Active" },
  { id: "r3", centerId: "65b12a3f9e8a7d6c5b4a3c01", roomNumber: "Lab 3", floor: "First", capacity: 100, systemCount: 110, projector: true, camera: true, status: "Maintenance" },
];

export const MOCK_DEVICES: Device[] = [
  { id: "d1", centerId: "65b12a3f9e8a7d6c5b4a3c01", type: "Computer", make: "Dell", model: "OptiPlex 3090", serialNumber: "DL-3090-001", status: "Working" },
  { id: "d2", centerId: "65b12a3f9e8a7d6c5b4a3c01", type: "Biometric", make: "Mantra", model: "MFS100", serialNumber: "MN-100-882", status: "Working" },
  { id: "d3", centerId: "65b12a3f9e8a7d6c5b4a3c01", type: "Printer", make: "HP", model: "LaserJet Pro", serialNumber: "HP-LJ-450", status: "Faulty" },
  { id: "d4", centerId: "65b12a3f9e8a7d6c5b4a3c01", type: "Router", make: "Cisco", model: "RV340", serialNumber: "CS-RV-901", status: "Working" },
];

export const MOCK_DOCUMENTS: Document[] = [
  { id: "doc1", centerId: "65b12a3f9e8a7d6c5b4a3c01", type: "Building Certificate", name: "building_safety_cert.pdf", url: "#", uploadedAt: "2026-01-10T10:00:00Z" },
  { id: "doc2", centerId: "65b12a3f9e8a7d6c5b4a3c01", type: "Fire NOC", name: "fire_noc_2026.pdf", url: "#", uploadedAt: "2026-01-11T11:30:00Z" },
  { id: "doc3", centerId: "65b12a3f9e8a7d6c5b4a3c01", type: "Internet Agreement", name: "isp_contract_500mbps.pdf", url: "#", uploadedAt: "2026-01-12T14:15:00Z" },
];

export const MOCK_APPROVAL: Approval = {
  id: "app1",
  centerId: "65b12a3f9e8a7d6c5b4a3c01",
  status: "Approved",
  remarks: "All checks passed.",
  timeline: [
    { status: "Approved", date: "2026-01-15T08:00:00Z", remarks: "Infrastructure verified.", by: "Admin Supervisor" },
    { status: "Pending", date: "2026-01-14T09:00:00Z", remarks: "Awaiting final sign-off.", by: "System" },
    { status: "Pending", date: "2026-01-13T10:00:00Z", remarks: "Center registration created.", by: "Rahul Sharma" },
  ]
};
