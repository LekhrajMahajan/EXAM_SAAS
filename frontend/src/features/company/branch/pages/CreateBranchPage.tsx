import { BranchForm } from "../components/BranchForm";
import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";

export const CreateBranchPage = () => {
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
        <BranchForm />
      </div>
    </div>
  );
};
