import { BaseRepository } from "../../common/base.repository";
import ImportExport from "./importExport.model";

import { ImportStatus, ExportStatus } from "./importExport.types";

class ImportExportRepository extends BaseRepository<any> {
  constructor() {
    super(ImportExport);
  }
  /*
    |--------------------------------------------------------------------------
    | Create Import History
    |--------------------------------------------------------------------------
    */

  async createImportHistory(payload: Record<string, unknown>) {
    return ImportExport.create({
      ...payload,

      operation: "IMPORT",

      status: ImportStatus.PENDING,
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Create Export History
    |--------------------------------------------------------------------------
    */

  async createExportHistory(payload: Record<string, unknown>) {
    return ImportExport.create({
      ...payload,

      operation: "EXPORT",

      status: ExportStatus.PENDING,
    });
  }



  /*
    |--------------------------------------------------------------------------
    | Update Import Status
    |--------------------------------------------------------------------------
    */

  async updateImportStatus(
    id: string,

    status: ImportStatus,

    result?: Record<string, unknown>,
  ) {
    return ImportExport.findByIdAndUpdate(
      id,

      {
        status,

        result,
      },

      {
        new: true,
      },
    );
  }

  /*
    |--------------------------------------------------------------------------
    | Update Export Status
    |--------------------------------------------------------------------------
    */

  async updateExportStatus(
    id: string,

    status: ExportStatus,

    result?: Record<string, unknown>,
  ) {
    return ImportExport.findByIdAndUpdate(
      id,

      {
        status,

        result,
      },

      {
        new: true,
      },
    );
  }

  /*
    |--------------------------------------------------------------------------
    | Delete History
    |--------------------------------------------------------------------------
    */

  async deleteHistory(id: string) {
    return ImportExport.findByIdAndDelete(id);
  }

  /*
    |--------------------------------------------------------------------------
    | Cancel Job
    |--------------------------------------------------------------------------
    */

  async cancelJob(id: string) {
    return ImportExport.findByIdAndUpdate(
      id,

      {
        status: "CANCELLED",
      },

      {
        new: true,
      },
    );
  }

  /*
    |--------------------------------------------------------------------------
    | Get Pending Jobs
    |--------------------------------------------------------------------------
    */

  async getPendingJobs() {
    return ImportExport.find({
      status: ImportStatus.PENDING,
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Get Processing Jobs
    |--------------------------------------------------------------------------
    */

  async getProcessingJobs() {
    return ImportExport.find({
      status: ImportStatus.PROCESSING,
    });
  }
}

export default new ImportExportRepository();
