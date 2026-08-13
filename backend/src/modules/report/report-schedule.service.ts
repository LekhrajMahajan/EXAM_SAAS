import { ScheduledReport, IScheduledReport } from "./report-schedule.model";
import { ReportExecution } from "./report-execution.model";
import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";
import mongoose from "mongoose";

class ReportScheduleService {
  async getSchedules(query: any) {
    const { search, status, page = 1, limit = 10 } = query;
    const filter: any = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }
    if (status) {
      filter.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [schedules, total] = await Promise.all([
      ScheduledReport.find(filter)
        .populate("templateId", "name")
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      ScheduledReport.countDocuments(filter)
    ]);

    const activeCount = await ScheduledReport.countDocuments({ status: 'Active' });

    return {
      schedules,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      },
      stats: {
        totalSchedules: total,
        activeSchedules: activeCount
      }
    };
  }

  async getScheduleById(id: string) {
    const schedule = await ScheduledReport.findById(id).populate("templateId").populate("createdBy", "name email");
    if (!schedule) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Scheduled report not found");
    }
    return schedule;
  }

  async createSchedule(data: Partial<IScheduledReport>, userId: string) {
    const schedule = new ScheduledReport({
      ...data,
      createdBy: new mongoose.Types.ObjectId(userId)
    });
    await schedule.save();
    return schedule;
  }

  async updateSchedule(id: string, data: Partial<IScheduledReport>) {
    const schedule = await ScheduledReport.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!schedule) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Scheduled report not found");
    }
    return schedule;
  }

  async deleteSchedule(id: string) {
    const schedule = await ScheduledReport.findByIdAndDelete(id);
    if (!schedule) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Scheduled report not found");
    }
    return schedule;
  }

  async toggleScheduleStatus(id: string) {
    const schedule = await ScheduledReport.findById(id);
    if (!schedule) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Scheduled report not found");
    }
    
    if (schedule.status === 'Active') {
      schedule.status = 'Paused';
    } else {
      schedule.status = 'Active';
    }
    
    await schedule.save();
    return schedule;
  }

  async runScheduleNow(id: string, userId: string) {
    const schedule = await ScheduledReport.findById(id);
    if (!schedule) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Scheduled report not found");
    }

    // Create execution record
    const execution = new ReportExecution({
      scheduleId: schedule._id,
      templateId: schedule.templateId,
      status: 'Running',
      startedAt: new Date(),
      exportFormat: 'Multiple',
      generatedBy: 'User (Manual Run)'
    });
    await execution.save();

    // Mocking async report generation processing
    setTimeout(async () => {
      try {
        execution.status = 'Completed';
        execution.completedAt = new Date();
        execution.duration = execution.completedAt.getTime() - execution.startedAt!.getTime();
        execution.rowsGenerated = Math.floor(Math.random() * 500) + 10;
        execution.fileUrl = `https://mock-storage.com/reports/${execution._id}.csv`;
        await execution.save();
      } catch (err) {
        execution.status = 'Failed';
        execution.errorMessage = 'Mock error occurred during generation';
        await execution.save();
      }
    }, 2000);

    return execution;
  }

  async getExecutions(query: any) {
    const { scheduleId, status, page = 1, limit = 10 } = query;
    const filter: any = {};
    if (scheduleId) filter.scheduleId = scheduleId;
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [executions, total] = await Promise.all([
      ReportExecution.find(filter)
        .populate("templateId", "name")
        .populate("scheduleId", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      ReportExecution.countDocuments(filter)
    ]);

    const successfulCount = await ReportExecution.countDocuments({ status: 'Completed' });
    const failedCount = await ReportExecution.countDocuments({ status: 'Failed' });

    return {
      executions,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      },
      stats: {
        successfulExecutions: successfulCount,
        failedExecutions: failedCount
      }
    };
  }
}

export default new ReportScheduleService();
