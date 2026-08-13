import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { 
  UserCircle, 
  Briefcase, 
  Building, 
  Mail, 
  Phone, 
  ShieldCheck,
  Calendar,
  KeyRound
} from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface ProfileOverviewProps {
  user: any;
  isLoading: boolean;
}

export const ProfileOverview: React.FC<ProfileOverviewProps> = ({ user, isLoading }) => {
  if (isLoading || !user) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  const profileData = [
    { label: "Employee ID", value: user.employeeId || "N/A", icon: UserCircle },
    { label: "Role", value: user.role, icon: ShieldCheck },
    { label: "Department", value: user.department || "System Administration", icon: Briefcase },
    { label: "Designation", value: user.designation || "Master Admin", icon: Briefcase },
    { label: "Organization", value: user.companyId ? "Assigned Company" : "Root System", icon: Building },
    { label: "Email", value: user.email, icon: Mail },
    { label: "Phone", value: user.mobileNumber || "N/A", icon: Phone },
    { label: "Username", value: user.username || user.email, icon: UserCircle },
    { label: "Last Login", value: user.lastLoginAt ? new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(user.lastLoginAt)) : "Never", icon: Calendar },
    { label: "Last Password Change", value: user.passwordChangedAt ? new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(user.passwordChangedAt)) : "Never", icon: KeyRound },
  ];

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Profile Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8 pb-8 border-b border-border">
          <div className="relative">
            {user.profileImage ? (
              <img 
                src={user.profileImage} 
                alt={`${user.firstName} ${user.lastName}`} 
                className="w-32 h-32 rounded-full object-cover border-4 border-background shadow-md"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center border-4 border-background shadow-md text-primary text-4xl font-bold">
                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
              </div>
            )}
            <Badge 
              variant="default" 
              className={`absolute bottom-2 right-0 border-2 border-background ${
                (!user.status || user.status === 'ACTIVE') ? 'bg-secondary hover:bg-secondary/90 text-secondary-foreground' :
                user.status === 'INACTIVE' ? 'bg-muted hover:bg-muted/90 text-muted-foreground' :
                user.status === 'SUSPENDED' ? 'bg-warning hover:bg-warning/90 text-warning-foreground' :
                user.status === 'TERMINATED' ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' :
                user.status === 'LOCKED' ? 'bg-orange-500 hover:bg-orange-600 text-white' :
                'bg-secondary hover:bg-secondary/90 text-secondary-foreground'
              }`}
            >
              {user.status || 'ACTIVE'}
            </Badge>
          </div>
          <div className="flex-1 text-center md:text-left space-y-2">
            <h2 className="text-3xl font-bold text-foreground tracking-tight">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-lg text-muted-foreground font-medium">
              {user.designation || "System Administrator"}
            </p>
            <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
              <Badge variant="secondary" className="px-3 py-1 bg-primary/5 text-primary">
                <ShieldCheck className="w-4 h-4 mr-1.5" />
                {user.role}
              </Badge>
              {user.department && (
                <Badge variant="outline" className="px-3 py-1 text-muted-foreground">
                  {user.department}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profileData.map((item, index) => (
            <div key={index} className="flex gap-4 p-4 rounded-xl bg-muted/50 border border-border transition-colors hover:bg-muted/80">
              <div className="w-10 h-10 rounded-full bg-background shadow-sm border border-border flex items-center justify-center shrink-0 text-muted-foreground">
                <item.icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                <p className="text-sm font-semibold text-foreground">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
