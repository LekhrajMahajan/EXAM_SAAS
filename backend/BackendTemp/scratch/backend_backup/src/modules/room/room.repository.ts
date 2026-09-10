import Room from "./room.model";
import { IRoom } from "./room.types";
import { BaseRepository } from "../../common/base.repository";

class RoomRepository extends BaseRepository<IRoom> {
  constructor() {
    super(Room, ["companyId", "centerId"]);
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Room Code
  |--------------------------------------------------------------------------
  */
  async findByRoomCode(
    companyId: string,
    centerId: string,
    roomCode: string,
  ) {
    return await Room.findOne({
      companyId,
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
    centerId: string,
    roomName: string,
  ) {
    return await Room.findOne({
      companyId,
      centerId,
      roomName,
      isDeleted: false,
    });
  }
}

export default new RoomRepository();
