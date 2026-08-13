import { useNavigate } from "react-router-dom";
import { PlanForm } from "../components/plan/PlanForm";
import { useCreatePlan } from "../hooks/plan.hooks";
import type { PlanFormValues } from "../schemas/plan.schema";

export const CreatePlanPage = () => {
  const navigate = useNavigate();
  const { mutateAsync: createPlan, isPending } = useCreatePlan();

  const handleSubmit = async (data: PlanFormValues) => {
    try {
      await createPlan(data);
      navigate("/master-admin/plans");
    } catch (error) {
      console.error("Failed to create plan:", error);
    }
  };

  return (
    <div className="py-6">
      <PlanForm onSubmit={handleSubmit} isLoading={isPending} />
    </div>
  );
};
