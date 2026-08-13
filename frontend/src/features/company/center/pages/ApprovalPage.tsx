import { CenterHeader } from "../components/CenterHeader";
import { ApprovalTimeline } from "../components/ApprovalTimeline";
import { CenterStatusBadge } from "../components/CenterStatusBadge";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { MOCK_CENTERS, MOCK_APPROVAL } from "../utils/mockData";

export const ApprovalPage = () => {
  const { id } = useParams();
  const center = MOCK_CENTERS.find(c => c.id === id) || MOCK_CENTERS[0];

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to={`/company/centers/${center.id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <CenterHeader
            title="Approval Status"
            description={`Current approval state for ${center.centerName}`}
            actions={
              <div className="flex items-center gap-3">
                <CenterStatusBadge status={MOCK_APPROVAL.status} />
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Add Remark
                </Button>
              </div>
            }
          />
        </div>
      </div>

      <ApprovalTimeline approval={MOCK_APPROVAL} />
    </div>
  );
};
