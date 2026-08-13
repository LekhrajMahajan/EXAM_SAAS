import { ReportTemplate, IReportTemplate } from "./report-template.model";
import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";
import mongoose from "mongoose";

class ReportTemplateService {
  async getTemplates(query: any) {
    const { search, isPublished, page = 1, limit = 10 } = query;
    const filter: any = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }
    if (isPublished !== undefined) {
      filter.isPublished = isPublished === 'true';
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [templates, total] = await Promise.all([
      ReportTemplate.find(filter)
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      ReportTemplate.countDocuments(filter)
    ]);

    const activeCount = await ReportTemplate.countDocuments({ isPublished: true });

    return {
      templates,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      },
      stats: {
        totalTemplates: total,
        activeTemplates: activeCount
      }
    };
  }

  async getTemplateById(id: string) {
    const template = await ReportTemplate.findById(id).populate("createdBy", "name email");
    if (!template) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Report template not found");
    }
    return template;
  }

  async createTemplate(data: Partial<IReportTemplate>, userId: string) {
    const template = new ReportTemplate({
      ...data,
      createdBy: new mongoose.Types.ObjectId(userId)
    });
    await template.save();
    return template;
  }

  async updateTemplate(id: string, data: Partial<IReportTemplate>) {
    const template = await ReportTemplate.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!template) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Report template not found");
    }
    return template;
  }

  async deleteTemplate(id: string) {
    const template = await ReportTemplate.findByIdAndDelete(id);
    if (!template) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Report template not found");
    }
    return template;
  }

  async togglePublishStatus(id: string) {
    const template = await ReportTemplate.findById(id);
    if (!template) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Report template not found");
    }
    template.isPublished = !template.isPublished;
    await template.save();
    return template;
  }
}

export default new ReportTemplateService();
