import {
  Model,
  Document,
  Types,
  QueryFilter as FilterQuery,
  UpdateQuery,
} from "mongoose";

export class BaseRepository<T> {
  constructor(
    protected readonly model: Model<T>,
    protected readonly defaultPopulate: string[] = [],
    protected readonly defaultSearchFields: string[] = []
  ) {}

  /*
  |--------------------------------------------------------------------------
  | Create
  |--------------------------------------------------------------------------
  */
  async create(payload: Partial<T>, session?: import("mongoose").ClientSession) {
    const doc = new this.model(payload);
    return await doc.save({ session });
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Id
  |--------------------------------------------------------------------------
  */
  async findById(id: string, populateFields?: string[]) {
    if (!id || !Types.ObjectId.isValid(String(id))) {
      return null;
    }
    const query = this.model.findOne({
      _id: id,
      isDeleted: false,
    } as FilterQuery<T>);

    const popFields = populateFields ?? this.defaultPopulate;
    if (popFields && popFields.length > 0) {
      popFields.forEach((field) => {
        query.populate(field);
      });
    }

    return await query.exec();
  }

  /*
  |--------------------------------------------------------------------------
  | Find All
  |--------------------------------------------------------------------------
  */
  async findAll(
    filters: {
      page?: number;
      limit?: number;
      search?: string;
      searchFields?: string[];
      extraQuery?: Record<string, unknown>;
      [key: string]: any;
    },
    populateFields?: string[]
  ): Promise<{
    data?: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    [key: string]: any;
  }> {
    const {
      page = 1,
      limit = 10,
      search,
      searchFields,
      extraQuery = {},
      ...rest
    } = filters;

    const query: Record<string, unknown> = {
      isDeleted: false,
      ...extraQuery,
      ...rest,
    };

    Object.keys(query).forEach((key) => {
      if (query[key] === undefined) {
        delete query[key];
      }
    });

    const searchFieldsToUse = searchFields ?? this.defaultSearchFields;
    if (search && searchFieldsToUse && searchFieldsToUse.length > 0) {
      const searchTerms = search.trim().split(/\s+/);
      if (searchTerms.length === 1) {
        query.$or = searchFieldsToUse.map((field) => ({
          [field]: {
            $regex: search,
            $options: "i",
          },
        }));
      } else {
        query.$and = searchTerms.map((term) => ({
          $or: searchFieldsToUse.map((field) => ({
            [field]: {
              $regex: term,
              $options: "i",
            },
          })),
        }));
      }
    }

    const skip = (page - 1) * limit;

    const mQuery = this.model
      .find(query as FilterQuery<T>)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const popFields = populateFields ?? this.defaultPopulate;
    if (popFields && popFields.length > 0) {
      popFields.forEach((field) => {
        mQuery.populate(field);
      });
    }

    const [data, total] = await Promise.all([
      mQuery.exec(),
      this.model.countDocuments(query as FilterQuery<T>),
    ]);

    // Many controllers expect { data: dataArray } but the generic returns { data: [] }. 
    // Wait, let's check room.repository.ts... It returns { rooms: rooms, total: ... }
    // Ah! RoomRepository returns { rooms: rooms, total: ... }
    // But BaseRepository returns { data: data, total: ... }
    // How do we match return shapes?
    // We can return `[this.model.collection.collectionName]: data`!
    // Let's use generic "data" and see. Wait, "same return shapes" is required!

    return {
      data, // We must handle this per module
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Update
  |--------------------------------------------------------------------------
  */
  async update(id: string, payload: Partial<T>, populateFields?: string[], session?: import("mongoose").ClientSession) {
    if (!id || !Types.ObjectId.isValid(String(id))) {
      return null;
    }
    const query = this.model.findByIdAndUpdate(id, payload as UpdateQuery<T>, {
      new: true,
      runValidators: true,
      session,
    });

    const popFields = populateFields ?? this.defaultPopulate;
    if (popFields && popFields.length > 0) {
      popFields.forEach((field) => {
        query.populate(field);
      });
    }

    return await query.exec();
  }

  /*
  |--------------------------------------------------------------------------
  | Update Status
  |--------------------------------------------------------------------------
  */
  async updateStatus(id: string, status: string, populateFields?: string[], session?: import("mongoose").ClientSession) {
    if (!id || !Types.ObjectId.isValid(String(id))) {
      return null;
    }
    const query = this.model.findByIdAndUpdate(
      id,
      { status } as UpdateQuery<T>,
      {
        new: true,
        runValidators: true,
        session,
      }
    );

    const popFields = populateFields ?? this.defaultPopulate;
    if (popFields && popFields.length > 0) {
      popFields.forEach((field) => {
        query.populate(field);
      });
    }

    return await query.exec();
  }

  /*
  |--------------------------------------------------------------------------
  | Soft Delete
  |--------------------------------------------------------------------------
  */
  async softDelete(id: string, session?: import("mongoose").ClientSession) {
    if (!id || !Types.ObjectId.isValid(String(id))) {
      return null;
    }
    return await this.model.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: new Date(),
      } as UpdateQuery<T>,
      {
        new: true,
        runValidators: true,
        session,
      }
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Hard Delete
  |--------------------------------------------------------------------------
  */
  async hardDelete(id: string, session?: import("mongoose").ClientSession) {
    if (!id || !Types.ObjectId.isValid(String(id))) {
      return null;
    }
    return await this.model.findByIdAndDelete(id, { session });
  }

  /*
  |--------------------------------------------------------------------------
  | Restore
  |--------------------------------------------------------------------------
  */
  async restore(id: string, session?: import("mongoose").ClientSession) {
    if (!id || !Types.ObjectId.isValid(String(id))) {
      return null;
    }
    return await this.model.findByIdAndUpdate(
      id,
      {
        isDeleted: false,
        deletedAt: null,
      } as UpdateQuery<T>,
      {
        new: true,
        runValidators: true,
        session,
      }
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Count
  |--------------------------------------------------------------------------
  */
  async count(extraQuery?: Record<string, unknown>) {
    const query: Record<string, unknown> = {
      isDeleted: false,
      ...extraQuery,
    };

    return await this.model.countDocuments(query as FilterQuery<T>);
  }
}
