import React from 'react';
import { useProfile } from "../hooks/profile.hooks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { ProfileOverview } from "../components/profile/ProfileOverview";
import { PersonalInformation } from "../components/profile/PersonalInformation";
import { AccountSettings } from "../components/profile/AccountSettings";
import { PreferencesSettings } from "../components/profile/PreferencesSettings";
import { UserCircle, Settings } from "lucide-react";

export const ProfilePage: React.FC = () => {
  const { data: profileResponse, isLoading } = useProfile();
  const user = profileResponse?.data;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Master Admin Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your personal information, security settings, and system preferences.
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="h-auto flex-wrap justify-start gap-1 p-1">
          <TabsTrigger value="overview" className="gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><UserCircle className="w-4 h-4" /> Overview</TabsTrigger>
          <TabsTrigger value="personal" className="gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Settings className="w-4 h-4" /> Account & Personal</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="overview" className="m-0 focus-visible:outline-none">
            <ProfileOverview user={user} isLoading={isLoading} />
          </TabsContent>
          
          <TabsContent value="personal" className="m-0 focus-visible:outline-none space-y-6">
            <PersonalInformation user={user} />
            <AccountSettings user={user} />
            <PreferencesSettings user={user} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
