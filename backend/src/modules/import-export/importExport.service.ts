import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";
import importExportRepository from "./importExport.repository";
import {
    IExportRequest,
    IImportRequest,
} from "./importExport.types";

import { BaseService } from "../../common/base.service";

class ImportExportService extends BaseService<any> {
    constructor() {
        super(importExportRepository, "Import / Export history");
    }
    /*
    |--------------------------------------------------------------------------
    | Import Data
    |--------------------------------------------------------------------------
    */
    async importData(
        payload: IImportRequest,
        createdBy: string
    ) {
        const history =
            await importExportRepository.createImportHistory({
                ...payload,
                createdBy,
                startedAt: new Date(),
            });

        /*
        |--------------------------------------------------------------------------
        | TODO
        |--------------------------------------------------------------------------
        |
        | Parse CSV
        | Parse Excel
        | Parse JSON
        | Validate Data
        | Bulk Insert
        |
        */

        return history;
    }

    /*
    |--------------------------------------------------------------------------
    | Export Data
    |--------------------------------------------------------------------------
    */
    async exportData(
        payload: IExportRequest,
        createdBy: string
    ) {
        const history =
            await importExportRepository.createExportHistory({
                ...payload,
                createdBy,
                startedAt: new Date(),
            });

        /*
        |--------------------------------------------------------------------------
        | TODO
        |--------------------------------------------------------------------------
        |
        | Fetch Records
        | Generate CSV
        | Generate XLSX
        | Generate JSON
        | Upload File
        |
        */

        return history;
    }

    /*
    |--------------------------------------------------------------------------
    | Validate Import
    |--------------------------------------------------------------------------
    */
    async validateImport(
        payload: IImportRequest
    ) {
        /*
        |--------------------------------------------------------------------------
        | TODO
        |--------------------------------------------------------------------------
        |
        | Validate File
        | Validate Headers
        | Validate Records
        |
        */

        return {
            valid: true,
            errors: [],
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Get History
    |--------------------------------------------------------------------------
    */
    async getHistory() {
        const result = await super.getAll({});
        return result.data;
    }

    /*
    |--------------------------------------------------------------------------
    | Get History By Id
    |--------------------------------------------------------------------------
    */
    async getHistoryById(
        id: string
    ) {
        return super.getById(id);
    }

    /*
    |--------------------------------------------------------------------------
    | Download Export
    |--------------------------------------------------------------------------
    */
    async downloadExport(
        id: string
    ) {
        const history = await this.getHistoryById(id);

        return {
            fileName: history.fileName,
            fileUrl: history.fileUrl,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Cancel Job
    |--------------------------------------------------------------------------
    */
    async cancelJob(
        id: string
    ) {
        const history = await this.getHistoryById(id);

        if (history.status === "COMPLETED") {
            throw new ApiError(
                HTTP_STATUS.BAD_REQUEST,
                "Completed job cannot be cancelled."
            );
        }

        return importExportRepository.cancelJob(id);
    }

    /*
    |--------------------------------------------------------------------------
    | Delete History
    |--------------------------------------------------------------------------
    */
    async deleteHistory(
        id: string
    ) {
        await this.getHistoryById(id);

        await importExportRepository.deleteHistory(id);

        return {
            deleted: true,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Generate Template
    |--------------------------------------------------------------------------
    */
    async generateTemplate(
        type: string
    ) {
        /*
        |--------------------------------------------------------------------------
        | TODO
        |--------------------------------------------------------------------------
        |
        | Generate CSV Template
        | Generate Excel Template
        |
        */

        return {
            type,
            fileUrl: `/templates/${type}.xlsx`,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Candidate Import
    |--------------------------------------------------------------------------
    */
    async processCandidateImport(
        historyId: string
    ) {
        /*
        |--------------------------------------------------------------------------
        | TODO
        |--------------------------------------------------------------------------
        |
        | Read Excel
        | Validate Candidate
        | Bulk Insert
        |
        */

        return {
            historyId,
            imported: 0,
            failed: 0,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Question Import
    |--------------------------------------------------------------------------
    */
    async processQuestionImport(
        historyId: string
    ) {
        /*
        |--------------------------------------------------------------------------
        | TODO
        |--------------------------------------------------------------------------
        |
        | Read Excel
        | Validate Question
        | Bulk Insert
        |
        */

        return {
            historyId,
            imported: 0,
            failed: 0,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Employee Import
    |--------------------------------------------------------------------------
    */
    async processEmployeeImport(
        historyId: string
    ) {
        /*
        |--------------------------------------------------------------------------
        | TODO
        |--------------------------------------------------------------------------
        |
        | Read Excel
        | Validate Employee
        | Bulk Insert
        |
        */

        return {
            historyId,
            imported: 0,
            failed: 0,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Exam Export
    |--------------------------------------------------------------------------
    */
    async processExamExport(
        historyId: string
    ) {
        /*
        |--------------------------------------------------------------------------
        | TODO
        |--------------------------------------------------------------------------
        |
        | Fetch Exams
        | Generate Excel
        | Upload File
        |
        */

        return {
            historyId,
            exported: 0,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Result Export
    |--------------------------------------------------------------------------
    */
    async processResultExport(
        historyId: string
    ) {
        /*
        |--------------------------------------------------------------------------
        | TODO
        |--------------------------------------------------------------------------
        |
        | Fetch Results
        | Generate PDF / Excel
        | Upload File
        |
        */

        return {
            historyId,
            exported: 0,
        };
    }
}

export default new ImportExportService();
