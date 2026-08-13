import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Building2 } from "lucide-react";
import { useCompanies } from "../../hooks/company.hooks";
import { Badge } from "@/shared/components/ui/badge";

export const RecentCompaniesWidget = () => {
  const { data: response, isLoading, isError } = useCompanies({ page: 1, limit: 5 });

  return (
    <Card className="col-span-full md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-indigo-500" />
          Recent Companies
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isError ? (
          <div className="text-sm text-red-500 p-4 border border-dashed rounded bg-red-50 text-center">
            Failed to load recent companies.
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        ) : !response?.data?.length ? (
          <div className="text-sm text-slate-500 p-6 border border-dashed rounded bg-slate-50 text-center">
            No recent companies found.
          </div>
        ) : (
          <div className="space-y-4">
            {response.data.map((company, i) => (
              <div key={company._id ? `${company._id}-${i}` : `company-${i}`} className="flex justify-between items-center border-b last:border-0 pb-3">
                <div>
                  <p className="text-sm font-semibold">{company.companyName}</p>
                  <p className="text-xs text-muted-foreground">{company.email}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant={company.status ? "success" : "secondary"} className={company.status ? "bg-green-100 text-green-800" : ""}>
                    {company.status ? "Active" : "Pending"}
                  </Badge>
                  <span className="text-[10px] text-slate-400">
                    {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(company.createdAt))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
