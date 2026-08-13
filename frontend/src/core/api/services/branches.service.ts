import { BaseApiService } from './base.service';

export class BranchesService extends BaseApiService<any> {
  constructor() {
    super('/branches');
  }
}

export const branchesApi = new BranchesService();
