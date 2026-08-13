import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { CheckCircle2, Shield } from "lucide-react";

export const RbacOverview: React.FC = () => {
  // Static representation of Master Admin permissions
  const permissions = [
    { category: "User Management", list: ["Create Users", "Edit Users", "Delete Users", "View Profiles"] },
    { category: "Security & Access", list: ["Manage Roles", "Manage Permissions", "View Audit Logs", "Configure MFA"] },
    { category: "System Settings", list: ["Configure Branding", "Manage Email Templates", "View Analytics", "Manage Billing"] },
    { category: "Content Management", list: ["Create Exams", "Publish Results", "Manage Certificates", "View Reports"] },
  ];

  const getCategoryColor = (category: string) => {
    return "text-primary";
  };


  return (
    <Card className="border-0 shadow-sm max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Access & Permissions
        </CardTitle>
        <CardDescription>You have Master Admin privileges which grants full access to the system.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {permissions.map((group, idx) => (
            <div key={idx} className="border border-border rounded-xl p-4 bg-muted/50">
              <h4 className="font-semibold text-sm mb-3 text-foreground">{group.category}</h4>
              <ul className="space-y-2">
                {group.list.map((perm, pIdx) => (
                  <li key={pIdx} className="flex items-center text-sm text-muted-foreground gap-2">
                    <CheckCircle2 className={`w-4 h-4 ${getCategoryColor(group.category)}`} />
                    {perm}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-primary/5 text-foreground rounded-xl border border-primary/20 flex items-start gap-3">
          <Shield className="w-5 h-5 shrink-0 mt-0.5 text-primary" />
          <div className="text-sm">
            <p className="font-semibold mb-1">Superuser Access Granted</p>
            <p>Your current role supersedes standard RBAC policies. You have unrestricted access to all modules and configurations across the platform.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
