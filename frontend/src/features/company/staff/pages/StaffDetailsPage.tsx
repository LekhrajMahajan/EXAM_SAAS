import { StaffHeader } from "../components/StaffHeader";
import { ProfileCard } from "../components/ProfileCard";
import { DocumentUploader } from "../components/DocumentUploader";
import { RoleSelector } from "../components/RoleSelector";
import { PermissionMatrix } from "../components/PermissionMatrix";
import { UserPermissionOverrideMatrix } from "../components/UserPermissionOverrideMatrix";
import { AssignmentCard } from "../components/AssignmentCard";
import { ActivityTimeline } from "../components/ActivityTimeline";
import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { ArrowLeft, Edit, Loader2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useStaffDetail } from "../hooks/staff.hooks";

export const StaffDetailsPage = () => {
  const { id } = useParams();
  const { data: res, isLoading } = useStaffDetail(id || "");
  const staff = res?.data;

  if (isLoading || !staff) {
    return (
      <div className="flex justify-center items-center h-64 p-6">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Link to="/company/staff">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <StaffHeader
            title="Staff Profile"
            description={`Viewing profile for ${staff.employeeId || staff.id}`}
            actions={
              <Link to={`/company/staff/${staff.id || id}/edit`}>
                <Button size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </Link>
            }
          />
        </div>
      </div>

      <ProfileCard staff={staff} />

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="flex flex-wrap h-auto w-full justify-start overflow-x-auto pb-1 mb-4">
          <TabsTrigger value="profile">Profile Details</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions & Overrides</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border p-4 rounded-md bg-white">
              <h3 className="font-semibold mb-4 text-lg border-b pb-2">Personal Information</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Gender</dt><dd className="font-medium">{staff.gender || 'N/A'}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Date of Birth</dt><dd className="font-medium">{staff.dateOfBirth || 'N/A'}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Aadhaar</dt><dd className="font-medium">{staff.aadhaarNumber || 'N/A'}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">PAN</dt><dd className="font-medium">{staff.panNumber || 'N/A'}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Emergency Contact</dt><dd className="font-medium">{staff.emergencyContact || 'N/A'}</dd></div>
                <div>
                  <dt className="text-muted-foreground mb-1">Address</dt>
                  <dd className="font-medium p-2 bg-slate-50 rounded">{staff.address || 'N/A'}</dd>
                </div>
              </dl>
            </div>
            
            <div className="border p-4 rounded-md bg-white">
              <h3 className="font-semibold mb-4 text-lg border-b pb-2">Employment Information</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Employee ID</dt><dd className="font-medium">{staff.employeeId || 'N/A'}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Joining Date</dt><dd className="font-medium">{staff.joiningDate || 'N/A'}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Employment Type</dt><dd className="font-medium">{staff.employmentType || 'Full-time'}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Department</dt><dd className="font-medium">{staff.department || 'General'}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Branch</dt><dd className="font-medium">{staff.branch || 'Main Branch'}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Center</dt><dd className="font-medium">{staff.center || 'N/A'}</dd></div>
              </dl>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="documents">
          <DocumentUploader documents={staff.documents || []} />
        </TabsContent>
        
        <TabsContent value="roles">
          <RoleSelector />
        </TabsContent>
        
        <TabsContent value="permissions" className="space-y-6">
          <UserPermissionOverrideMatrix userId={id || staff.id || ""} userName={staff.employeeId || "Staff"} />
          <div className="pt-6 border-t border-slate-700">
            <PermissionMatrix />
          </div>
        </TabsContent>
        
        <TabsContent value="assignments">
          <AssignmentCard assignments={staff.assignments || []} />
        </TabsContent>
        
        <TabsContent value="activity">
          <ActivityTimeline activities={staff.activities || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

