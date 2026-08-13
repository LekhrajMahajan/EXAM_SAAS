import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import type { ImportedCandidate } from "../../../../stores/candidate/candidateImport.store";

interface ViewCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: ImportedCandidate | null;
}

export const ViewCandidateModal = ({ isOpen, onClose, candidate }: ViewCandidateModalProps) => {
  if (!candidate) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Candidate Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full max-h-[60vh] pr-4">
          <div className="grid gap-6 py-4 px-2">
            
            {/* Personal Details Section */}
            <div>
              <h3 className="text-lg font-semibold border-b pb-2 mb-4">Personal Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Full Name</Label>
                  <p className="font-medium">{candidate.candidateFullName || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Father's Name</Label>
                  <p className="font-medium">{candidate.fatherName || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Mother's Name</Label>
                  <p className="font-medium">{candidate.motherName || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Date of Birth</Label>
                  <p className="font-medium">{candidate.dateOfBirth || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Gender</Label>
                  <p className="font-medium">{candidate.gender || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Category</Label>
                  <p className="font-medium">{candidate.category || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">PwD Status</Label>
                  <p className="font-medium">{candidate.pwdStatus || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">PwD Type</Label>
                  <p className="font-medium">{candidate.pwdType || "-"}</p>
                </div>
              </div>
            </div>

            {/* Application & Exam Details Section */}
            <div>
              <h3 className="text-lg font-semibold border-b pb-2 mb-4">Application & Exam Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Candidate ID</Label>
                  <p className="font-medium">{candidate.candidateId || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Application No</Label>
                  <p className="font-medium">{candidate.applicationNo || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Roll/Seat No</Label>
                  <p className="font-medium">{candidate.rollNo || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Exam Name</Label>
                  <p className="font-medium">{candidate.examName || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Organization</Label>
                  <p className="font-medium">{candidate.organization || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Exam Code</Label>
                  <p className="font-medium">{candidate.examCode || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Notification No</Label>
                  <p className="font-medium">{candidate.notificationNo || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Post Name</Label>
                  <p className="font-medium">{candidate.postName || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Paper/Subject</Label>
                  <p className="font-medium">{candidate.paperSubject || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Exam Stage</Label>
                  <p className="font-medium">{candidate.examStage || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Exam Date</Label>
                  <p className="font-medium">{candidate.examDate || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Shift</Label>
                  <p className="font-medium">{candidate.shift || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Reporting Time</Label>
                  <p className="font-medium">{candidate.reportingTime || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Gate Closing</Label>
                  <p className="font-medium">{candidate.gateClosingTime || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Exam Start</Label>
                  <p className="font-medium">{candidate.examStartTime || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Duration</Label>
                  <p className="font-medium">{candidate.duration || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Exam Mode</Label>
                  <p className="font-medium">{candidate.examMode || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Language</Label>
                  <p className="font-medium">{candidate.language || "-"}</p>
                </div>
              </div>
            </div>

            {/* Center Details Section */}
            <div>
              <h3 className="text-lg font-semibold border-b pb-2 mb-4">Center Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Center Name</Label>
                  <p className="font-medium">{candidate.centerName || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Centre Code</Label>
                  <p className="font-medium">{candidate.centreCode || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">City</Label>
                  <p className="font-medium">{candidate.city || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">District</Label>
                  <p className="font-medium">{candidate.district || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">State</Label>
                  <p className="font-medium">{candidate.state || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">PIN</Label>
                  <p className="font-medium">{candidate.pin || "-"}</p>
                </div>
                <div className="space-y-1 md:col-span-3">
                  <Label className="text-muted-foreground">Full Address</Label>
                  <p className="font-medium">{candidate.fullCentreAddress || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Landmark</Label>
                  <p className="font-medium">{candidate.landmark || "-"}</p>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <Label className="text-muted-foreground">Nearest Railway</Label>
                  <p className="font-medium">{candidate.nearestRailwayStation || "-"}</p>
                </div>
              </div>
            </div>

            {/* Additional Info Section */}
            <div>
              <h3 className="text-lg font-semibold border-b pb-2 mb-4">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Scribe Details</Label>
                  <p className="font-medium whitespace-pre-wrap">{candidate.scribeDetails || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Physical Test</Label>
                  <p className="font-medium whitespace-pre-wrap">{candidate.physicalTestDetails || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Photo ID Instructions</Label>
                  <p className="font-medium whitespace-pre-wrap">{candidate.photoIdInstructions || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Important Instructions</Label>
                  <p className="font-medium whitespace-pre-wrap">{candidate.importantInstructions || "-"}</p>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <Label className="text-muted-foreground">Candidate Declaration</Label>
                  <p className="font-medium whitespace-pre-wrap">{candidate.candidateDeclaration || "-"}</p>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <Label className="text-muted-foreground">Biometric Info</Label>
                  <p className="font-medium whitespace-pre-wrap">{candidate.biometricInfo || "-"}</p>
                </div>
              </div>
            </div>

          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
