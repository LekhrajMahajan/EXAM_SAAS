const { z } = require("zod");

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
  console.log("Failed:", JSON.stringify(e.issues, null, 2));
}
