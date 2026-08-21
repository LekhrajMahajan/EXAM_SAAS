import { ClientSession, QueryFilter as FilterQuery, Types } from "mongoose";

import Notification from "./notification.model";

import {
  INotification,
  NotificationDocument,
  NotificationChannel,
  NotificationPriority,
  NotificationStatus,
  NotificationType,
} from "./notification.types";
import { BaseRepository } from "../../common/base.repository";

export interface NotificationQuery {
  page?: number;

  limit?: number;

  recipientId?: string;

  candidateId?: string;

  employeeId?: string;

  companyId?: string;

  examId?: string;

  channel?: NotificationChannel;

  type?: NotificationType;

  status?: NotificationStatus;

  priority?: NotificationPriority;
}

class NotificationRepository extends BaseRepository<INotification> {
  constructor() {
    super(Notification, ["candidateId", "employeeId", "companyId", "examId", "createdBy"]);
  }

  /*
    |--------------------------------------------------------------------------
    | Find Deleted
    |--------------------------------------------------------------------------
    */

  async findDeletedById(id: string) {
    return Notification.findOne({
      _id: id,

      isDeleted: true,
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Find By Recipient
    |--------------------------------------------------------------------------
    */

  async findByRecipient(recipientId: string) {
    return Notification.find({
      recipientId: new Types.ObjectId(recipientId),

      isDeleted: false,
    })

      .sort({
        createdAt: -1,
      });
  }

  /*
    |--------------------------------------------------------------------------
    | Find By Candidate
    |--------------------------------------------------------------------------
    */

  async findByCandidate(candidateId: string) {
    return Notification.find({
      candidateId: new Types.ObjectId(candidateId),

      isDeleted: false,
    })

      .sort({
        createdAt: -1,
      });
  }

  /*
    |--------------------------------------------------------------------------
    | Find By Employee
    |--------------------------------------------------------------------------
    */

  async findByEmployee(employeeId: string) {
    return Notification.find({
      employeeId: new Types.ObjectId(employeeId),

      isDeleted: false,
    })

      .sort({
        createdAt: -1,
      });
  }

  /*
    |--------------------------------------------------------------------------
    | Count Sent
    |--------------------------------------------------------------------------
    */

  async countSent(companyId?: string) {
    const filter: FilterQuery<NotificationDocument> = {
      isDeleted: false,

      status: NotificationStatus.SENT,
    };

    if (companyId) {
      filter.companyId = new Types.ObjectId(companyId);
    }

    return Notification.countDocuments(filter);
  }

  /*
    |--------------------------------------------------------------------------
    | Count Delivered
    |--------------------------------------------------------------------------
    */

  async countDelivered(companyId?: string) {
    const filter: FilterQuery<NotificationDocument> = {
      isDeleted: false,

      status: NotificationStatus.DELIVERED,
    };

    if (companyId) {
      filter.companyId = new Types.ObjectId(companyId);
    }

    return Notification.countDocuments(filter);
  }

  /*
    |--------------------------------------------------------------------------
    | Count Failed
    |--------------------------------------------------------------------------
    */

  async countFailed(companyId?: string) {
    const filter: FilterQuery<NotificationDocument> = {
      isDeleted: false,

      status: NotificationStatus.FAILED,
    };

    if (companyId) {
      filter.companyId = new Types.ObjectId(companyId);
    }

    return Notification.countDocuments(filter);
  }

  /*
    |--------------------------------------------------------------------------
    | Permanent Delete
    |--------------------------------------------------------------------------
    */

  async permanentDelete(id: string) {
    return Notification.findByIdAndDelete(id);
  }
}

export default new NotificationRepository();
