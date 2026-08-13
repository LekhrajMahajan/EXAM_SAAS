import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";
import observerRepository from "./observer.repository";
import { BaseService } from "../../common/base.service";
import { IObserverAssignment } from "./observer.types";

class ObserverService extends BaseService<IObserverAssignment> {
  constructor() {
    super(observerRepository, "Observer");
  }
  /*
  |--------------------------------------------------------------------------
  | Assign Observer
  |--------------------------------------------------------------------------
  */

  async assignObserver(payload: Record<string, unknown>) {
    return super.create(payload);
  }

  /*
  |--------------------------------------------------------------------------
  | Get Observers
  |--------------------------------------------------------------------------
  */

  async getObservers(filter: Record<string, unknown> = {}) {
    const result = await super.getAll(filter);
    return result.data;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Observer By Id
  |--------------------------------------------------------------------------
  */

  async getObserverById(id: string) {
    return super.getById(id);
  }

  /*
  |--------------------------------------------------------------------------
  | Check In
  |--------------------------------------------------------------------------
  */

  async checkIn(id: string) {
    const observer = await observerRepository.checkIn(id);

    if (!observer) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Observer not found.");
    }

    return observer;
  }

  /*
  |--------------------------------------------------------------------------
  | Check Out
  |--------------------------------------------------------------------------
  */

  async checkOut(id: string) {
    const observer = await observerRepository.checkOut(id);

    if (!observer) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Observer not found.");
    }

    return observer;
  }

  /*
  |--------------------------------------------------------------------------
  | Create Incident
  |--------------------------------------------------------------------------
  */

  async createIncident(observerId: string, incident: Record<string, unknown>) {
    const observer = await observerRepository.createIncident(
      observerId,
      incident,
    );

    if (!observer) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Observer not found.");
    }

    return observer;
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
    const observer = await observerRepository.updateIncident(
      observerId,
      incidentId,
      payload,
    );

    if (!observer) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Observer or incident not found.",
      );
    }

    return observer;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Incidents
  |--------------------------------------------------------------------------
  */

  async getIncidents(filter: Record<string, unknown> = {}) {
    return observerRepository.getIncidents(filter);
  }

  /*
  |--------------------------------------------------------------------------
  | Dashboard
  |--------------------------------------------------------------------------
  */

  async getDashboard() {
    return observerRepository.getDashboard();
  }

  /*
  |--------------------------------------------------------------------------
  | Live Observers
  |--------------------------------------------------------------------------
  */

  async getLiveObservers() {
    return observerRepository.getLiveObservers();
  }
}

export default new ObserverService();
