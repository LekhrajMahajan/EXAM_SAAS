import { StaffHeader } from "../components/StaffHeader";
import { SidebarManagement } from "../components/SidebarManagement";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export const SidebarManagementPage = () => {
  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/company/staff">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <StaffHeader
          title="Dynamic Sidebar & Route Engine"
          description="Manage enterprise navigation tree, display order, feature gates, and RBAC visibility."
        />
      </div>

      <SidebarManagement />
    </div>
  );
};
