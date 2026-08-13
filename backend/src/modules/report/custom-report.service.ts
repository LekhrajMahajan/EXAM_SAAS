import mongoose from "mongoose";
import CustomReport, { ICustomReport } from "./custom-report.model";
import metadataService from "./metadata.service";
import ApiError from "../../utils/ApiError";
import httpStatus from "http-status";

class CustomReportService {
  async create(data: Partial<ICustomReport>) {
    return CustomReport.create(data as any);
  }

  async getAll(query: any) {
    const filter: any = {};
    if (query.companyId) {
      filter.companyId = query.companyId;
    }
    
    // Default to show public reports and reports created by the user or within company
    if (query.visibility === "PRIVATE") {
      filter.generatedBy = query.userId;
    }

    const reports = await CustomReport.find(filter)
      .sort({ createdAt: -1 })
      .populate("generatedBy", "firstName lastName");

    return reports;
  }

  async getById(id: string) {
    const report = await CustomReport.findById(id).populate("generatedBy", "firstName lastName");
    if (!report) {
      throw new ApiError(httpStatus.NOT_FOUND, "Custom report not found");
    }
    return report;
  }

  async update(id: string, data: Partial<ICustomReport>) {
    const report = await CustomReport.findByIdAndUpdate(id, data, { new: true });
    if (!report) {
      throw new ApiError(httpStatus.NOT_FOUND, "Custom report not found");
    }
    return report;
  }

  async delete(id: string) {
    const report = await CustomReport.findByIdAndDelete(id);
    if (!report) {
      throw new ApiError(httpStatus.NOT_FOUND, "Custom report not found");
    }
    return { deleted: true };
  }

  async execute(id: string, queryParams: any = {}) {
    const report = await this.getById(id);
    return this.runDynamicQuery(report as any, queryParams.limit);
  }

  async preview(data: Partial<ICustomReport>) {
    // Run with a limit for preview
    return this.runDynamicQuery(data as any, 10);
  }

  async clone(id: string, generatedBy: string) {
    const report = await this.getById(id);
    const reportObj = report.toObject();
    
    delete (reportObj as any)._id;
    delete (reportObj as any).createdAt;
    delete (reportObj as any).updatedAt;
    
    reportObj.reportName = `${reportObj.reportName} (Clone)`;
    reportObj.generatedBy = new mongoose.Types.ObjectId(generatedBy) as any;
    reportObj.status = "DRAFT";
    
    return CustomReport.create(reportObj);
  }

  private buildMatchStage(filters: any): any {
    if (!filters || Object.keys(filters).length === 0) return {};

    const buildCondition = (filter: any): any => {
      if (filter.logicalOperator) {
        // Nested AND/OR
        if (!filter.conditions || filter.conditions.length === 0) return {};
        const conditions = filter.conditions.map((c: any) => buildCondition(c)).filter((c: any) => Object.keys(c).length > 0);
        if (conditions.length === 0) return {};
        
        return filter.logicalOperator === "AND" 
          ? { $and: conditions }
          : { $or: conditions };
      }

      // Simple condition
      if (!filter.field || !filter.operator) return {};
      
      const { field, operator, value } = filter;
      switch (operator) {
        case "equals": return { [field]: value };
        case "not_equals": return { [field]: { $ne: value } };
        case "gt": return { [field]: { $gt: value } };
        case "gte": return { [field]: { $gte: value } };
        case "lt": return { [field]: { $lt: value } };
        case "lte": return { [field]: { $lte: value } };
        case "contains": return { [field]: { $regex: value, $options: "i" } };
        case "starts_with": return { [field]: { $regex: `^${value}`, $options: "i" } };
        case "ends_with": return { [field]: { $regex: `${value}$`, $options: "i" } };
        case "in": return { [field]: { $in: Array.isArray(value) ? value : [value] } };
        case "not_in": return { [field]: { $nin: Array.isArray(value) ? value : [value] } };
        case "is_null": return { [field]: null };
        case "is_not_null": return { [field]: { $ne: null } };
        case "between": 
          if (Array.isArray(value) && value.length === 2) {
            return { [field]: { $gte: value[0], $lte: value[1] } };
          }
          return {};
        default: return {};
      }
    };

    return buildCondition(filters);
  }

  private async runDynamicQuery(config: ICustomReport, limit?: number) {
    if (!config.dataSource) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Data source is required");
    }

    const metadata = metadataService.getDataSourceMetadata(config.dataSource);
    if (!metadata) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Invalid data source: ${config.dataSource}`);
    }

    const collectionName = metadata.collectionName;
    
    // We execute the raw pipeline against the database collection directly
    const pipeline: any[] = [];

    // 1. $match (Filters)
    const matchStage = this.buildMatchStage(config.filters);
    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    // 2. $group (Grouping & Aggregations)
    if (config.grouping && config.grouping.length > 0) {
      const groupStage: any = { _id: {} };
      
      // Setup grouping keys
      config.grouping.forEach(g => {
        groupStage._id[g] = `$${g}`;
      });

      // Setup aggregations
      if (config.aggregations && config.aggregations.length > 0) {
        config.aggregations.forEach(agg => {
          const alias = `${agg.field}_${agg.type}`;
          switch(agg.type) {
            case "count": groupStage[alias] = { $sum: 1 }; break;
            case "sum": groupStage[alias] = { $sum: `$${agg.field}` }; break;
            case "avg": groupStage[alias] = { $avg: `$${agg.field}` }; break;
            case "min": groupStage[alias] = { $min: `$${agg.field}` }; break;
            case "max": groupStage[alias] = { $max: `$${agg.field}` }; break;
          }
        });
      } else {
        // If grouped but no aggregations, just count as default
        groupStage.count = { $sum: 1 };
      }
      
      pipeline.push({ $group: groupStage });

      // Transform _id back to root for flat structure
      pipeline.push({
        $replaceRoot: { newRoot: { $mergeObjects: ["$_id", "$$ROOT"] } }
      });
      pipeline.push({ $project: { _id: 0 } });
    }

    // 3. $sort
    if (config.sorting && config.sorting.length > 0) {
      const sortStage: any = {};
      config.sorting.forEach(s => {
        sortStage[s.field] = s.order === "asc" ? 1 : -1;
      });
      pipeline.push({ $sort: sortStage });
    } else {
      // Default sort
      pipeline.push({ $sort: { createdAt: -1 } });
    }

    // 4. $project (Fields selection & formatting)
    // Only apply project if we didn't group (grouping drastically changes the shape of the data)
    if ((!config.grouping || config.grouping.length === 0) && config.fields && config.fields.length > 0) {
      const projectStage: any = {};
      config.fields.filter(f => !f.hidden).forEach(f => {
        projectStage[f.name] = 1;
      });
      // Always include _id unless explicitly excluded
      if (!projectStage["_id"]) {
        projectStage["_id"] = 1;
      }
      pipeline.push({ $project: projectStage });
    }

    // 5. Limit
    if (limit) {
      pipeline.push({ $limit: Number(limit) });
    }

    try {
      const db = mongoose.connection.db;
      if (!db) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Database connection not ready");
      }
      const result = await db.collection(collectionName).aggregate(pipeline).toArray();
      
      return {
        data: result,
        totalRows: result.length,
        pipeline, // Return pipeline for debugging/transparency
      };
    } catch (error: any) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to execute report query: ${error.message}`);
    }
  }
}

export default new CustomReportService();
