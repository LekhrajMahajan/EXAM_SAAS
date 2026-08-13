import { CandidateHeader } from "../components/CandidateHeader";
import { CandidateProfileCard } from "../components/CandidateProfileCard";
import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { ArrowLeft, Edit, CheckCircle, XCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { MOCK_CANDIDATES } from "../utils/mockData";
import { Card, CardContent } from "@/shared/components/ui/card";

export const CandidateDetailsPage = () => {
  const { id } = useParams();
  const candidate = MOCK_CANDIDATES[0]; // using first mock data for display

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/company/candidates">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <CandidateHeader
            title="Candidate Overview"
            description={`Application No: ${candidate.applicationNo}`}
            actions={
              <>
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button variant="outline" className="text-green-600 border-green-200 hover:bg-green-50">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Link to={`/company/candidates/${candidate.id}/edit`}>
                  <Button size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </Link>
              </>
            }
          />
        </div>
      </div>

      <CandidateProfileCard candidate={candidate} />

      <Tabs defaultValue="identity" className="w-full">
        <TabsList className="flex flex-wrap h-auto w-full justify-start overflow-x-auto pb-1 mb-4">
          <TabsTrigger value="identity">Identity & Address</TabsTrigger>
          <TabsTrigger value="education">Education Details</TabsTrigger>
          <TabsTrigger value="documents">Uploaded Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="identity" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4 text-lg border-b pb-2">Identity Details</h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between"><dt className="text-muted-foreground">Aadhaar Number</dt><dd className="font-medium">{candidate.aadhaarNumber}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">PAN Number</dt><dd className="font-medium">{candidate.panNumber || 'Not provided'}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Passport</dt><dd className="font-medium">{candidate.passportNumber || 'Not provided'}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Category</dt><dd className="font-medium">{candidate.category}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Nationality</dt><dd className="font-medium">{candidate.nationality}</dd></div>
                </dl>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4 text-lg border-b pb-2">Address & Contact</h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between"><dt className="text-muted-foreground">Emergency Contact</dt><dd className="font-medium">{candidate.emergencyContact}</dd></div>
                  <div>
                    <dt className="text-muted-foreground mb-1">Current Address</dt>
                    <dd className="font-medium p-2 bg-slate-50 rounded">{candidate.currentAddress}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground mb-1">Permanent Address</dt>
                    <dd className="font-medium p-2 bg-slate-50 rounded">{candidate.permanentAddress}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="education">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4 text-lg border-b pb-2">Academic Qualifications</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 font-medium">Qualification</th>
                      <th className="px-4 py-3 font-medium">Board / University</th>
                      <th className="px-4 py-3 font-medium">Passing Year</th>
                      <th className="px-4 py-3 font-medium">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidate.education.map((edu, idx) => (
                      <tr key={idx} className="border-b last:border-0">
                        <td className="px-4 py-3 font-medium">{edu.qualification}</td>
                        <td className="px-4 py-3">{edu.boardUniversity}</td>
                        <td className="px-4 py-3">{edu.passingYear}</td>
                        <td className="px-4 py-3 font-medium text-primary">{edu.percentage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
           <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className="border p-4 rounded-md text-center">
                  <div className="font-medium mb-3">Photograph</div>
                  <div className="aspect-square bg-slate-100 rounded-md border flex items-center justify-center text-muted-foreground mb-3">
                    Image preview
                  </div>
                </div>
                <div className="border p-4 rounded-md text-center">
                  <div className="font-medium mb-3">Signature</div>
                  <div className="aspect-[2/1] bg-slate-100 rounded-md border flex items-center justify-center text-muted-foreground mb-3">
                    Signature preview
                  </div>
                </div>
                <div className="border p-4 rounded-md text-center">
                  <div className="font-medium mb-3">Thumb Impression</div>
                  <div className="aspect-square bg-slate-100 rounded-md border flex items-center justify-center text-muted-foreground mb-3">
                    Thumb preview
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
