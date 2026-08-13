import { CandidateHeader } from "../components/CandidateHeader";
import { CandidateForm } from "../components/CandidateForm";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export const CreateCandidatePage = () => {
  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/company/candidates">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <CandidateHeader
          title="Register New Candidate"
          description="Enter candidate details and upload necessary identity documents."
        />
      </div>

      <CandidateForm />
    </div>
  );
};
