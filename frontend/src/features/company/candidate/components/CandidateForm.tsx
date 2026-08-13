import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { candidateSchema, type CandidateFormValues } from "../schemas/candidate.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { useNavigate } from "react-router-dom";
import { PhotoUploader } from "./PhotoUploader";

interface CandidateFormProps {
  initialValues?: Partial<CandidateFormValues>;
  isEditing?: boolean;
}

export const CandidateForm = ({ initialValues, isEditing }: CandidateFormProps) => {
  const navigate = useNavigate();
  
  const form = useForm({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      firstName: initialValues?.firstName || "",
      middleName: initialValues?.middleName || "",
      lastName: initialValues?.lastName || "",
      gender: initialValues?.gender || "Male",
      dateOfBirth: initialValues?.dateOfBirth || "",
      category: initialValues?.category || "General",
      nationality: initialValues?.nationality || "Indian",
      aadhaarNumber: initialValues?.aadhaarNumber || "",
      panNumber: initialValues?.panNumber || "",
      passportNumber: initialValues?.passportNumber || "",
      mobile: initialValues?.mobile || "",
      email: initialValues?.email || "",
      emergencyContact: initialValues?.emergencyContact || "",
      currentAddress: initialValues?.currentAddress || "",
      permanentAddress: initialValues?.permanentAddress || "",
      state: initialValues?.state || "",
      city: initialValues?.city || "",
      education: initialValues?.education?.length ? initialValues.education : [
        { qualification: "", boardUniversity: "", passingYear: "", percentage: "" }
      ],
      status: initialValues?.status || "Draft",
      approvalStatus: initialValues?.approvalStatus || "Pending",
    },
  });

  const onSubmit = (data: any) => {
    console.log("Form data:", data);
    navigate("/company/candidates");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Document Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PhotoUploader title="Candidate Photo" type="photo" />
          <PhotoUploader title="Signature" type="signature" />
          <PhotoUploader title="Thumb Impression" type="thumb" />
        </div>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="middleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Middle Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Middle name (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="General">General</SelectItem>
                      <SelectItem value="OBC">OBC</SelectItem>
                      <SelectItem value="SC">SC</SelectItem>
                      <SelectItem value="ST">ST</SelectItem>
                      <SelectItem value="EWS">EWS</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nationality</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Indian" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Identity Information */}
        <Card>
          <CardHeader>
            <CardTitle>Identity Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="aadhaarNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aadhaar Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="12-digit Aadhaar" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="panNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PAN Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Optional" className="uppercase" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passportNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passport Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Optional" className="uppercase" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Mobile number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentAddress"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Current Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Full current address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="permanentAddress"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Permanent Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Full permanent address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="State" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="City" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => navigate("/company/candidates")}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? "Update Candidate" : "Register Candidate"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
