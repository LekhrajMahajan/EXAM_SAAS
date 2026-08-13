import { BaseApiService } from './base.service';

export class AttendanceService extends BaseApiService<any> {
  constructor() {
    super('/attendance');
  }
}

export class BiometricService extends BaseApiService<any> {
  constructor() {
    super('/biometric');
  }
}

export class ExamArenaService extends BaseApiService<any> {
  constructor() {
    super('/exam-arena');
  }
}

export const attendanceApi = new AttendanceService();
export const biometricApi = new BiometricService();
export const examArenaApi = new ExamArenaService();
