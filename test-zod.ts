import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/);
const dashboardSchema = z.object({
  query: z.object({
    examId: z.union([objectId, z.literal("")]).optional(),
  }).catchall(z.any()),
});

try {
  dashboardSchema.parse({
    body: {},
    params: {},
    query: {},
  });
  console.log("Success");
} catch (e) {
  console.log("Failed:", e.issues);
}
