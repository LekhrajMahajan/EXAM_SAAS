import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { CompanyForm } from "../components/company/CompanyForm";
import { useCreateCompany } from "../hooks/company.hooks";
import type { CompanyFormValues } from "../schemas/company.schema";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";


export const CreateCompanyPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { mutate: createCompany, isPending } = useCreateCompany();

  const queryClient = useQueryClient();

  const handleSubmit = async (values: CompanyFormValues) => {
    createCompany(values, {
      onSuccess: async () => {
        toast({ title: "Success", description: "Company created successfully. Login credentials sent." });
        await queryClient.resetQueries({ queryKey: ['companies'] });
        navigate("/master-admin/companies");
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/master-admin/companies')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Company</h1>
          <p className="text-muted-foreground mt-1">
            Register a new company to the platform.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full">
        <CompanyForm onSubmit={handleSubmit} isPending={isPending} />
      </div>
    </div>
  );
};
