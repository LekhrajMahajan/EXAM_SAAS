import Shift from "./shift.model";
import { IShift, ShiftDocument } from "./shift.types";

class ShiftRepository {
  /*
  |--------------------------------------------------------------------------
  | Create
  |--------------------------------------------------------------------------
  */
  async create(data: Partial<IShift>): Promise<ShiftDocument> {
    return await Shift.create(data);
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Id
  |--------------------------------------------------------------------------
  */
  async findById(id: string): Promise<ShiftDocument | null> {
    return await Shift.findOne({ _id: id, isDeleted: false });
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Code (Unique per Center)
  |--------------------------------------------------------------------------
  */
  async findByCode(
    centerId: string,
    shiftCode: string,
  ): Promise<ShiftDocument | null> {
    return await Shift.findOne({ centerId, shiftCode, isDeleted: false });
  }

  /*
  |--------------------------------------------------------------------------
  | Find All
  |--------------------------------------------------------------------------
  */
  async findAll(
    filter: Record<string, any> = {},
    skip: number = 0,
    limit: number = 10,
  ): Promise<{ data: ShiftDocument[]; total: number }> {
    const query = { ...filter, isDeleted: false };
    const [data, total] = await Promise.all([
      Shift.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Shift.countDocuments(query),
    ]);
    return { data, total };
  }

  /*
  |--------------------------------------------------------------------------
  | Update
  |--------------------------------------------------------------------------
  */
  async update(
    id: string,
    data: Partial<IShift>,
  ): Promise<ShiftDocument | null> {
    return await Shift.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: data },
      { new: true, runValidators: true },
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Soft Delete
  |--------------------------------------------------------------------------
  */
  async softDelete(id: string): Promise<ShiftDocument | null> {
    return await Shift.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true },
    );
  }
}

export default new ShiftRepository();
