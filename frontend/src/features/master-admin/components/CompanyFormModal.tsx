import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { companySchema, type CompanyFormValues } from "../schemas/company.schema";
import type { Company } from "../types/company.types";
import { useCreateCompany, useUpdateCompany } from "../hooks/company.hooks";

interface CompanyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  company?: Company | null;
}

export const CompanyFormModal = ({ isOpen, onClose, company }: CompanyFormModalProps) => {
  const isEditing = !!company;
  const { mutate: createCompany, isPending: isCreating } = useCreateCompany();
  const { mutate: updateCompany, isPending: isUpdating } = useUpdateCompany();

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyCode: "",
      companyName: "",
      legalName: "",
      email: "",
      phone: "",
      alternatePhone: "",
      website: "",
      city: "",
      state: "",
      subscriptionPlan: "FREE",
    },
  });

  useEffect(() => {
    if (isOpen && company) {
      form.reset({
        companyCode: company.companyCode,
        companyName: company.companyName,
        legalName: company.legalName || "",
        email: company.email,
        phone: company.phone,
        alternatePhone: company.alternatePhone || "",
        website: company.website || "",
        city: company.city || "",
        state: company.state || "",
        subscriptionPlan: company.subscriptionPlan || "FREE",
      });
    } else if (isOpen && !company) {
      form.reset({
        companyCode: "",
        companyName: "",
        legalName: "",
        email: "",
        phone: "",
        alternatePhone: "",
        website: "",
        city: "",
        state: "",
        subscriptionPlan: "FREE",
      });
    }
  }, [isOpen, company, form]);

  const onSubmit = (values: CompanyFormValues) => {
    if (isEditing) {
      updateCompany(
        { id: company._id, payload: values },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else {
      createCompany(values, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Company" : "Add Company"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the details of the company." : "Fill in the details to create a new company."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="companyCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Code *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. ACME" {...field} disabled={isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Acme Corp" {...field} />
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
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="contact@acme.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone *</FormLabel>
                    <FormControl>
                      <Input placeholder="10 digit number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="legalName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Legal Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Corporation Ltd." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://acme.com" {...field} />
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
                name="subscriptionPlan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subscription Plan</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a plan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="FREE">Free</SelectItem>
                        <SelectItem value="BASIC">Basic</SelectItem>
                        <SelectItem value="PREMIUM">Premium</SelectItem>
                        <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : isEditing ? "Save Changes" : "Create Company"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
