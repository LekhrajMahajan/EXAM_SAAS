import { BaseApiService } from './base.service';

export class QuestionsService extends BaseApiService<any> {
  constructor() {
    super('/questions');
  }
}

export class PapersService extends BaseApiService<any> {
  constructor() {
    super('/papers');
  }
}

export class PaperReviewService extends BaseApiService<any> {
  constructor() {
    super('/paper-reviews');
  }
}

export class PaperApprovalService extends BaseApiService<any> {
  constructor() {
    super('/paper-approvals');
  }
}

export const questionsApi = new QuestionsService();
export const papersApi = new PapersService();
export const paperReviewApi = new PaperReviewService();
export const paperApprovalApi = new PaperApprovalService();
