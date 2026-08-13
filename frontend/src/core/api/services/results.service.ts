import { BaseApiService } from './base.service';

export class ResultsService extends BaseApiService<any> {
  constructor() {
    super('/results');
  }
}

export class MeritService extends BaseApiService<any> {
  constructor() {
    super('/merit');
  }
}

export class CertificatesService extends BaseApiService<any> {
  constructor() {
    super('/certificates');
  }
}

export const resultsApi = new ResultsService();
export const meritApi = new MeritService();
export const certificatesApi = new CertificatesService();
