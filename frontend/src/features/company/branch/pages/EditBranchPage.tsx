import { BranchForm } from "../components/BranchForm";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { useBranch } from "../hooks/branch.hooks";
import { Loader2 } from "lucide-react";

export const EditBranchPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: response, isLoading } = useBranch(id || "");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const branch = response?.data || (response as any)?.branch;

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between pb-2">
        <h1 className="text-2xl font-bold tracking-tight text-[#2D3E2C] dark:text-white">
          Branch
        </h1>
        <Link to="/company/branches">
          <Button type="button" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg shadow-xs">
            Cancel Adding
          </Button>
        </Link>
      </div>
      <div className="pb-12">
        {isLoading ? (
          <div className="flex justify-center items-center h-64 border border-slate-200 dark:border-slate-800 rounded-xl bg-card">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : branch ? (
          <>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <BranchForm initialData={branch as any} isEdit />
          </>
        ) : (
          <div className="text-center p-6 border rounded-xl bg-card">Branch not found</div>
        )}
      </div>
    </div>
  );
};
