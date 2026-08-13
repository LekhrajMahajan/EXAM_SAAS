import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { CompanyForm } from "@/features/master-admin/components/company/CompanyForm";
import { useRegisterCompany } from "@/features/master-admin/hooks/company.hooks";
import { useToast } from "@/hooks/use-toast";
import type { CompanyFormValues } from "@/features/master-admin/schemas/company.schema";
import { usePublicSettings } from '@/features/master-admin/hooks/system-settings.hooks';

export const RegisterCompanyPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { mutate: registerCompany, isPending } = useRegisterCompany();
  
  const { data: orgSettings } = usePublicSettings();
  const primaryLogo = orgSettings?.data?.find(s => s.key === "LOGO_PRIMARY")?.value;
  const shortName = orgSettings?.data?.find(s => s.key === "ORG_SHORT_NAME")?.value || "EP";
  const orgName = orgSettings?.data?.find(s => s.key === "ORG_NAME")?.value || "ExamGuard Pro";

  const handleSubmit = async (values: CompanyFormValues) => {
    registerCompany(values, {
      onSuccess: () => {
        toast({
          title: "Registration Submitted",
          description: "Your registration request has been submitted successfully. Your company will become active after verification.",
        });
        navigate("/auth/login");
      },
    });
  };

  return (
    <div className="min-h-screen bg-muted/40 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        <div className="text-center">
          {primaryLogo ? (
            <img 
              src={primaryLogo as string} 
              alt={orgName as string} 
              className="mx-auto h-16 w-auto object-contain mb-4" 
            />
          ) : (
            <div className="mx-auto h-12 w-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl mb-4">
              {(shortName as string).substring(0, 2).toUpperCase()}
            </div>
          )}
          <h2 className="text-3xl font-bold tracking-tight text-primary">Register Your Company</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Apply for an account to start using {orgName as string}
          </p>
        </div>

        <div className="bg-background p-8 rounded-xl shadow-lg border">
          <div className="mb-6 flex items-center">
            <Button variant="ghost" size="sm" onClick={() => navigate('/auth/login')} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </div>
          <CompanyForm onSubmit={handleSubmit} isPending={isPending} submitButtonText="Approval Request" />
        </div>
        
        <div className="text-center text-sm">
          <Link to="/auth/login" className="text-muted-foreground hover:text-primary transition-colors">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
