import api from "@/services/api";

export const companyApi = {
  getUsageStats: async () => {
    const { data } = await api.get("/companies/usage-stats");
    return data;
  },
};
