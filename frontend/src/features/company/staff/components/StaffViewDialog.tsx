import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import api from '@/services/api';
import { staffApi } from '../api/staff.api';
import type { Staff, StaffDetails } from '../types/staff.types';

interface StaffViewDialogProps {
  staff: Staff | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StaffViewDialog = ({ staff, isOpen, onClose }: StaffViewDialogProps) => {
  const [details, setDetails] = useState<StaffDetails | null>(null);
  const [assignedExams, setAssignedExams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (staff && isOpen) {
        setIsLoading(true);
        try {
          const staffId = staff.id || staff._id;
          if (!staffId) throw new Error("Staff ID is missing");
          const res = await staffApi.getById(staffId);
          if (res.success) {
            setDetails(res.data);
            try {
              const assignRes = await api.get('/assignments', { params: { employeeId: staffId } });
              const assignments = assignRes.data?.data?.data || assignRes.data?.data || [];
              const exams = assignments.filter((a: any) => a.examId).map((a: any) => a.examId);
              setAssignedExams(exams);
            } catch (e) {
              console.error('Failed to fetch assigned exams:', e);
            }
          }
        } catch (error) {
          console.error('Failed to fetch staff details:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchDetails();
  }, [staff, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border text-card-foreground">
        <DialogHeader>
          <DialogTitle>
            {details?.role === 'PAPER_SETTER' ? 'Paper Setter View Details' : 'Employee Profile Details'}
          </DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : details ? (
          <div className="space-y-4 mt-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="flex items-center gap-4 border-b border-border pb-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xl font-bold text-primary">
                {details.firstName.charAt(0)}{details.lastName.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold">{details.firstName} {details.lastName}</h3>
                <p className="text-sm text-muted-foreground">{details.employeeCode}</p>
                <div className="mt-1 inline-flex px-2 py-0.5 rounded text-xs bg-primary/10 text-primary border border-primary/20 font-medium">
                  {details.role}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                {details.email && (
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium truncate" title={details.email}>{details.email}</p>
                  </div>
                )}
                
                {/* Assigned Exams showing in the red box area */}
                {assignedExams.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Assigned Exams</p>
                    <ul className="list-disc list-inside text-sm font-medium">
                      {assignedExams.map((exam, idx) => (
                        <li key={idx}>{exam.examTitle || exam.examName || exam.name || 'Unknown Exam'}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {details.phone && details.phone !== '9999999999' && (
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{details.phone}</p>
                  </div>
                )}
                {details.status && (
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium">{details.status}</p>
                  </div>
                )}
                {details.employmentType && (
                  <div>
                    <p className="text-sm text-muted-foreground">Employment Type</p>
                    <p className="font-medium">{details.employmentType}</p>
                  </div>
                )}
                {details.gender && (
                  <div>
                    <p className="text-sm text-muted-foreground">Gender</p>
                    <p className="font-medium">{details.gender}</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {details.department && (
                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="font-medium">{details.department}</p>
                  </div>
                )}
                {details.joiningDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Joining Date</p>
                    <p className="font-medium">{new Date(details.joiningDate).toLocaleDateString()}</p>
                  </div>
                )}

                {details.center && (
                  <div>
                    <p className="text-sm text-muted-foreground">Center</p>
                    <p className="font-medium">{details.center}</p>
                  </div>
                )}
                {details.dateOfBirth && (
                  <div>
                    <p className="text-sm text-muted-foreground">Date of Birth</p>
                    <p className="font-medium">{new Date(details.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
              
              {/* Assigned exams moved to left column */}
              
              {details.address && (
                <div className="col-span-2 mt-2">
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{details.address}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="py-10 text-center text-muted-foreground">
            No details available.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
