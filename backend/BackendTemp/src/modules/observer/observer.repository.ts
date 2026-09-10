import { BaseRepository } from "../../common/base.repository";
import Observer from "./observer.model";

import { ObserverStatus } from "./observer.types";

class ObserverRepository extends BaseRepository<any> {
  constructor() {
    super(Observer, [
      "observerId",
      "examId",
      "shiftId",
      "centerId",
      "trustScoreId",
    ]);
  }



  /*
    |--------------------------------------------------------------------------
    | Check In
    |--------------------------------------------------------------------------
    */

  async checkIn(id: string) {
    return Observer.findByIdAndUpdate(
      id,

      {
        status: ObserverStatus.CHECKED_IN,

        checkInAt: new Date(),
      },

      {
        returnDocument: 'after',
      },
    );
  }

  /*
    |--------------------------------------------------------------------------
    | Check Out
    |--------------------------------------------------------------------------
    */

  async checkOut(id: string) {
    return Observer.findByIdAndUpdate(
      id,

      {
        status: ObserverStatus.CHECKED_OUT,

        checkOutAt: new Date(),
      },

      {
        returnDocument: 'after',
      },
    );
  }

  /*
    |--------------------------------------------------------------------------
    | Create Incident
    |--------------------------------------------------------------------------
    */

  async createIncident(
    observerId: string,

    incident: Record<string, unknown>,
  ) {
    return Observer.findByIdAndUpdate(
      observerId,

      {
        $push: {
          incidents: incident,
        },
      },

      {
        returnDocument: 'after',
      },
    );
  }

  /*
    |--------------------------------------------------------------------------
    | Update Incident
    |--------------------------------------------------------------------------
    */

  async updateIncident(
    observerId: string,

    incidentId: string,

    payload: Record<string, unknown>,
  ) {
    return Observer.findOneAndUpdate(
      {
        _id: observerId,

        "incidents._id": incidentId,
      },

      {
        $set: {
          "incidents.$.status": payload.status,

          "incidents.$.remarks": payload.remarks,
        },
      },

      {
        returnDocument: 'after',
      },
    );
  }

  /*
    |--------------------------------------------------------------------------
    | Get Incidents
    |--------------------------------------------------------------------------
    */

  async getIncidents(filter: Record<string, unknown> = {}) {
    return Observer.find(filter)

      .select("incidents observerId");
  }

  /*
    |--------------------------------------------------------------------------
    | Dashboard
    |--------------------------------------------------------------------------
    */

  async getDashboard() {
    return Observer.aggregate([
      {
        $group: {
          _id: "$status",

          total: {
            $sum: 1,
          },
        },
      },
    ]);
  }

  /*
    |--------------------------------------------------------------------------
    | Live Observers
    |--------------------------------------------------------------------------
    */

  async getLiveObservers() {
    return Observer.find({
      status: {
        $in: [ObserverStatus.CHECKED_IN, ObserverStatus.ON_DUTY],
      },
    })

      .populate("observerId")

      .populate("shiftId")

      .populate("centerId");
  }
}

export default new ObserverRepository();
