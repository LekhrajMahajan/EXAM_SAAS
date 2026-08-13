import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { CompanyForm } from "../components/company/CompanyForm";
import { useCompany, useUpdateCompany } from "../hooks/company.hooks";
import type { CompanyFormValues } from "../schemas/company.schema";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const EditCompanyPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: response, isLoading, isError } = useCompany(id!);
  const { mutate: updateCompany, isPending } = useUpdateCompany();

  const handleSubmit = (values: CompanyFormValues) => {
    updateCompany(
      { id: id!, payload: values },
      { onSuccess: () => navigate('/master-admin/companies') }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-[400px] w-full max-w-4xl" />
      </div>
    );
  }

  if (isError || !response?.data) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load company details. It may have been deleted.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/master-admin/companies')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Company</h1>
          <p className="text-muted-foreground mt-1">
            Update details for {response.data.companyName}.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full">
        <CompanyForm company={response.data} onSubmit={handleSubmit} isPending={isPending} />
      </div>
    </div>
  );
};
