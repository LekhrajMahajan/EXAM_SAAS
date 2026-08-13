import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";

export const CompanyProfilePage = () => {
  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Company Profile" 
        description="Manage your company's public information and details." 
      />
      <Card>
        <CardHeader>
          <CardTitle>Company Information Overview</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center border-t bg-muted/10 text-muted-foreground">
          [ Company Profile Module Placeholder ]
        </CardContent>
      </Card>
    </div>
  );
};
