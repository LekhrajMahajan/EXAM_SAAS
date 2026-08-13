import { useNavigate, useParams } from "react-router-dom";
import { PlanForm } from "../components/plan/PlanForm";
import { usePlan, useUpdatePlan } from "../hooks/plan.hooks";
import type { PlanFormValues } from "../schemas/plan.schema";
import { Loader2 } from "lucide-react";

export const EditPlanPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: plan, isLoading: isFetching } = usePlan(id!);
  const { mutateAsync: updatePlan, isPending } = useUpdatePlan();

  if (isFetching) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex flex-col h-[400px] items-center justify-center gap-4">
        <h3 className="text-lg font-medium">Plan not found</h3>
        <button 
          onClick={() => navigate('/master-admin/plans')}
          className="text-primary hover:underline"
        >
          Back to Plans
        </button>
      </div>
    );
  }

  const handleSubmit = async (data: PlanFormValues) => {
    try {
      await updatePlan({ id: id!, data });
      navigate("/master-admin/plans");
    } catch (error) {
      console.error("Failed to update plan:", error);
    }
  };

  return (
    <div className="py-6">
      <PlanForm 
        initialData={plan} 
        onSubmit={handleSubmit} 
        isLoading={isPending} 
      />
    </div>
  );
};
