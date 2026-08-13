import { useQuery } from '@tanstack/react-query';
import { companyDetailsApi } from '../api/company-details.api';

const QUERY_KEYS = {
  details: (companyId: string) => ['company-details-summary', companyId] as const,
};

export const useCompanyAggregatedStats = (companyId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.details(companyId),
    queryFn: async () => {
      // Execute all endpoints in parallel
      const [
        branches,
        centers,
        employees,
        exams,
        candidates,
      ] = await Promise.all([
        companyDetailsApi.getBranchSummary(companyId).catch(() => ({ pagination: { total: 0 } })),
        companyDetailsApi.getCenterSummary(companyId).catch(() => ({ pagination: { total: 0 } })),
        companyDetailsApi.getEmployeeSummary(companyId).catch(() => ({ pagination: { total: 0 } })),
        companyDetailsApi.getExamSummary(companyId).catch(() => ({ pagination: { total: 0 } })),
        companyDetailsApi.getCandidateSummary(companyId).catch(() => ({ pagination: { total: 0 } })),
      ]);

      return {
        totalBranches: branches.pagination?.total || 0,
        totalCenters: centers.pagination?.total || 0,
        totalEmployees: employees.pagination?.total || 0,
        totalExams: exams.pagination?.total || 0,
        totalCandidates: candidates.pagination?.total || 0,
      };
    },
    enabled: !!companyId,
  });
};

export const useCompanyActivityTimeline = (companyId: string) => {
  return useQuery({
    queryKey: ['company-activity-timeline', companyId],
    queryFn: () => companyDetailsApi.getActivityTimeline(companyId),
    enabled: !!companyId,
  });
};
