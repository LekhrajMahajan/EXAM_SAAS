import Room from "./room.model";
import { IRoom } from "./room.types";
import { BaseRepository } from "../../common/base.repository";

class RoomRepository extends BaseRepository<IRoom> {
  constructor() {
    super(Room, ["companyId", "branchId", "centerId"]);
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Room Code
  |--------------------------------------------------------------------------
  */
  async findByRoomCode(
    companyId: string,
    branchId: string,
    centerId: string,
    roomCode: string,
  ) {
    return await Room.findOne({
      companyId,
      branchId,
      centerId,
      roomCode,
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Room Name
  |--------------------------------------------------------------------------
  */
  async findByRoomName(
    companyId: string,
    branchId: string,
    centerId: string,
    roomName: string,
  ) {
    return await Room.findOne({
      companyId,
      branchId,
      centerId,
      roomName,
      isDeleted: false,
    });
  }
}

export default new RoomRepository();
