import Company from "./company.model";
import { ICompany } from "./company.types";
import { BaseRepository } from "../../common/base.repository";

class CompanyRepository extends BaseRepository<ICompany> {
  constructor() {
    super(Company, [], ["companyName", "companyCode", "email", "phone"]);
  }

  async findByCompanyCode(companyCode: string) {
    return await Company.findOne({
      companyCode,
      isDeleted: false,
    });
  }

  async findByEmail(email: string) {
    return await Company.findOne({
      email,
      isDeleted: false,
    });
  }
}

export default new CompanyRepository();
