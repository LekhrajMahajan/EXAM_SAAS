import { CandidateHeader } from "../components/CandidateHeader";
import { CandidateForm } from "../components/CandidateForm";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { MOCK_CANDIDATES } from "../utils/mockData";

export const EditCandidatePage = () => {
  const { id } = useParams();
  const candidate = MOCK_CANDIDATES[0];

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to={`/company/candidates/${id || candidate.id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <CandidateHeader
          title="Edit Candidate"
          description={`Updating application for ${candidate.applicationNo}`}
        />
      </div>

      <CandidateForm initialValues={candidate as any} isEditing />
    </div>
  );
};
