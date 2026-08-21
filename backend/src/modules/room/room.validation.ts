import { z } from "zod";
import { RoomStatus, RoomType } from "./room.types";

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
| Create Room
|--------------------------------------------------------------------------
*/

const roomBaseObjectSchema = z
  .object({
    companyId: objectId,

    centerId: objectId,

    roomCode: z
      .string()
      .trim()
      .min(2)
      .max(20)
      .transform((value) => value.toUpperCase()),

    roomName: z.string().trim().min(3).max(150),

    roomType: z.nativeEnum(RoomType),

    building: z.string().trim().min(1).max(100),

    floor: z.number().int().min(0),

    capacity: z.number().int().positive(),

    availableSeats: z.number().int().nonnegative(),

    rows: z.number().int().positive(),

    columns: z.number().int().positive(),

    cameraAvailable: z.boolean().optional(),

    biometricDevice: z.boolean().optional(),

    status: z.nativeEnum(RoomStatus).optional(),
  });

const roomBodySchema = roomBaseObjectSchema.superRefine((data, ctx) => {
    if (data.availableSeats > data.capacity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["availableSeats"],
        message: "Available seats cannot exceed capacity.",
      });
    }

    if (data.rows * data.columns < data.capacity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["capacity"],
        message: "Rows × Columns must be greater than or equal to capacity.",
      });
    }
  });

const roomPreprocess = (val: any) => {
  if (val && typeof val === "object") {
    const data = { ...val };
    if (data.availableSeats === undefined && data.capacity !== undefined) {
      data.availableSeats = data.capacity;
    }
    if (data.rows === undefined) {
      data.rows = 1;
    }
    if (data.columns === undefined && data.capacity !== undefined) {
      data.columns = data.capacity;
    }
    if (data.roomType === undefined) {
      data.roomType = "OTHER";
    }
    return data;
  }
  return val;
};

export const createRoomSchema = z.object({
  body: z.preprocess(roomPreprocess, roomBodySchema)
});

/*
|--------------------------------------------------------------------------
| Update Room
|--------------------------------------------------------------------------
*/

export const updateRoomSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.preprocess(roomPreprocess, roomBaseObjectSchema.partial())
});

/*
|--------------------------------------------------------------------------
| Update Status
|--------------------------------------------------------------------------
*/

export const updateRoomStatusSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.object({
    status: z.nativeEnum(RoomStatus),
  })
});

/*
|--------------------------------------------------------------------------
| Params
|--------------------------------------------------------------------------
*/

export const roomIdSchema = z.object({
  params: z.object({
    id: objectId,
  })
});

/*
|--------------------------------------------------------------------------
| Query
|--------------------------------------------------------------------------
*/

export const roomQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),

    limit: z.coerce.number().min(1).max(100).default(10),

    search: z.string().trim().optional(),

    companyId: objectId.optional(),

    centerId: objectId.optional(),

    roomType: z.nativeEnum(RoomType).optional(),

    status: z.nativeEnum(RoomStatus).optional(),

    building: z.string().trim().optional(),

    floor: z.coerce.number().optional(),
  })
});
