import { BaseApiService } from './base.service';

export class ReportsService extends BaseApiService<any> { constructor() { super('/reports'); } }
export class NotificationsService extends BaseApiService<any> { constructor() { super('/notifications'); } }
export class SupportService extends BaseApiService<any> { constructor() { super('/support'); } }
export class PaymentsService extends BaseApiService<any> { constructor() { super('/payments'); } }
export class AuditService extends BaseApiService<any> { constructor() { super('/audit'); } }
export class SystemSettingsService extends BaseApiService<any> { constructor() { super('/system-settings'); } }
export class ImportExportService extends BaseApiService<any> { constructor() { super('/import-export'); } }
export class FileManagementService extends BaseApiService<any> { constructor() { super('/files'); } }

export const reportsApi = new ReportsService();
export const notificationsApi = new NotificationsService();
export const supportApi = new SupportService();
export const paymentsApi = new PaymentsService();
export const auditApi = new AuditService();
export const systemSettingsApi = new SystemSettingsService();
export const importExportApi = new ImportExportService();
export const fileManagementApi = new FileManagementService();
