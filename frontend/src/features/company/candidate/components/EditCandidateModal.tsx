import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { useCandidateImportStore, type ImportedCandidate } from "../../../../stores/candidate/candidateImport.store";
import { toast } from "@/hooks/use-toast";

interface EditCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: ImportedCandidate | null;
}

export const EditCandidateModal = ({ isOpen, onClose, candidate }: EditCandidateModalProps) => {
  const { updateCandidate, isLoading } = useCandidateImportStore();
  const { register, handleSubmit, reset } = useForm<Partial<ImportedCandidate>>();

  useEffect(() => {
    if (candidate) {
      reset({
        candidateId: candidate.candidateId,
        applicationNo: candidate.applicationNo,
        rollNo: candidate.rollNo,
        candidateFullName: candidate.candidateFullName,
        fatherName: candidate.fatherName,
        motherName: candidate.motherName,
        dateOfBirth: candidate.dateOfBirth,
        gender: candidate.gender,
        category: candidate.category,
        pwdStatus: candidate.pwdStatus,
        pwdType: candidate.pwdType,
        examName: candidate.examName,
        organization: candidate.organization,
        examCode: candidate.examCode,
        notificationNo: candidate.notificationNo,
        postName: candidate.postName,
        paperSubject: candidate.paperSubject,
        examStage: candidate.examStage,
        examDate: candidate.examDate,
        shift: candidate.shift,
        reportingTime: candidate.reportingTime,
        gateClosingTime: candidate.gateClosingTime,
        examStartTime: candidate.examStartTime,
        duration: candidate.duration,
        examMode: candidate.examMode,
        language: candidate.language,
        centerName: candidate.centerName,
        centreCode: candidate.centreCode,
        fullCentreAddress: candidate.fullCentreAddress,
        city: candidate.city,
        district: candidate.district,
        state: candidate.state,
        pin: candidate.pin,
        landmark: candidate.landmark,
        nearestRailwayStation: candidate.nearestRailwayStation,
        scribeDetails: candidate.scribeDetails,
        physicalTestDetails: candidate.physicalTestDetails,
        photoIdInstructions: candidate.photoIdInstructions,
        importantInstructions: candidate.importantInstructions,
        candidateDeclaration: candidate.candidateDeclaration,
        biometricInfo: candidate.biometricInfo,
      });
    }
  }, [candidate, reset]);

  const onSubmit = async (data: Partial<ImportedCandidate>) => {
    if (!candidate?._id) return;
    
    const success = await updateCandidate(candidate._id, data);
    if (success) {
      toast({ title: "Candidate updated successfully" });
      onClose();
    } else {
      toast({ title: "Failed to update candidate", variant: "destructive" });
    }
  };

  if (!candidate) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Candidate</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid gap-6 py-4 px-2">
            
            {/* Personal Details Section */}
            <div>
              <h3 className="text-lg font-semibold border-b pb-2 mb-4">Personal Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="candidateFullName">Full Name</Label>
                  <Input id="candidateFullName" {...register("candidateFullName")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fatherName">Father's Name</Label>
                  <Input id="fatherName" {...register("fatherName")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motherName">Mother's Name</Label>
                  <Input id="motherName" {...register("motherName")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input id="dateOfBirth" {...register("dateOfBirth")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Input id="gender" {...register("gender")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" {...register("category")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pwdStatus">PwD Status</Label>
                  <Input id="pwdStatus" {...register("pwdStatus")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pwdType">PwD Type</Label>
                  <Input id="pwdType" {...register("pwdType")} />
                </div>
              </div>
            </div>

            {/* Application & Exam Details Section */}
            <div>
              <h3 className="text-lg font-semibold border-b pb-2 mb-4">Application & Exam Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="candidateId">Candidate ID</Label>
                  <Input id="candidateId" {...register("candidateId")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="applicationNo">Application No</Label>
                  <Input id="applicationNo" {...register("applicationNo")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rollNo">Roll/Seat No</Label>
                  <Input id="rollNo" {...register("rollNo")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="examName">Exam Name</Label>
                  <Input id="examName" {...register("examName")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input id="organization" {...register("organization")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="examCode">Exam Code</Label>
                  <Input id="examCode" {...register("examCode")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notificationNo">Notification No</Label>
                  <Input id="notificationNo" {...register("notificationNo")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postName">Post Name</Label>
                  <Input id="postName" {...register("postName")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paperSubject">Paper/Subject</Label>
                  <Input id="paperSubject" {...register("paperSubject")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="examStage">Exam Stage</Label>
                  <Input id="examStage" {...register("examStage")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="examDate">Exam Date</Label>
                  <Input id="examDate" {...register("examDate")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shift">Shift</Label>
                  <Input id="shift" {...register("shift")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reportingTime">Reporting Time</Label>
                  <Input id="reportingTime" {...register("reportingTime")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gateClosingTime">Gate Closing Time</Label>
                  <Input id="gateClosingTime" {...register("gateClosingTime")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="examStartTime">Exam Start Time</Label>
                  <Input id="examStartTime" {...register("examStartTime")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input id="duration" {...register("duration")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="examMode">Exam Mode</Label>
                  <Input id="examMode" {...register("examMode")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Input id="language" {...register("language")} />
                </div>
              </div>
            </div>

            {/* Center Details Section */}
            <div>
              <h3 className="text-lg font-semibold border-b pb-2 mb-4">Center Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="centerName">Center Name</Label>
                  <Input id="centerName" {...register("centerName")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="centreCode">Centre Code</Label>
                  <Input id="centreCode" {...register("centreCode")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" {...register("city")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Input id="district" {...register("district")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" {...register("state")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pin">PIN</Label>
                  <Input id="pin" {...register("pin")} />
                </div>
                <div className="space-y-2 md:col-span-3">
                  <Label htmlFor="fullCentreAddress">Full Address</Label>
                  <Input id="fullCentreAddress" {...register("fullCentreAddress")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="landmark">Landmark</Label>
                  <Input id="landmark" {...register("landmark")} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="nearestRailwayStation">Nearest Railway</Label>
                  <Input id="nearestRailwayStation" {...register("nearestRailwayStation")} />
                </div>
              </div>
            </div>

            {/* Additional Info Section */}
            <div>
              <h3 className="text-lg font-semibold border-b pb-2 mb-4">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scribeDetails">Scribe Details</Label>
                  <Input id="scribeDetails" {...register("scribeDetails")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="physicalTestDetails">Physical Test</Label>
                  <Input id="physicalTestDetails" {...register("physicalTestDetails")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="photoIdInstructions">Photo ID Instructions</Label>
                  <Input id="photoIdInstructions" {...register("photoIdInstructions")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="importantInstructions">Important Instructions</Label>
                  <Input id="importantInstructions" {...register("importantInstructions")} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="candidateDeclaration">Candidate Declaration</Label>
                  <Input id="candidateDeclaration" {...register("candidateDeclaration")} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="biometricInfo">Biometric Info</Label>
                  <Input id="biometricInfo" {...register("biometricInfo")} />
                </div>
              </div>
            </div>
            
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
