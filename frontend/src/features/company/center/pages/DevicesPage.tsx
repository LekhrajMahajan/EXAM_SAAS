import { CenterHeader } from "../components/CenterHeader";
import { DeviceTable } from "../components/DeviceTable";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { MOCK_CENTERS, MOCK_DEVICES } from "../utils/mockData";

export const DevicesPage = () => {
  const { id } = useParams();
  const center = MOCK_CENTERS.find(c => c.id === id) || MOCK_CENTERS[0];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Link to={`/company/centers/${center.id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <CenterHeader
            title="Manage Devices"
            description={`Managing inventory for ${center.centerName}`}
            actions={
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Device
              </Button>
            }
          />
        </div>
      </div>

      <DeviceTable devices={MOCK_DEVICES} />
    </div>
  );
};
