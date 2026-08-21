import Seat from "./seat.model";
import { ISeat, SeatStatus } from "./seat.types";
import { BaseRepository } from "../../common/base.repository";

class SeatRepository extends BaseRepository<ISeat> {
  constructor() {
    super(
      Seat,
      ["companyId", "centerId", "roomId"],
      ["seatNumber", "row"]
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Create Many Seats
  |--------------------------------------------------------------------------
  */
  async createMany(payload: Partial<ISeat>[]) {
    return await Seat.insertMany(payload, {
      ordered: true,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Seat Number
  |--------------------------------------------------------------------------
  */
  async findBySeatNumber(roomId: string, seatNumber: string) {
    return await Seat.findOne({
      roomId,
      seatNumber,
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Position
  |--------------------------------------------------------------------------
  */
  async findByPosition(roomId: string, row: string, column: number) {
    return await Seat.findOne({
      roomId,
      row,
      column,
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Room
  |--------------------------------------------------------------------------
  */
  async findByRoom(roomId: string) {
    return await Seat.find({
      roomId,
      isDeleted: false,
    }).sort({
      row: 1,
      column: 1,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Block Seat
  |--------------------------------------------------------------------------
  */
  async blockSeat(id: string, remarks?: string) {
    return await Seat.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
        status: SeatStatus.BLOCKED,
        remarks,
      },
      {
        new: true,
      },
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Unblock Seat
  |--------------------------------------------------------------------------
  */
  async unblockSeat(id: string) {
    return await Seat.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
        status: SeatStatus.AVAILABLE,
      },
      {
        new: true,
      },
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Count Available Seats
  |--------------------------------------------------------------------------
  */
  async countAvailable(roomId: string) {
    return await Seat.countDocuments({
      roomId,
      status: SeatStatus.AVAILABLE,
      isDeleted: false,
      isBlocked: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Delete All Room Seats
  |--------------------------------------------------------------------------
  */
  async deleteRoomSeats(roomId: string) {
    return await Seat.deleteMany({
      roomId,
    });
  }
}

export default new SeatRepository();
