import { useUserStore } from "@/stores/user/user.store";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Edit2, Save, X } from 'lucide-react';
import { profileApi } from "@/features/master-admin/api/profile.api";

export const WelcomeHeader = () => {
  const profile = useUserStore((state) => state.profile);
  const setProfile = useUserStore((state) => state.setProfile);
  const { user } = useAuthStore();
  
  const getDisplayName = () => {
    const p = profile as any;
    if (p?.firstName || p?.lastName) return `${p.firstName || ''} ${p.lastName || ''}`.trim();
    if (p?.name && p.name !== 'undefined undefined') return p.name;
    
    const u = user as any;
    if (u?.firstName || u?.lastName) return `${u.firstName || ''} ${u.lastName || ''}`.trim();
    if (u?.name && u.name !== 'undefined undefined') return u.name;
    
    return "User";
  };
  
  const name = getDisplayName();
  const role = profile?.roleId?.replace('_', ' ') || user?.role || "User";
  const phone = (profile as any)?.phone || "";

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleEditClick = () => {
    setEditName(name !== "User" ? name : "");
    setEditPhone(phone);
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      const nameParts = editName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || " ";
      
      await profileApi.updateProfile({ firstName, lastName, phone: editPhone });
      if (profile) {
        setProfile({ ...profile, firstName, lastName, phone: editPhone } as any);
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const { currentDate, lastLoginDate } = useMemo(() => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true
    });
    
    const loginFormatter = new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
    });
    
    const lastLogin = new Date(now.getTime() - 86400000);
    return {
      currentDate: formatter.format(now).replace(' at ', ' at '),
      lastLoginDate: loginFormatter.format(lastLogin)
    };
  }, []);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#2D3E2C] p-6 rounded-xl border border-[#2D3E2C]">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-secondary">
          Welcome back, {name}!
        </h1>
        <p className="text-secondary/70 mt-2 font-medium">
          Role: <span className="text-secondary capitalize">{role.toLowerCase()}</span>
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-6">
        <div className="text-sm text-secondary/70 text-left sm:text-right">
          <p className="font-medium text-secondary">{currentDate}</p>
          <p className="mt-1">
            Last login: {lastLoginDate}
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="bg-transparent text-secondary border-secondary/50 hover:bg-secondary hover:text-[#2D3E2C]">
              View Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogTitle className="text-slate-900 dark:text-slate-100">User Profile Details</DialogTitle>
              {!isEditing && (
                <Button variant="ghost" size="sm" onClick={handleEditClick} className="h-8 px-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </DialogHeader>
            <div className="grid gap-4 py-4 text-slate-800 dark:text-slate-200">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-semibold col-span-1">Name</span>
                <div className="col-span-3">
                  {isEditing ? (
                    <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-8" />
                  ) : (
                    <span>{name}</span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-semibold col-span-1">Email</span>
                <span className="col-span-3">{(profile as any)?.email || user?.email || "N/A"}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-semibold col-span-1">Role</span>
                <span className="col-span-3 capitalize">{role.toLowerCase()}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-semibold col-span-1">Status</span>
                <span className="col-span-3">
                  <span className="px-3 py-1 bg-[#2D3E2C] text-secondary rounded-full text-xs font-bold border border-[#2D3E2C] shadow-sm">
                    Active
                  </span>
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-semibold col-span-1">Phone</span>
                <div className="col-span-3">
                  {isEditing ? (
                    <Input 
                      value={editPhone} 
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setEditPhone(value);
                      }} 
                      maxLength={10}
                      className="h-8" 
                      placeholder="Add phone number" 
                    />
                  ) : (
                    <span>{phone || "Not provided"}</span>
                  )}
                </div>
              </div>
            </div>
            {isEditing && (
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button size="sm" className="bg-[#2D3E2C] text-secondary hover:bg-[#1a2419]" onClick={handleSaveProfile} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
