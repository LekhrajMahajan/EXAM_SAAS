import { z } from "zod";

import {
  SchedulerFrequency,
  SchedulerJob,
  SchedulerStatus,
} from "./scheduler.types";

/*
|--------------------------------------------------------------------------
| Scheduler Name
|--------------------------------------------------------------------------
*/

const schedulerName = z.nativeEnum(SchedulerJob);

/*
|--------------------------------------------------------------------------
| Create Scheduler
|--------------------------------------------------------------------------
*/

export const createSchedulerSchema = z.object({
  body: z.object({
    name: schedulerName,

    frequency: z.nativeEnum(SchedulerFrequency),

    cronExpression: z.string().optional(),

    enabled: z.boolean(),

    payload: z.record(z.string(), z.any()).optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Update Scheduler
|--------------------------------------------------------------------------
*/

export const updateSchedulerSchema = z.object({
  params: z.object({
    name: schedulerName,
  }),

  body: z.object({
    frequency: z.nativeEnum(SchedulerFrequency).optional(),

    cronExpression: z.string().optional(),

    enabled: z.boolean().optional(),

    status: z.nativeEnum(SchedulerStatus).optional(),

    payload: z.record(z.string(), z.any()).optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Scheduler Name
|--------------------------------------------------------------------------
*/

export const schedulerNameSchema = z.object({
  params: z.object({
    name: schedulerName,
  }),
});

/*
|--------------------------------------------------------------------------
| Run Scheduler
|--------------------------------------------------------------------------
*/

export const runSchedulerSchema = schedulerNameSchema;

/*
|--------------------------------------------------------------------------
| Pause Scheduler
|--------------------------------------------------------------------------
*/

export const pauseSchedulerSchema = schedulerNameSchema;

/*
|--------------------------------------------------------------------------
| Resume Scheduler
|--------------------------------------------------------------------------
*/

export const resumeSchedulerSchema = schedulerNameSchema;

/*
|--------------------------------------------------------------------------
| Delete Scheduler
|--------------------------------------------------------------------------
*/

export const deleteSchedulerSchema = schedulerNameSchema;
