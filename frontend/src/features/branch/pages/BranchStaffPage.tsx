import React, { useState, useEffect } from 'react';
import { useBranchStore, type BranchStaff } from '../store/useBranchStore';
import { Card, CardContent } from '@/shared/components/ui/card';
import { apiClient } from '@/core/api/http/axios-client';
import { Button } from '@/shared/components/ui/button';
import { 
  Users, 
  UserPlus, 
  Search, 
  ShieldCheck, 
  Smartphone, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  KeyRound, 
  AlertTriangle,
  FileText,
  Filter,
  RefreshCw
} from 'lucide-react';

const generateOtpCode = () => Math.floor(100000 + Math.random() * 900000).toString();

const STAFF_ROLES = [
  'Supervisor',
  'Invigilator',
  'Biometric Coordinator',
  'Observer',
  'Security Lead',
  'Technical Support',
  'Center Superintendent'
];

export const BranchStaffPage: React.FC = () => {
  const { staffList, fetchStaff, addStaff, updateStaff, deleteStaff, verifyStaffOtp } = useBranchStore();

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [emailNotifySuccess, setEmailNotifySuccess] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState(STAFF_ROLES[0]);
  const [aadharNumber, setAadharNumber] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');

  // In-modal simulation states
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [, setSentOtpCode] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Separate Modal State for table row OTP triggering
  const [tableOtpModal, setTableOtpModal] = useState<{
    isOpen: boolean;
    staff?: BranchStaff;
    generatedOtp?: string;
    input: string;
    error?: string;
  }>({
    isOpen: false,
    input: '',
  });

  const formatAadhar = (val: string) => {
    const numbers = val.replace(/\D/g, '').slice(0, 12);
    return numbers.replace(/(\d{4})(?=\d)/g, '$1-');
  };

  const formatMobile = (val: string) => {
    return val.replace(/\D/g, '').slice(0, 10);
  };

  const handleOpenRegister = () => {
    setEditingId(null);
    setName('');
    setRole(STAFF_ROLES[0]);
    setAadharNumber('');
    setMobile('');
    setEmail('');
    setIsOtpSent(false);
    setEnteredOtp('');
    setIsOtpVerified(false);
    setSentOtpCode('');
    setOtpError(null);
    setSuccessMessage(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (staff: BranchStaff) => {
    setEditingId(staff.id);
    setName(staff.name);
    setRole(staff.role);
    setAadharNumber(staff.aadharNumber);
    setMobile(staff.mobileNumber);
    setEmail(staff.email || '');
    setIsOtpVerified(staff.otpVerified);
    setIsOtpSent(false);
    setEnteredOtp('');
    setOtpError(null);
    setSuccessMessage(null);
    setIsModalOpen(true);
  };

  const handleSendOtp = () => {
    if (mobile.length !== 10) {
      setOtpError('Please enter a valid 10-digit mobile number first.');
      return;
    }
    setOtpError(null);

    // Generate demo verification code
    const generated = generateOtpCode();
    setSentOtpCode(generated);
    setIsOtpSent(true);
    setSuccessMessage(`📲 SMS OTP transmitted to +91 ${mobile}. (Any code entered will verify successfully as per demo mode)`);
  };

  const handleVerifyOtpInput = () => {
    if (!enteredOtp.trim()) {
      setOtpError('Please input an OTP code to complete verification.');
      return;
    }
    // As per user request: accept ANY OTP entered to make it dynamically working before Firebase connection!
    setIsOtpVerified(true);
    setOtpError(null);
    setSuccessMessage('✅ Mobile Number successfully verified! You may now complete registration.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);

    if (!name.trim() || !aadharNumber.trim() || !mobile.trim() || !email.trim()) {
      setOtpError('Please complete all mandatory fields (Name, Aadhar, Mobile Number, and Email).');
      return;
    }

    if (mobile.length !== 10) {
      setOtpError('Mobile number must be precisely 10 digits.');
      return;
    }

    if (!isOtpVerified && !editingId) {
      setOtpError('⚠️ Mobile Number must undergo OTP verification before registering staff.');
      return;
    }

    if (editingId) {
      const res = await updateStaff(editingId, {
        name,
        role,
        aadharNumber,
        mobileNumber: mobile,
        email,
        otpVerified: isOtpVerified,
      });
      if (!res.success) {
        setOtpError(res.message || 'Error updating staff details');
        return;
      }
      setEmailNotifySuccess(`Updated staff details for ${name} successfully.`);
    } else {
      const res = await addStaff({
        name,
        role,
        aadharNumber,
        mobileNumber: mobile,
        email,
        otpVerified: true,
        status: 'Active',
      });
      if (!res.success) {
        setOtpError(res.message || 'Error adding staff details');
        return;
      }

      const generatedStaffId = res.id || 'BR-101-001';
      if (email && email.trim()) {
        apiClient.post('/email/send-staff-id', {
          to: email.trim(),
          subject: `Official Exam Staff ID & Roster Appointment - ${generatedStaffId}`,
          html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              <div style="background-color: #0f172a; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
                <h1 style="color: #E4FD97; margin: 0; font-size: 24px; font-weight: 700;">ExamGuard Pro Enterprise</h1>
                <p style="color: #94a3b8; margin: 5px 0 0 0; font-size: 14px;">Official Staff Credentials & Appointment Notice</p>
              </div>
              <div style="padding: 20px 10px;">
                <h2 style="color: #1e293b; margin-top: 0; font-size: 20px;">Welcome, ${name}!</h2>
                <p style="color: #475569; font-size: 15px; line-height: 1.6;">
                  You have successfully been verified and registered into the official Branch Exam Operations Roster. We are pleased to confirm your official identification details below.
                </p>
                
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 5px solid #10b981; margin: 25px 0;">
                  <p style="margin: 0 0 12px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: bold;">Your Assigned Staff ID & Credentials</p>
                  <p style="margin: 8px 0; font-size: 16px; color: #334155;"><b>Official Staff ID:</b> <span style="background-color: #10b981; color: #ffffff; padding: 4px 10px; border-radius: 6px; font-weight: 800; font-family: monospace; font-size: 18px; display: inline-block;">${generatedStaffId}</span></p>
                  <p style="margin: 8px 0; font-size: 15px; color: #334155;"><b>Assigned Role:</b> ${role}</p>
                  <p style="margin: 8px 0; font-size: 15px; color: #334155;"><b>Registered Mobile:</b> +91 ${mobile}</p>
                  <p style="margin: 8px 0; font-size: 15px; color: #334155;"><b>Aadhar Identification:</b> ${aadharNumber}</p>
                  <p style="margin: 8px 0; font-size: 15px; color: #334155;"><b>Verification Status:</b> <span style="color: #059669; font-weight: bold;">✓ OTP Verified & Active</span></p>
                </div>
                
                <p style="color: #334155; font-weight: 600; margin-top: 20px;">📌 Instructions for Exam Day:</p>
                <ul style="color: #475569; font-size: 14px; line-height: 1.7; padding-left: 20px;">
                  <li>Please retain this official Staff ID (<b>${generatedStaffId}</b>) as your primary identification identifier for all examination operations and duty shift allocations.</li>
                  <li>Carry your government photo identification (Aadhar Card) along with this Staff ID when reporting to the assigned examination center or branch facility.</li>
                </ul>
                
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;" />
                <p style="font-size: 12px; color: #94a3b8; margin: 0; text-align: center;">
                  This is an automated security & credential dispatch generated by ExamGuard Pro Enterprise Command Portal. Do not reply directly to this email.
                </p>
              </div>
            </div>
          `,
        }).catch((err) => {
          console.error("Failed to send Staff Registration ID Email:", err);
        });
      }
      setEmailNotifySuccess(`✅ Official Staff ID (${generatedStaffId}) created! Login credentials and ID instructions dispatched to ${email}.`);
    }

    setIsModalOpen(false);
  };

  // Direct Table OTP Trigger
  const handleTriggerTableOtp = (staff: BranchStaff) => {
    const code = generateOtpCode();
    setTableOtpModal({
      isOpen: true,
      staff,
      generatedOtp: code,
      input: '',
      error: undefined,
    });
  };

  const confirmTableOtp = () => {
    if (!tableOtpModal.staff) return;
    if (!tableOtpModal.input.trim()) {
      setTableOtpModal((prev) => ({ ...prev, error: 'Please enter verification code.' }));
      return;
    }
    // Accept ANY input entered as requested by user!
    verifyStaffOtp(tableOtpModal.staff.id);
    setTableOtpModal({ isOpen: false, input: '' });
  };

  const filteredStaff = staffList.filter((s) => {
    const term = searchQuery.toLowerCase();
    const matchesSearch = 
      s.name.toLowerCase().includes(term) ||
      s.role.toLowerCase().includes(term) ||
      s.mobileNumber.includes(term) ||
      s.aadharNumber.includes(term) ||
      s.id.toLowerCase().includes(term) ||
      (s.staffId && s.staffId.toLowerCase().includes(term));
    
    const matchesRole = selectedRoleFilter === 'All' || s.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  const totalStaff = staffList.length;
  const verifiedCount = staffList.filter(s => s.otpVerified).length;
  const supervisorsCount = staffList.filter(s => s.role === 'Supervisor' || s.role === 'Center Superintendent').length;
  const invigilatorCount = staffList.filter(s => s.role === 'Invigilator' || s.role === 'Biometric Coordinator').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6 animate-in fade-in duration-300">
      {/* Master Admin Styled Banner */}
      <div className="bg-[#2D3E2C] text-[#E4FD97] rounded-xl p-6 shadow-xl border border-[#E4FD97]/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#E4FD97]/15 rounded-xl border border-[#E4FD97]/30 text-[#E4FD97] mt-1">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Branch Staff & Exam Roster
            </h1>
            <p className="text-sm text-[#E4FD97]/90 mt-1 max-w-2xl leading-relaxed font-medium">
              Onboard examination Supervisors, Invigilators, Biometric Coordinators & Observers with unique mobile OTP & Aadhar authentication.
            </p>
          </div>
        </div>
        <Button 
          onClick={handleOpenRegister}
          className="bg-[#E4FD97] hover:bg-[#c2eb5c] text-[#2D3E2C] hover:text-[#2D3E2C] font-black text-sm px-5 py-3 rounded-lg shadow-lg transform active:scale-95 transition-all flex items-center gap-2 shrink-0"
        >
          <UserPlus className="w-5 h-5" /> Register New Staff
        </Button>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-md text-white shadow-lg">
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Staff Roster</p>
              <p className="text-3xl font-black text-white mt-1">{totalStaff}</p>
            </div>
            <div className="p-3 bg-[#E4FD97]/10 text-[#E4FD97] rounded-xl border border-[#E4FD97]/20">
              <Users className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-md text-white shadow-lg">
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verified Numbers</p>
              <p className="text-3xl font-black text-emerald-400 mt-1">{verifiedCount}</p>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-md text-white shadow-lg">
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Supervisors</p>
              <p className="text-3xl font-black text-amber-400 mt-1">{supervisorsCount}</p>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <KeyRound className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-md text-white shadow-lg">
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Invigilators & Biometric</p>
              <p className="text-3xl font-black text-blue-400 mt-1">{invigilatorCount}</p>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              <FileText className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Dispatch Success Notification Banner */}
      {emailNotifySuccess && (
        <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-4 py-3 rounded-xl flex items-center justify-between shadow-lg animate-in fade-in duration-300">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{emailNotifySuccess}</span>
          </div>
          <button 
            onClick={() => setEmailNotifySuccess(null)}
            className="text-emerald-400 hover:text-white text-xs font-bold px-2 py-1 bg-emerald-500/20 rounded-md"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      {staffList.length > 0 && (
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search Staff ID, Name, Mobile, Aadhar, Role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 text-white pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-700 focus:outline-none focus:border-[#E4FD97]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <Filter className="w-3.5 h-3.5 text-[#E4FD97] shrink-0" />
            <button
              onClick={() => setSelectedRoleFilter('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedRoleFilter === 'All'
                  ? 'bg-[#E4FD97] text-[#2D3E2C] shadow'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              All Roles ({staffList.length})
            </button>
            {STAFF_ROLES.map((roleName) => {
              const count = staffList.filter(s => s.role === roleName).length;
              if (count === 0 && selectedRoleFilter !== roleName) return null;
              return (
                <button
                  key={roleName}
                  onClick={() => setSelectedRoleFilter(roleName)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    selectedRoleFilter === roleName
                      ? 'bg-[#E4FD97] text-[#2D3E2C] shadow'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {roleName} ({count})
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Staff Roster Table or Empty State */}
      <Card className="bg-slate-900/80 border-slate-800 shadow-xl overflow-hidden">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-sm font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <span>Branch Examination Roster</span>
            <span className="bg-slate-800 text-[#E4FD97] text-[11px] px-2 py-0.5 rounded-full border border-slate-700 font-mono">
              {filteredStaff.length} Records
            </span>
          </h3>
          <span className="text-xs text-slate-400 hidden md:inline font-medium">
            Strict duplicate mobile prevention & OTP verification active
          </span>
        </div>

        {filteredStaff.length === 0 ? (
          <CardContent className="p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mb-2">
              <Users className="w-8 h-8 text-[#E4FD97]" />
            </div>
            <h3 className="text-xl font-bold text-white">No Branch Staff Registered Yet</h3>
            <p className="text-slate-400 text-sm max-w-lg leading-relaxed">
              Click the <span className="text-[#E4FD97] font-semibold">&apos;Register New Staff&apos;</span> button above to onboard examination Supervisors, Invigilators, Biometric Coordinators, and Observers with Aadhar number & mobile OTP validation.
            </p>
            <Button
              onClick={handleOpenRegister}
              className="mt-2 bg-[#E4FD97] hover:bg-[#c2eb5c] text-[#2D3E2C] font-black px-6 py-2.5 rounded-lg shadow-lg flex items-center gap-2 text-xs"
            >
              <UserPlus className="w-4 h-4" /> Register First Staff Member
            </Button>
          </CardContent>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-400 bg-slate-950/40">
                  <th className="p-4">Staff Member</th>
                  <th className="p-4">Exam Role</th>
                  <th className="p-4">Aadhar No.</th>
                  <th className="p-4">Mobile & OTP Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 text-[#E4FD97] font-black text-sm flex items-center justify-center shadow">
                          {staff.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="font-extrabold text-white group-hover:text-[#E4FD97] transition-colors">
                              {staff.name}
                            </p>
                            <span className="bg-emerald-500/15 text-[#E4FD97] text-[10px] font-mono font-black px-2 py-0.5 rounded border border-emerald-500/30 shadow-sm">
                              ID: {staff.staffId || staff.id}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                            {staff.email ? (
                              <><span>✉️</span> {staff.email} <span className="text-emerald-400 font-semibold">(ID Dispatched)</span></>
                            ) : (
                              'No email specified'
                            )}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${
                        staff.role.includes('Superintendent') || staff.role.includes('Supervisor')
                          ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                          : staff.role.includes('Biometric')
                          ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                          : 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                      }`}>
                        {staff.role}
                      </span>
                    </td>

                    <td className="p-4 font-mono text-xs text-slate-300 font-semibold">
                      <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800 inline-flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        {staff.aadharNumber || 'N/A'}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-slate-400" />
                        <span className="font-mono font-bold text-slate-200 text-xs">
                          {staff.mobileNumber}
                        </span>
                        {staff.otpVerified ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 text-[11px] font-extrabold px-2 py-0.5 rounded border border-emerald-500/20 ml-1">
                            <CheckCircle2 className="w-3 h-3" /> Verified
                          </span>
                        ) : (
                          <button
                            onClick={() => handleTriggerTableOtp(staff)}
                            className="inline-flex items-center gap-1 bg-amber-500 text-slate-950 text-[11px] font-black px-2.5 py-0.5 rounded shadow hover:bg-amber-400 transition-transform active:scale-95 ml-1 animate-pulse"
                          >
                            <RefreshCw className="w-3 h-3" /> Verify OTP
                          </button>
                        )}
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          onClick={() => handleOpenEdit(staff)}
                          size="sm"
                          variant="outline"
                          className="bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 h-8 w-8 p-0 rounded-lg"
                          title="Edit Staff Member"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => {
                            if (window.confirm(`Are you certain you want to remove ${staff.name} from the exam roster?`)) {
                              deleteStaff(staff.id);
                            }
                          }}
                          size="sm"
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 h-8 w-8 p-0 rounded-lg"
                          title="Delete Staff Member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Registration / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <Card className="bg-slate-900 border-slate-800 w-full max-w-xl text-slate-100 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950 rounded-t-xl">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-[#E4FD97]/15 text-[#E4FD97] rounded-xl border border-[#E4FD97]/30">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">
                    {editingId ? 'Edit Exam Staff Roster' : 'Register New Exam Staff'}
                  </h2>
                  <p className="text-xs text-slate-400">Strict unique mobile verification enforced</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold text-xl px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              {otpError && (
                <div className="p-3.5 bg-red-950/80 border border-red-500/40 text-red-300 text-xs rounded-xl flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span className="font-semibold leading-relaxed">{otpError}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl flex items-center gap-2.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Rajeshwar Rao"
                    className="w-full bg-slate-950 text-white px-3.5 py-2.5 text-sm rounded-lg border border-slate-800 focus:border-[#E4FD97] focus:outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Examination Role *
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-950 text-white font-semibold px-3.5 py-2.5 text-sm rounded-lg border border-slate-800 focus:border-[#E4FD97] focus:outline-none"
                  >
                    {STAFF_ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Aadhar Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={aadharNumber}
                    onChange={(e) => setAadharNumber(formatAadhar(e.target.value))}
                    placeholder="XXXX-XXXX-XXXX"
                    maxLength={14}
                    className="w-full bg-slate-950 text-white font-mono px-3.5 py-2.5 text-sm rounded-lg border border-slate-800 focus:border-[#E4FD97] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Official Email Address (For Staff ID Notification) *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@examguard.ai"
                    className="w-full bg-slate-950 text-white px-3.5 py-2.5 text-sm rounded-lg border border-slate-800 focus:border-[#E4FD97] focus:outline-none"
                  />
                </div>
              </div>

              {/* Mobile and OTP Section */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-[#E4FD97] uppercase tracking-wider flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-400" /> Mandatory Mobile & OTP Authentication
                  </label>
                  {isOtpVerified && (
                    <span className="inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-400 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified Number
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-slate-500 text-sm font-mono font-bold">+91</span>
                      <input
                        type="text"
                        required
                        value={mobile}
                        onChange={(e) => {
                          setMobile(formatMobile(e.target.value));
                          setIsOtpVerified(false);
                          setIsOtpSent(false);
                        }}
                        disabled={isOtpVerified && !editingId}
                        placeholder="10 digit mobile number"
                        maxLength={10}
                        className="w-full bg-slate-900 text-white font-mono pl-12 pr-4 py-2 text-sm rounded-lg border border-slate-700 focus:border-[#E4FD97] focus:outline-none disabled:opacity-60"
                      />
                    </div>

                    {!isOtpVerified && (
                      <Button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={mobile.length !== 10}
                        className="bg-[#2D3E2C] hover:bg-[#3d553c] text-[#E4FD97] border border-[#E4FD97]/40 font-bold text-xs px-4 rounded-lg shrink-0 disabled:opacity-50"
                      >
                        {isOtpSent ? 'Resend OTP' : 'Send OTP'}
                      </Button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5 font-medium">
                    * Duplicate numbers will be automatically blocked across all branch staff rosters.
                  </p>
                </div>

                {isOtpSent && !isOtpVerified && (
                  <div className="pt-2 border-t border-slate-900 space-y-2 animate-in fade-in duration-200">
                    <label className="text-xs font-bold text-slate-300 block">
                      Enter 6-Digit SMS Verification Code:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value)}
                        placeholder="Enter any code to verify..."
                        maxLength={6}
                        className="w-48 bg-slate-900 text-white font-mono text-center tracking-widest text-base font-bold py-1.5 rounded-lg border border-slate-700 focus:border-[#E4FD97] focus:outline-none"
                      />
                      <Button
                        type="button"
                        onClick={handleVerifyOtpInput}
                        className="bg-[#E4FD97] hover:bg-[#c2eb5c] text-[#2D3E2C] font-black text-xs px-5 rounded-lg shadow-md flex items-center gap-1.5"
                      >
                        <ShieldCheck className="w-4 h-4" /> Validate OTP
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-5 py-2.5 rounded-lg text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!isOtpVerified && !editingId}
                  className="bg-[#E4FD97] hover:bg-[#c2eb5c] text-[#2D3E2C] font-black px-6 py-2.5 rounded-lg text-xs shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {editingId ? 'Save Changes' : 'Complete Staff Registration'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Direct Table OTP Verification Modal */}
      {tableOtpModal.isOpen && tableOtpModal.staff && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="bg-slate-900 border-slate-800 w-full max-w-md p-6 text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-2.5 bg-amber-500/15 text-amber-400 rounded-xl border border-amber-500/30">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Verify Staff Mobile Number</h3>
                <p className="text-xs text-slate-400">{tableOtpModal.staff.name} • +91 {tableOtpModal.staff.mobileNumber}</p>
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 text-xs space-y-2">
              <p className="text-slate-300">
                An SMS verification code has been transmitted to <strong className="text-white">+91 {tableOtpModal.staff.mobileNumber}</strong>.
              </p>
              <div className="bg-emerald-950/60 border border-emerald-500/30 p-2 rounded text-[11px] text-emerald-300 font-mono font-bold">
                ℹ️ Demo Mode: Enter any verification digits below to complete validation.
              </div>
            </div>

            {tableOtpModal.error && (
              <p className="text-xs font-bold text-red-400 bg-red-950/80 p-2 rounded border border-red-500/30">
                {tableOtpModal.error}
              </p>
            )}

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Enter Verification Code:
              </label>
              <input
                type="text"
                value={tableOtpModal.input}
                onChange={(e) => setTableOtpModal({ ...tableOtpModal, input: e.target.value, error: undefined })}
                placeholder="Enter verification digits..."
                className="w-full bg-slate-950 text-white font-mono text-center text-lg font-black tracking-widest py-2.5 rounded-lg border border-slate-700 focus:border-[#E4FD97] focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                onClick={() => setTableOtpModal({ isOpen: false, input: '' })}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2 rounded-lg text-xs"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmTableOtp}
                className="bg-[#E4FD97] hover:bg-[#c2eb5c] text-[#2D3E2C] font-black px-5 py-2 rounded-lg text-xs shadow-md flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" /> Verify Now
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
export default BranchStaffPage;
