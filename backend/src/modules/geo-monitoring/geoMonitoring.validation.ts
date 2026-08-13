import { z } from "zod";
import { GeoEntityType } from "./geoMonitoring.types";

export const recordLocationSchema = z.object({
  body: z.object({
    entityType: z.nativeEnum(GeoEntityType),
    entityId: z.string().min(1, "Entity ID is required"),
    examId: z.string().min(1, "Exam ID is required"),
    latitude: z.number().min(-90).max(90, "Invalid latitude"),
    longitude: z.number().min(-180).max(180, "Invalid longitude"),
    accuracy: z.number().min(0, "Accuracy must be positive"),
    centerId: z.string().optional(), // For geofencing
  }),
});

export const getLatestLocationSchema = z.object({
  params: z.object({
    examId: z.string().min(1, "Exam ID is required"),
    entityId: z.string().min(1, "Entity ID is required"),
  }),
});

export const getAllLatestLocationsSchema = z.object({
  params: z.object({
    examId: z.string().min(1, "Exam ID is required"),
  }),
});
