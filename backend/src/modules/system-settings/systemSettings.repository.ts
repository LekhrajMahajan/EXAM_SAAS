import { BaseRepository } from "../../common/base.repository";
import SystemSettings from "./systemSettings.model";
import { SettingCategory } from "./systemSettings.types";

class SystemSettingsRepository extends BaseRepository<any> {
  constructor() {
    super(SystemSettings, ["createdBy", "updatedBy"]);
  }


  /*
    |--------------------------------------------------------------------------
    | Find By Key
    |--------------------------------------------------------------------------
    */

  async findByKey(key: string) {
    return SystemSettings.findOne({
      key: key.toUpperCase(),
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Find All
    |--------------------------------------------------------------------------
    */

  async findAll(filter: Record<string, unknown> = {}): Promise<any> {
    return SystemSettings.find(filter).sort({
      category: 1,

      key: 1,
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Find By Category
    |--------------------------------------------------------------------------
    */

  async findByCategory(category: SettingCategory) {
    return SystemSettings.find({
      category,

      isActive: true,
    }).sort({
      key: 1,
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Update By Id
    |--------------------------------------------------------------------------
    */

  async updateById(
    id: string,

    payload: Record<string, unknown>,
  ) {
    return SystemSettings.findByIdAndUpdate(
      id,

      payload,

      {
        new: true,

        runValidators: true,
      },
    );
  }

  /*
    |--------------------------------------------------------------------------
    | Update By Key
    |--------------------------------------------------------------------------
    */

  async updateByKey(
    key: string,

    payload: Record<string, unknown>,
  ) {
    return SystemSettings.findOneAndUpdate(
      {
        key: key.toUpperCase(),
      },

      payload,

      {
        new: true,

        runValidators: true,
      },
    );
  }

  /*
    |--------------------------------------------------------------------------
    | Delete By Id
    |--------------------------------------------------------------------------
    */

  async deleteById(id: string) {
    return SystemSettings.findByIdAndDelete(id);
  }

  /*
    |--------------------------------------------------------------------------
    | Delete By Key
    |--------------------------------------------------------------------------
    */

  async deleteByKey(key: string) {
    return SystemSettings.findOneAndDelete({
      key: key.toUpperCase(),
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Reset Category
    |--------------------------------------------------------------------------
    */

  async resetCategory(category: SettingCategory) {
    return SystemSettings.updateMany(
      {
        category,
      },

      {
        $set: {
          isActive: false,
        },
      },
    );
  }

  /*
    |--------------------------------------------------------------------------
    | Count
    |--------------------------------------------------------------------------
    */

  async count(filter: Record<string, unknown> = {}) {
    return SystemSettings.countDocuments(filter);
  }
}

export default new SystemSettingsRepository();
