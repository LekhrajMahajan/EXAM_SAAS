import mongoose from "mongoose";
import Employee from "./employee.model";
import { IEmployee, EmployeeStatus, EmployeeVerificationStatus } from "./employee.types";
import { BaseRepository } from "../../common/base.repository";

class EmployeeRepository extends BaseRepository<IEmployee> {
  constructor() {
    super(Employee as any, ["companyId", "branchId", "centerId", "reportingManager", "userId"]);
  }

  /*
  |--------------------------------------------------------------------------
  | Find All (Override for Search & Enterprise Filtering)
  |--------------------------------------------------------------------------
  */

  async findAll(filters: any, populateFields?: string[]): Promise<any> {
    const { search, searchFields, extraQuery = {}, sort, ...rest } = filters;

    const modifiedExtraQuery: any = { ...extraQuery };

    // 1. Handle Search across Name, Employee Code, Email, Mobile, Role, Department
    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      const searchTerms = search.trim().split(/\s+/);
      const termRegexes = searchTerms.map((term: string) => ({ $regex: term, $options: "i" }));

      modifiedExtraQuery.$or = [
        { employeeCode: searchRegex },
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { alternateMobile: searchRegex },
        { role: searchRegex },
        { department: searchRegex },
        { designation: searchRegex },
        {
          $and: termRegexes.map((regex: any) => ({
            $or: [{ firstName: regex }, { lastName: regex }],
          })),
        },
      ];
    }

    // 2. Handle Filters (Branch, Center, Role, Status, Verification, Joining Date, Reporting Manager)
    if (rest.branchId) modifiedExtraQuery.branchId = new mongoose.Types.ObjectId(rest.branchId as string);
    if (rest.centerId) modifiedExtraQuery.centerId = new mongoose.Types.ObjectId(rest.centerId as string);
    if (rest.role) modifiedExtraQuery.role = rest.role;
    if (rest.status) modifiedExtraQuery.status = rest.status;
    if (rest.verificationStatus) modifiedExtraQuery.verificationStatus = rest.verificationStatus;
    if (rest.reportingManager) modifiedExtraQuery.reportingManager = new mongoose.Types.ObjectId(rest.reportingManager as string);
    if (rest.department) modifiedExtraQuery.department = rest.department;
    if (rest.joiningDate) {
      const startOfDay = new Date(rest.joiningDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(rest.joiningDate);
      endOfDay.setHours(23, 59, 59, 999);
      modifiedExtraQuery.joiningDate = { $gte: startOfDay, $lte: endOfDay };
    }

    const modifiedFilters: any = {
      ...rest,
      extraQuery: modifiedExtraQuery,
    };
    if (sort) modifiedFilters.sort = sort;

    return super.findAll(modifiedFilters, populateFields);
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Employee Code
  |--------------------------------------------------------------------------
  */

  async findByEmployeeCode(companyId: string, employeeCode: string) {
    return Employee.findOne({
      companyId: new mongoose.Types.ObjectId(companyId),
      employeeCode: employeeCode.toUpperCase().trim(),
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Find By User ID
  |--------------------------------------------------------------------------
  */

  async findByUserId(userId: string) {
    return Employee.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      isDeleted: false,
    }).populate(["branchId", "centerId", "reportingManager"]);
  }

  /*
  |--------------------------------------------------------------------------
  | Find By Email
  |--------------------------------------------------------------------------
  */

  async findByEmail(companyId: string, email: string) {
    return Employee.findOne({
      companyId: new mongoose.Types.ObjectId(companyId),
      email: email.toLowerCase().trim(),
      isDeleted: false,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Find With Biometrics (including secret embedding)
  |--------------------------------------------------------------------------
  */

  async findWithBiometrics(id: string) {
    return Employee.findOne({
      _id: new mongoose.Types.ObjectId(id),
      isDeleted: false,
    }).select("+biometrics.encryptedEmbedding");
  }

  /*
  |--------------------------------------------------------------------------
  | Get Verification Status Breakdown (Aggregation)
  |--------------------------------------------------------------------------
  */

  async getVerificationStatusBreakdown(companyId?: string) {
    const match: any = { isDeleted: false };
    if (companyId) match.companyId = new mongoose.Types.ObjectId(companyId);

    const stats = await Employee.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$verificationStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {
      total: 0,
      PENDING: 0,
      APPROVED: 0,
      REJECTED: 0,
      DRAFT: 0,
    };

    stats.forEach((item) => {
      if (item._id in result) {
        (result as any)[item._id] = item.count;
      }
      result.total += item.count;
    });

    return result;
  }

  /*
  |--------------------------------------------------------------------------
  | Get Department Stats (Aggregation)
  |--------------------------------------------------------------------------
  */

  async getDepartmentStats(companyId?: string) {
    const match: any = { isDeleted: false };
    if (companyId) match.companyId = new mongoose.Types.ObjectId(companyId);

    return Employee.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 },
          activeCount: {
            $sum: { $cond: [{ $eq: ["$status", EmployeeStatus.ACTIVE] }, 1, 0] },
          },
          pendingVerification: {
            $sum: { $cond: [{ $eq: ["$verificationStatus", EmployeeVerificationStatus.PENDING] }, 1, 0] },
          },
        },
      },
      { $sort: { count: -1 } },
    ]);
  }

  /*
  |--------------------------------------------------------------------------
  | Bulk Update Helpers
  |--------------------------------------------------------------------------
  */

  async bulkUpdateStatus(ids: string[], status: EmployeeStatus, session?: mongoose.ClientSession) {
    const objectIds = ids.map((id) => new mongoose.Types.ObjectId(id));
    return Employee.updateMany(
      { _id: { $in: objectIds }, isDeleted: false },
      { $set: { status, updatedAt: new Date() } },
      { session }
    );
  }

  async bulkUpdateVerificationStatus(
    ids: string[],
    verificationStatus: EmployeeVerificationStatus,
    session?: mongoose.ClientSession
  ) {
    const objectIds = ids.map((id) => new mongoose.Types.ObjectId(id));
    return Employee.updateMany(
      { _id: { $in: objectIds }, isDeleted: false },
      { $set: { verificationStatus, updatedAt: new Date() } },
      { session }
    );
  }

  async find(filter: any) {
    return Employee.find(filter);
  }
}

export default new EmployeeRepository();

