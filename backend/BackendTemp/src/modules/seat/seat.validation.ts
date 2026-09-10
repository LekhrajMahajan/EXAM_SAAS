import { z } from "zod";
import { SeatStatus, SeatType } from "./seat.types";

/*
|--------------------------------------------------------------------------
| Mongo ObjectId
|--------------------------------------------------------------------------
*/

const objectId = z
  .string()
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

/*
|--------------------------------------------------------------------------
| Create Seat
|--------------------------------------------------------------------------
*/

const seatBodySchema = z.object({
  companyId: objectId,

  centerId: objectId,

  roomId: objectId,

  seatNumber: z
    .string()
    .trim()
    .min(2)
    .max(20)
    .transform((value) => value.toUpperCase()),

  row: z
    .string()
    .trim()
    .min(1)
    .max(5)
    .transform((value) => value.toUpperCase()),

  column: z.number().int().positive(),

  seatType: z.nativeEnum(SeatType).optional(),

  status: z.nativeEnum(SeatStatus).optional(),

  isBlocked: z.boolean().optional(),

  remarks: z.string().trim().max(500).optional(),
});

const seatPreprocess = (val: any) => {
  if (val && typeof val === "object") {
    const data = { ...val };
    if (data.seatRow !== undefined && data.row === undefined) {
      data.row = data.seatRow;
    }
    if (data.seatColumn !== undefined && data.column === undefined) {
      data.column = data.seatColumn;
    }
    return data;
  }
  return val;
};

export const createSeatSchema = z.object({
  body: z.preprocess(seatPreprocess, seatBodySchema)
});

/*
|--------------------------------------------------------------------------
| Update Seat
|--------------------------------------------------------------------------
*/

export const updateSeatSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.preprocess(seatPreprocess, seatBodySchema.partial())
});

/*
|--------------------------------------------------------------------------
| Generate Seats
|--------------------------------------------------------------------------
*/

export const generateSeatsSchema = z.object({
  body: z.object({
    roomId: objectId,

    rows: z.number().int().positive().max(26),

    columns: z.number().int().positive().max(100),
  })
});

/*
|--------------------------------------------------------------------------
| Block / Unblock Seat
|--------------------------------------------------------------------------
*/

export const blockSeatSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.object({
    remarks: z.string().trim().max(500).optional(),
  })
});

/*
|--------------------------------------------------------------------------
| Update Status
|--------------------------------------------------------------------------
*/

export const updateSeatStatusSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.object({
    status: z.nativeEnum(SeatStatus),
  })
});

/*
|--------------------------------------------------------------------------
| Params
|--------------------------------------------------------------------------
*/

export const seatIdSchema = z.object({
  params: z.object({
    id: objectId,
  })
});

/*
|--------------------------------------------------------------------------
| Query
|--------------------------------------------------------------------------
*/

export const seatQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),

    limit: z.coerce.number().min(1).max(100).default(10),

    search: z.string().trim().optional(),

    companyId: objectId.optional(),

    centerId: objectId.optional(),

    roomId: objectId.optional(),

    row: z.string().trim().optional(),

    seatType: z.nativeEnum(SeatType).optional(),

    status: z.nativeEnum(SeatStatus).optional(),

    isBlocked: z.coerce.boolean().optional(),
  })
});
