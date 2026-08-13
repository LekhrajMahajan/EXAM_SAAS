import { z } from "zod";

export const scanIpSchema = z.object({
  body: z.object({
    ipAddress: z.string().min(1, { message: "Invalid IP address" }),
    centerId: z.string().optional(),
  }),
});
