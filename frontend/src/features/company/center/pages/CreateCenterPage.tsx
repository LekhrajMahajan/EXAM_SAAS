import { CenterForm } from "../components/CenterForm";
import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router-dom";

export const CreateCenterPage = () => {
  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto min-h-screen">
      <div className="flex items-center justify-between pb-2 border-b border-border dark:border-slate-800/80">
        <h1 className="text-2xl font-bold tracking-tight text-foreground dark:text-white">
          Centers
        </h1>
        <Link to="/company/centers">
          <Button variant="outline" className="font-medium px-5 rounded-lg shadow-sm">
            Cancel Adding
          </Button>
        </Link>
      </div>

      <CenterForm />
    </div>
  );
};
