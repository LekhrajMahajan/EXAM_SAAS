import { z } from "zod";

import {
  IncidentSeverity,
  IncidentStatus,
  ObserverType,
} from "./observer.types";

/*
|--------------------------------------------------------------------------
| Common ObjectId
|--------------------------------------------------------------------------
*/

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId.");

/*
|--------------------------------------------------------------------------
| Assign Observer
|--------------------------------------------------------------------------
*/

export const assignObserverSchema = z.object({
  body: z.object({
    observerId: objectId,

    companyId: objectId,

    centerId: objectId,

    shiftId: objectId,

    examId: objectId,

    type: z.nativeEnum(ObserverType).optional(),

    remarks: z.string().trim().max(500).optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Observer Id
|--------------------------------------------------------------------------
*/

export const observerIdSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Check In
|--------------------------------------------------------------------------
*/

export const checkInSchema = z.object({
  body: z.object({
    observerId: objectId,

    latitude: z.number().optional(),

    longitude: z.number().optional(),

    deviceId: z.string().optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Check Out
|--------------------------------------------------------------------------
*/

export const checkOutSchema = z.object({
  body: z.object({
    observerId: objectId,

    remarks: z.string().trim().optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Create Incident
|--------------------------------------------------------------------------
*/

export const createIncidentSchema = z.object({
  body: z.object({
    observerId: objectId,

    candidateId: objectId,

    examId: objectId,

    shiftId: objectId,

    centerId: objectId,

    severity: z.nativeEnum(IncidentSeverity),

    title: z.string().trim().min(5).max(200),

    description: z.string().trim().min(10).max(5000),

    attachment: z.string().url().optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Update Incident
|--------------------------------------------------------------------------
*/

export const updateIncidentSchema = z.object({
  params: z.object({
    id: objectId,
  }),

  body: z.object({
    status: z.nativeEnum(IncidentStatus),

    remarks: z.string().trim().optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export const dashboardSchema = z.object({
  query: z.object({
    companyId: objectId.optional(),

    centerId: objectId.optional(),

    shiftId: objectId.optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Live Observer
|--------------------------------------------------------------------------
*/

export const liveObserverSchema = z.object({
  query: z.object({
    shiftId: objectId.optional(),

    centerId: objectId.optional(),

    examId: objectId.optional(),

    status: z.string().optional(),
  }),
});
