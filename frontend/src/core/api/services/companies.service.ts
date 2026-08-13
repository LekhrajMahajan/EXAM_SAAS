import { BaseApiService } from './base.service';

export class CompaniesService extends BaseApiService<any> {
  constructor() {
    super('/companies');
  }
}

export const companiesApi = new CompaniesService();
