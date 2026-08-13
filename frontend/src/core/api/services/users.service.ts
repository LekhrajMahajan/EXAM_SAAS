import { BaseApiService } from './base.service';

export class CandidatesService extends BaseApiService<any> {
  constructor() {
    super('/candidates');
  }
}

export class EmployeesService extends BaseApiService<any> {
  constructor() {
    super('/employees');
  }
}

export const candidatesApi = new CandidatesService();
export const employeesApi = new EmployeesService();
