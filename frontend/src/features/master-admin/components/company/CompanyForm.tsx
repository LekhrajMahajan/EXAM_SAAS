import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { companySchema, type CompanyFormValues } from "../../schemas/company.schema";
import type { Company } from "../../types/company.types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft, Check, X, Building2, User, MapPin, CreditCard, Eye } from "lucide-react";
import { FileUpload } from "@/shared/components/upload/file-upload";
import api from "@/services/api";

const FormFileUpload = ({ value, onChange, accept, maxSizeMB, id }: { value: string, onChange: (url: string) => void, accept?: string, maxSizeMB?: number, id?: string }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (file: File | null) => {
    if (!file) {
      onChange("");
      return;
    }
    try {
      setIsUploading(true);
      // Fallback for demo purposes: Convert to Base64 so it can be saved and viewed in a new tab later
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        onChange((reader.result as string) + "#" + encodeURIComponent(file.name));
      };
      reader.onerror = () => {
        onChange("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf#" + encodeURIComponent(file.name));
      };
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {value ? (
         <div className="flex items-center gap-2 border border-input p-2 rounded-lg bg-background">
           <div className="flex-1 overflow-hidden">
             {value.startsWith('http') || value.startsWith('blob:') || value.startsWith('/') || value.startsWith('data:') ? (
               <a href={value.split('#')[0]} target="_blank" rel="noreferrer" className="text-sm text-primary truncate hover:underline block">
                 {value.includes('#') ? decodeURIComponent(value.split('#')[1]) : value.split('/').pop() || 'View File'}
               </a>
             ) : (
               <span className="text-sm text-muted-foreground truncate block">{value}</span>
             )}
           </div>
           <Button variant="ghost" size="sm" onClick={() => onChange("")} type="button" className="text-destructive hover:text-destructive hover:bg-destructive/10">Remove</Button>
         </div>
      ) : (
         <div className="relative">
           {isUploading && <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10 rounded-lg backdrop-blur-sm">
             <div className="bg-background border shadow-sm px-4 py-2 rounded-md text-sm font-medium text-primary flex items-center gap-2">
               <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" /> Uploading...
             </div>
           </div>}
           <FileUpload onFileSelect={handleUpload} accept={accept} maxSizeMB={maxSizeMB} id={id} />
         </div>
      )}
    </div>
  )
}

interface CompanyFormProps {
  company?: Company;
  onSubmit: (values: CompanyFormValues) => void;
  isPending: boolean;
  submitButtonText?: string;
}

const STEPS = [
  { id: 1, title: "Basic Info", icon: Building2 },
  { id: 2, title: "Contact", icon: User },
  { id: 3, title: "Address", icon: MapPin },
  { id: 4, title: "Review", icon: Eye },
];

const COMPANY_TYPES = [
  "Government Department",
  "Government Agency",
  "Public Sector (PSU)",
  "Autonomous Body",
  "University / Educational Institution",
  "Private Organization",
  "NGO / Trust",
];

export const CompanyForm = ({ company, onSubmit, isPending, submitButtonText }: CompanyFormProps) => {
  const isEditing = !!company;
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyCode: "",
      companyName: "",
      legalName: "",
      companyType: "Private Organization",
      customCompanyType: "",
      registrationNumber: "",
      gstNumber: "",
      panNumber: "",
      ownerName: "",
      email: "",
      phone: "",
      alternatePhone: "",
      website: "",
      country: "India",
      state: "",
      city: "",
      pincode: "",
      address: "",
      registrationDocument: "",
      mouDocument: "",
      panCardDocument: "",
      gstDocument: "",
      aadharCardDocument: "",
      msmeCertificateDocument: "",
      subscriptionPlan: undefined,

      maxCenters: 1,
      maxEmployees: 5,
      maxCandidates: 100,
    },
  });

  useEffect(() => {
    if (company) {
      const cType = company.companyType || "Private Organization";
      const isPredefined = COMPANY_TYPES.includes(cType);

      form.reset({
        companyCode: company.companyCode,
        companyName: company.companyName,
        legalName: company.legalName || "",
        companyType: isPredefined ? cType : "Other",
        customCompanyType: isPredefined ? "" : cType,
        registrationNumber: company.registrationNumber || "",
        gstNumber: company.gstNumber || "",
        panNumber: company.panNumber || "",
        ownerName: company.ownerName || "",
        email: company.email,
        phone: company.phone,
        alternatePhone: company.alternatePhone || "",
        website: company.website || "",
        country: company.country || "India",
        city: company.city || "",
        state: company.state || "",
        pincode: company.pincode || "",
        address: company.address || "",
        registrationDocument: company.registrationDocument || "",
        mouDocument: company.mouDocument || "",
        panCardDocument: company.panCardDocument || "",
        gstDocument: company.gstDocument || "",
        aadharCardDocument: company.aadharCardDocument || "",
        msmeCertificateDocument: company.msmeCertificateDocument || "",
        subscriptionPlan: company.subscriptionPlan || "STARTER",
        subscriptionStartDate: company.subscriptionStartDate ? new Date(company.subscriptionStartDate).toISOString() : undefined,
        subscriptionEndDate: company.subscriptionEndDate ? new Date(company.subscriptionEndDate).toISOString() : undefined,

        maxCenters: company.maxCenters || 1,
        maxEmployees: company.maxEmployees || 5,
        maxCandidates: company.maxCandidates || 100,
      });
    }
  }, [company, form]);

  const stepFields: Record<number, (keyof CompanyFormValues)[]> = {
    1: ["companyCode", "companyName", "legalName", "companyType", "customCompanyType", "registrationNumber", "gstNumber", "panNumber", "registrationDocument", "mouDocument", "panCardDocument", "gstDocument", "aadharCardDocument", "msmeCertificateDocument"],
    2: ["ownerName", "email", "phone", "alternatePhone", "website"],
    3: ["country", "state", "city", "pincode", "address"],
  };

  const handleNext = async () => {
    if (currentStep < 4) {
      const fieldsToValidate = stepFields[currentStep];
      const isStepValid = await form.trigger(fieldsToValidate);
      if (isStepValid) {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = (values: CompanyFormValues) => {
    if (currentStep !== 4) {
      handleNext();
      return;
    }
    const finalValues = { ...values };
    if (finalValues.companyType === "Other") {
      finalValues.companyType = finalValues.customCompanyType;
    }
    delete finalValues.customCompanyType;
    onSubmit(finalValues as CompanyFormValues);
  };

  const formValues = form.getValues();

  return (
    <Card className="border-0 shadow-none sm:border sm:shadow-sm">
      <CardHeader className="px-0 sm:px-6 pb-8 border-b border-slate-100">
        <div className="flex items-center justify-between overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center min-w-max">
                <div 
                  className={`flex flex-col items-center gap-2 ${step.id <= currentStep ? "cursor-pointer" : ""}`}
                  onClick={() => {
                    if (step.id < currentStep || (step.id === 4 && currentStep === 4)) {
                      setCurrentStep(step.id);
                    }
                  }}
                >
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-200 ${
                      isActive 
                        ? "border-primary bg-primary/10 text-primary" 
                        : isCompleted 
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-slate-200 bg-card text-slate-400"
                    }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs font-medium ${isActive || isCompleted ? "text-slate-900" : "text-slate-400"}`}>
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`w-12 sm:w-24 h-0.5 mx-2 sm:mx-4 ${isCompleted ? "bg-primary" : "bg-slate-200"}`} />
                )}
              </div>
            );
          })}
        </div>
      </CardHeader>
      
      <Form {...form}>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target instanceof HTMLElement && e.target.tagName !== "TEXTAREA") {
              e.preventDefault();
              if (currentStep < 4) {
                handleNext();
              }
            }
          }}
        >
          <CardContent className="px-0 sm:px-6 py-6 sm:py-8 min-h-[400px]">
            {/* STEP 1: BASIC INFO */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="companyCode" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Code *</FormLabel>
                      <FormControl><Input placeholder="e.g. ACME" {...field} disabled={isEditing} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="companyName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name *</FormLabel>
                      <FormControl><Input placeholder="e.g. Acme Corp" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="legalName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Legal Name</FormLabel>
                      <FormControl><Input placeholder="Acme Corporation Ltd." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="companyType" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Type</FormLabel>
                      <Select onValueChange={(val) => {
                        field.onChange(val);
                        if (val !== "Other") form.setValue("customCompanyType", "");
                      }} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {COMPANY_TYPES.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  {form.watch("companyType") === "Other" && (
                    <FormField control={form.control} name="customCompanyType" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specify Company Type *</FormLabel>
                        <FormControl><Input placeholder="e.g. Cooperative Society" {...field} value={field.value || ""} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  )}
                  <FormField control={form.control} name="registrationNumber" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registration Number</FormLabel>
                      <FormControl><Input placeholder="CIN/LLPIN" {...field} maxLength={21} onChange={(e) => field.onChange(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="gstNumber" render={({ field }) => (
                    <FormItem>
                      <FormLabel>GST Number</FormLabel>
                      <FormControl><Input placeholder="GSTIN" {...field} maxLength={15} onChange={(e) => field.onChange(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="panNumber" render={({ field }) => (
                    <FormItem>
                      <FormLabel>PAN Number</FormLabel>
                      <FormControl><Input placeholder="PAN" {...field} maxLength={10} onChange={(e) => field.onChange(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="registrationDocument" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company register Document</FormLabel>
                      <FormControl><FormFileUpload value={field.value || ""} onChange={field.onChange} accept="application/pdf" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="mouDocument" render={({ field }) => (
                    <FormItem>
                      <FormLabel>MOU Document (PDF)</FormLabel>
                      <FormControl><FormFileUpload value={field.value || ""} onChange={field.onChange} accept="application/pdf" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="panCardDocument" render={({ field }) => (
                    <FormItem>
                      <FormLabel>PAN Card Document (PDF)</FormLabel>
                      <FormControl><FormFileUpload value={field.value || ""} onChange={field.onChange} accept="application/pdf" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="gstDocument" render={({ field }) => (
                    <FormItem>
                      <FormLabel>GST Document (PDF)</FormLabel>
                      <FormControl><FormFileUpload value={field.value || ""} onChange={field.onChange} accept="application/pdf" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="aadharCardDocument" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aadhar Card (PDF)</FormLabel>
                      <FormControl><FormFileUpload value={field.value || ""} onChange={field.onChange} accept="application/pdf" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="msmeCertificateDocument" render={({ field }) => (
                    <FormItem>
                      <FormLabel>MSME Certificate (PDF)</FormLabel>
                      <FormControl><FormFileUpload value={field.value || ""} onChange={field.onChange} accept="application/pdf" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>
            )}

            {/* STEP 2: CONTACT DETAILS */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="ownerName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner Name *</FormLabel>
                      <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registered Email *</FormLabel>
                      <FormControl><Input type="email" placeholder="contact@acme.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number *</FormLabel>
                      <FormControl><Input placeholder="10 digit number" {...field} maxLength={10} onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="alternatePhone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alternate Mobile</FormLabel>
                      <FormControl><Input placeholder="10 digit number (Optional)" {...field} maxLength={10} onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="website" render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Website</FormLabel>
                      <FormControl><Input placeholder="https://acme.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>
            )}

            {/* STEP 3: ADDRESS */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="country" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl><Input placeholder="India" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="state" render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl><Input placeholder="State" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl><Input placeholder="City" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="pincode" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pin Code</FormLabel>
                      <FormControl><Input placeholder="Zip / Pin Code" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Address Line</FormLabel>
                      <FormControl><Input placeholder="Full street address" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>
            )}


            {/* STEP 4: REVIEW */}
            {currentStep === 4 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h3 className="font-semibold text-lg">Basic Information</h3>
                      <Button variant="ghost" size="sm" type="button" onClick={() => setCurrentStep(1)} className="h-7 px-2 text-xs text-primary hover:bg-primary/10">
                        Edit
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Company Name:</span>
                      <span className="font-medium">{formValues.companyName}</span>
                      <span className="text-muted-foreground">Company Code:</span>
                      <span className="font-medium">{formValues.companyCode}</span>
                      <span className="text-muted-foreground">Legal Name:</span>
                      <span className="font-medium">{formValues.legalName || "N/A"}</span>
                      <span className="text-muted-foreground">Company Type:</span>
                      <span className="font-medium">{formValues.companyType === "Other" ? formValues.customCompanyType : formValues.companyType}</span>
                    </div>
                  </div>
                  {/* Contact */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h3 className="font-semibold text-lg">Contact Details</h3>
                      <Button variant="ghost" size="sm" type="button" onClick={() => setCurrentStep(2)} className="h-7 px-2 text-xs text-primary hover:bg-primary/10">
                        Edit
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Owner Name:</span>
                      <span className="font-medium">{formValues.ownerName}</span>
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{formValues.email}</span>
                      <span className="text-muted-foreground">Mobile:</span>
                      <span className="font-medium">{formValues.phone}</span>
                      <span className="text-muted-foreground">Website:</span>
                      <span className="font-medium">{formValues.website || "N/A"}</span>
                    </div>
                  </div>
                  {/* Address */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h3 className="font-semibold text-lg">Address</h3>
                      <Button variant="ghost" size="sm" type="button" onClick={() => setCurrentStep(3)} className="h-7 px-2 text-xs text-primary hover:bg-primary/10">
                        Edit
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="font-medium">{[formValues.city, formValues.state, formValues.country].filter(Boolean).join(", ")}</span>
                      <span className="text-muted-foreground">Pincode:</span>
                      <span className="font-medium">{formValues.pincode || "N/A"}</span>
                      <span className="text-muted-foreground">Address:</span>
                      <span className="font-medium">{formValues.address || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between border-t border-slate-100 pt-6 px-0 sm:px-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (currentStep === 1) navigate('/master-admin/companies');
                else handlePrevious();
              }}
              disabled={isPending}
            >
              {currentStep === 1 ? "Cancel" : (
                <>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </>
              )}
            </Button>
            
            {currentStep < 4 ? (
              <Button key="btn-next-step" type="button" onClick={handleNext} disabled={isPending}>
                Next Step
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                key="btn-submit-form" 
                type="button" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit(handleSubmit)(e);
                }} 
                disabled={isPending}
              >
                {isPending ? "Processing..." : isEditing ? "Save Changes" : (submitButtonText || "Create Company")}
                {!isPending && <Check className="w-4 h-4 ml-2" />}
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
