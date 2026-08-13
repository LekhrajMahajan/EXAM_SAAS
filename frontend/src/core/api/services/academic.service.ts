import { BaseApiService } from './base.service';

export class CentersService extends BaseApiService<any> {
  constructor() {
    super('/centers');
  }
}

export const centersApi = new CentersService();

export class SubjectsService extends BaseApiService<any> {
  constructor() {
    super('/subjects');
  }
}

export const subjectsApi = new SubjectsService();
