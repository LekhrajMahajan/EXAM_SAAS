import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/shared/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUpdateProfile, useUpdateProfileImage } from "../../hooks/profile.hooks";
import { toast } from "react-hot-toast";
import { Loader2, Upload, Trash2 } from "lucide-react";

const personalInfoSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  employeeId: z.string().optional(),
  department: z.string().optional(),
  designation: z.string().optional(),
});

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

interface PersonalInformationProps {
  user: any;
}

export const PersonalInformation: React.FC<PersonalInformationProps> = ({ user }) => {
  const updateProfile = useUpdateProfile();
  const updateProfileImage = useUpdateProfileImage();

  const { control, register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      gender: user?.gender || "",
      employeeId: user?.employeeId || "",
      department: user?.department || "",
      designation: user?.designation || "",
    }
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        gender: user.gender || "",
        employeeId: user.employeeId || "",
        department: user.department || "",
        designation: user.designation || "",
      });
    }
  }, [user, reset]);

  const onSubmit = (data: PersonalInfoFormValues) => {
    updateProfile.mutate(data, {
      onSuccess: () => {
        toast.success("Profile updated successfully");
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Failed to update profile");
      }
    });
  };

  const handlePhotoUpload = () => {
    // Mock upload for now, ideally opens a file picker and hits the endpoint
    const mockUrl = "https://i.pravatar.cc/150?u=" + user?._id;
    updateProfileImage.mutate(mockUrl, {
      onSuccess: () => toast.success("Profile photo updated"),
      onError: () => toast.error("Failed to upload photo")
    });
  };

  const handlePhotoRemove = () => {
    updateProfileImage.mutate("", {
      onSuccess: () => toast.success("Profile photo removed"),
      onError: () => toast.error("Failed to remove photo")
    });
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal details and public profile information.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-10">
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              {user?.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt="Profile" 
                  className="w-40 h-40 rounded-xl object-cover border shadow-sm"
                />
              ) : (
                <div className="w-40 h-40 rounded-xl bg-muted flex items-center justify-center border shadow-sm text-muted-foreground">
                  <span className="text-4xl font-semibold">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                <Button size="sm" variant="secondary" className="w-24 gap-2" onClick={handlePhotoUpload}>
                  <Upload className="w-4 h-4" /> Upload
                </Button>
                {user?.profileImage && (
                  <Button size="sm" variant="destructive" className="w-24 gap-2" onClick={handlePhotoRemove}>
                    <Trash2 className="w-4 h-4" /> Remove
                  </Button>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Recommended: Square image, max 2MB.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" {...register("firstName")} />
                {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" {...register("lastName")} />
                {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input id="employeeId" {...register("employeeId")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input id="department" {...register("department")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input id="designation" {...register("designation")} />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button type="submit" disabled={!isDirty || updateProfile.isPending}>
                {updateProfile.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};
