import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api as apiClient } from '@/features/auth/utils/axios';

export interface BranchStaff {
  id: string;
  staffId?: string;
  name: string;
  role: 'Supervisor' | 'Invigilator' | 'Biometric Coordinator' | 'Observer' | 'Security Lead' | 'Technical Support' | 'Center Superintendent' | string;
  aadharNumber: string;
  mobileNumber: string;
  email?: string;
  otpVerified: boolean;
  status: 'Active' | 'On Leave' | 'Deassigned' | string;
  createdAt: string;
}

export interface AssignedCenter {
  id: string;
  examName: string; // Konsi exam li jayegi (assigned by company admin)
  assignedCandidatesCount: number; // Kitne candidate assigned kiye gaye hai
  examDate: string;
  shiftTime: string;
  centerName: string; // Venue / location name
  centerCode?: string;
  city?: string;
  address?: string;
  capacity?: number;
  assignedLabsCount?: number;
  facilities?: string[];
  contactPerson?: string;
  contactPhone?: string;
  readinessStatus?: 'Exam Ready' | 'Audit Pending' | 'Maintenance' | string;
  status?: string;
}

export interface BranchLab {
  id: string;
  labName: string;
  labCode: string;
  roomFloor: string;
  centerName: string; // Hall / Venue name
  seatingCapacity: number;
  totalComputers: number;
  assignedSupervisor: string;
  facilities: string[];
  status: 'Exam Ready' | 'Under Maintenance' | 'Reserved' | string;
  notes?: string;
}

export interface BranchLegalDocument {
  documentType: string;
  url: string;
  status?: string;
  uploadedAt?: string;
  version?: number;
  [key: string]: unknown;
}

export interface BranchProfileDetails {
  id?: string;
  _id?: string;
  branchName?: string;
  branchCode?: string;
  email?: string;
  phone?: string;
  alternatePhone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  totalLabs?: number;
  totalSystems?: number;
  facilities?: string[];
  managerName?: string;
  legalDocuments?: BranchLegalDocument[];
  [key: string]: unknown;
}

export interface BranchStoreState {
  currentBranch: BranchProfileDetails | null;
  fetchCurrentBranch: () => Promise<void>;
  updateCurrentBranch: (id: string, updated: Partial<BranchProfileDetails>) => Promise<{ success: boolean; message?: string }>;

  staffList: BranchStaff[];
  centersList: AssignedCenter[];
  labsList: BranchLab[];

  // Staff actions
  fetchStaff: () => Promise<void>;
  addStaff: (staff: Omit<BranchStaff, 'id' | 'createdAt' | 'staffId'>) => Promise<{ success: boolean; message?: string; id?: string }>;
  updateStaff: (id: string, updated: Partial<BranchStaff>) => Promise<{ success: boolean; message?: string }>;
  deleteStaff: (id: string) => Promise<void>;
  verifyStaffOtp: (id: string) => Promise<void>;
  checkMobileExists: (mobileNumber: string, excludeId?: string) => boolean;

  // Center actions (for dynamic syncing from Company Admin)
  addCenter: (center: Omit<AssignedCenter, 'id'>) => string;
  updateCenter: (id: string, updated: Partial<AssignedCenter>) => void;
  deleteCenter: (id: string) => void;

  // Lab actions
  fetchLabs: () => Promise<void>;
  addLab: (lab: Omit<BranchLab, 'id'>) => Promise<string>;
  updateLab: (id: string, updated: Partial<BranchLab>) => Promise<void>;
  deleteLab: (id: string) => Promise<void>;

  resetToDefault: () => void;
}

// Initial states are empty as requested by user - NO DUMMY DATA
const INITIAL_STAFF: BranchStaff[] = [];
const INITIAL_CENTERS: AssignedCenter[] = [];
const INITIAL_LABS: BranchLab[] = [];

const generateUniqueStaffId = (existingStaff: BranchStaff[]): string => {
  let branchPrefix = 'BR-101';
  try {
    const authData = localStorage.getItem('auth-storage');
    if (authData) {
      const parsed = JSON.parse(authData);
      const user = parsed?.state?.user;
      if (user?.branchCode) {
        branchPrefix = String(user.branchCode).toUpperCase().trim();
      } else if (user?.branch?.branchCode) {
        branchPrefix = String(user.branch.branchCode).toUpperCase().trim();
      } else if (user?.branchNumber) {
        branchPrefix = `BR-${user.branchNumber}`;
      } else if (user?.branchId) {
        const digits = String(user.branchId).replace(/\D/g, '');
        if (digits.length > 0) {
          branchPrefix = `BR-${digits.slice(-3)}`;
        }
      }
    }
  } catch {
    // ignore parsing errors
  }

  let uniqueNum = Math.floor(100 + Math.random() * 900);
  let generatedId = `${branchPrefix}-${uniqueNum}`;
  let attempts = 0;

  while (
    existingStaff.some((s) => s.id === generatedId || s.staffId === generatedId) &&
    attempts < 50
  ) {
    uniqueNum = Math.floor(100 + Math.random() * 900);
    generatedId = `${branchPrefix}-${uniqueNum}`;
    attempts++;
  }

  return generatedId;
};

export const useBranchStore = create<BranchStoreState>()(
  persist(
    (set, get) => ({
      currentBranch: null,
      staffList: INITIAL_STAFF,
      centersList: INITIAL_CENTERS,
      labsList: INITIAL_LABS,

      checkMobileExists: (mobileNumber, excludeId) => {
        const cleanMobile = mobileNumber.trim();
        return get().staffList.some(
          (s) => s.mobileNumber.trim() === cleanMobile && s.id !== excludeId
        );
      },

      fetchStaff: async () => {
        try {
          const response = await apiClient.get('/branches/staff');
          if (response.data && response.data.data) {
            set({ staffList: response.data.data });
          }
        } catch (err) {
          console.error('Failed to fetch staff from database:', err);
        }
      },

      addStaff: async (newStaff) => {
        if (get().checkMobileExists(newStaff.mobileNumber)) {
          return {
            success: false,
            message: `Mobile number ${newStaff.mobileNumber} is already registered with another staff member! Duplicate mobile numbers are not allowed.`,
          };
        }
        const newId = generateUniqueStaffId(get().staffList);
        const item: BranchStaff = {
          ...newStaff,
          id: newId,
          staffId: newId,
          createdAt: new Date().toISOString().split('T')[0],
        };

        try {
          const response = await apiClient.post('/branches/staff', item);
          const dbItem = response.data.data || item;
          const finalId = dbItem.staffId || dbItem.id || newId;
          set((state) => ({
            staffList: [dbItem, ...state.staffList.filter((s) => s.id !== finalId && s.staffId !== finalId)],
          }));
          return { success: true, id: finalId };
        } catch (error: any) {
          const errorMsg = error?.response?.data?.message || 'Error communicating with database server';
          if (error?.response?.status === 400) {
            return { success: false, message: errorMsg };
          }
          set((state) => ({
            staffList: [item, ...state.staffList],
          }));
          return { success: true, id: newId };
        }
      },

      updateStaff: async (id, updated) => {
        if (updated.mobileNumber && get().checkMobileExists(updated.mobileNumber, id)) {
          return {
            success: false,
            message: `Mobile number ${updated.mobileNumber} is already registered with another staff member!`,
          };
        }
        try {
          await apiClient.patch(`/branches/staff/${id}`, updated);
        } catch (error: any) {
          if (error?.response?.status === 400) {
            return { success: false, message: error?.response?.data?.message || 'Error updating staff in database' };
          }
        }
        set((state) => ({
          staffList: state.staffList.map((s) => (s.id === id || s.staffId === id ? { ...s, ...updated } : s)),
        }));
        return { success: true };
      },

      deleteStaff: async (id) => {
        try {
          await apiClient.delete(`/branches/staff/${id}`);
        } catch (error) {
          console.error('Error deleting staff from database:', error);
        }
        set((state) => ({
          staffList: state.staffList.filter((s) => s.id !== id && s.staffId !== id),
        }));
      },

      verifyStaffOtp: async (id) => {
        try {
          await apiClient.post(`/branches/staff/${id}/verify-otp`);
        } catch (error) {
          console.error('Error confirming OTP in database:', error);
        }
        set((state) => ({
          staffList: state.staffList.map((s) => (s.id === id || s.staffId === id ? { ...s, otpVerified: true } : s)),
        }));
      },

      addCenter: (newCenter) => {
        const id = `ctr-${Date.now()}`;
        set((state) => ({
          centersList: [{ ...newCenter, id }, ...state.centersList],
        }));
        return id;
      },

      updateCenter: (id, updated) => {
        set((state) => ({
          centersList: state.centersList.map((c) => (c.id === id ? { ...c, ...updated } : c)),
        }));
      },

      deleteCenter: (id) => {
        set((state) => ({
          centersList: state.centersList.filter((c) => c.id !== id),
        }));
      },

      fetchLabs: async () => {
        try {
          const response = await apiClient.get('/branches/labs');
          if (response.data && response.data.data) {
            set({ labsList: response.data.data });
          }
        } catch (err) {
          console.error('Failed to fetch labs from database:', err);
        }
      },

      addLab: async (newLab) => {
        const tempId = `lab-${Date.now()}`;
        const item: BranchLab = {
          ...newLab,
          id: tempId,
        };

        try {
          const response = await apiClient.post('/branches/labs', item);
          const dbItem = response.data.data || item;
          const finalId = dbItem.id || dbItem.labId || tempId;
          set((state) => ({
            labsList: [dbItem, ...state.labsList.filter((l) => l.id !== finalId && l.id !== tempId)],
          }));
          return finalId;
        } catch (error) {
          console.error('Error adding lab to database:', error);
          set((state) => ({
            labsList: [item, ...state.labsList],
          }));
          return tempId;
        }
      },

      updateLab: async (id, updated) => {
        try {
          await apiClient.patch(`/branches/labs/${id}`, updated);
        } catch (error) {
          console.error('Error updating lab in database:', error);
        }
        set((state) => ({
          labsList: state.labsList.map((l) => (l.id === id ? { ...l, ...updated } : l)),
        }));
      },

      deleteLab: async (id) => {
        try {
          await apiClient.delete(`/branches/labs/${id}`);
        } catch (error) {
          console.error('Error deleting lab from database:', error);
        }
        set((state) => ({
          labsList: state.labsList.filter((l) => l.id !== id),
        }));
      },

      fetchCurrentBranch: async () => {
        try {
          const response = await apiClient.get('/branches/my-branch');
          if (response.data && response.data.data) {
            const data = response.data.data;
            data.id = data.id || data._id;
            set({ currentBranch: data });
          }
        } catch (err) {
          console.error('Failed to fetch current branch from database:', err);
        }
      },

      updateCurrentBranch: async (id, updated) => {
        try {
          const response = await apiClient.patch(`/branches/${id}`, updated);
          if (response.data && response.data.data) {
            const data = response.data.data;
            data.id = data.id || data._id;
            set((state) => ({
              currentBranch: state.currentBranch ? { ...state.currentBranch, ...data, id: data.id || state.currentBranch?.id } : data,
            }));
            return { success: true, message: 'Branch profile and documents updated successfully.' };
          }
          await get().fetchCurrentBranch();
          return { success: true, message: 'Branch profile and documents updated successfully.' };
        } catch (error: any) {
          console.error('Error updating branch in database:', error);
          const msg = error.response?.data?.message || error.message || 'Failed to update branch profile';
          return { success: false, message: msg };
        }
      },

      resetToDefault: () => {
        set({
          currentBranch: null,
          staffList: INITIAL_STAFF,
          centersList: INITIAL_CENTERS,
          labsList: INITIAL_LABS,
        });
      },
    }),
    {
      name: 'branch-manager-state-storage-v2', // v2 clears out previous dummy data in localStorage
    }
  )
);
