import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { CheckCircle, FileText, BarChart2, Users, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const QuickActionsWidget = () => {
  const navigate = useNavigate();

  const actions = [
    {
      label: "Create Company",
      icon: PlusCircle,
      onClick: () => navigate("/master-admin/companies/new"),
    },
    {
      label: "Approve Companies",
      icon: CheckCircle,
      onClick: () => navigate("/master-admin/company-approvals"),
    },
    {
      label: "Create Plan",
      icon: FileText,
      onClick: () => navigate("/master-admin/plans"),
    },
    {
      label: "View Reports",
      icon: BarChart2,
      onClick: () => navigate("/master-admin/reports"),
    },
    {
      label: "Manage Users",
      icon: Users,
      onClick: () => navigate("/master-admin/access-management?tab=users"),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-[#2D3E2C] qa-title">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              onClick={action.onClick}
              className="flex-1 min-w-[140px] sm:flex-none justify-start transition-colors border-[#2D3E2C] text-[#2D3E2C] hover:bg-[#2D3E2C] hover:text-[#E4FD97] qa-button"
            >
              <action.icon className="mr-2 h-4 w-4" />
              {action.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

