import { BaseApiService } from './base.service';

export class ExamsService extends BaseApiService<any> {
  constructor() {
    super('/exams');
  }
}

export class ShiftsService extends BaseApiService<any> {
  constructor() {
    super('/shifts');
  }
}

export class AdmitCardsService extends BaseApiService<any> {
  constructor() {
    super('/admit-cards');
  }
}

export const examsApi = new ExamsService();
export const shiftsApi = new ShiftsService();
export const admitCardsApi = new AdmitCardsService();
