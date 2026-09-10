import fs from "fs/promises";
import path from "path";

import PDFDocument from "pdfkit";

import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";

import fileStorageService from "../file-storage/fileStorage.service";

import {
    IGeneratePdf,
    PdfOrientation,
    PdfPageSize,
    PdfType,
} from "./pdf.types";

class PdfService {
    /*
    |--------------------------------------------------------------------------
    | Generate PDF
    |--------------------------------------------------------------------------
    */
    async generate(
        payload: IGeneratePdf
    ) {
        const uploadDirectory = path.join(
            process.cwd(),
            "uploads",
            "pdf"
        );

        await fs.mkdir(
            uploadDirectory,
            {
                recursive: true,
            }
        );

        const filePath = path.join(
            uploadDirectory,
            `${payload.fileName}.pdf`
        );

        const document = new PDFDocument({
            size:
                payload.pageSize ??
                PdfPageSize.A4,
            layout:
                payload.orientation ??
                PdfOrientation.PORTRAIT,
            margin: 50,
        });

        const stream =
            await fs.open(
                filePath,
                "w"
            );

        document.pipe(
            stream.createWriteStream()
        );

        document
            .fontSize(22)
            .text(
                payload.title,
                {
                    align: "center",
                }
            );

        document.moveDown();

        document
            .fontSize(12)
            .text(
                payload.html
            );

        document.end();

        await new Promise<void>((resolve) => {
            document.on(
                "end",
                () => resolve()
            );
        });

        return {
            filePath,
            fileName:
                `${payload.fileName}.pdf`,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Save To File Storage
    |--------------------------------------------------------------------------
    */
    async saveToFileStorage(
        payload: IGeneratePdf,
        filePath: string
    ) {
        return fileStorageService.upload({
            originalName:
                `${payload.fileName}.pdf`,
            fileName:
                `${payload.fileName}.pdf`,
            extension: "pdf",
            mimeType:
                "application/pdf",
            fileType: "PDF" as any,
            url: filePath,
            path: filePath,
            size: 0,
            isPublic: false,
            metadata:
                payload.metadata,
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Generate Certificate
    |--------------------------------------------------------------------------
    */
    async generateCertificate(
        payload: IGeneratePdf
    ) {
        return this.generate({
            ...payload,
            type: PdfType.CERTIFICATE,
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Generate Admit Card
    |--------------------------------------------------------------------------
    */
    async generateAdmitCard(
        payload: IGeneratePdf
    ) {
        return this.generate({
            ...payload,
            type: PdfType.ADMIT_CARD,
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Generate Result PDF
    |--------------------------------------------------------------------------
    */
    async generateResult(
        payload: IGeneratePdf
    ) {
        return this.generate({
            ...payload,
            type: PdfType.RESULT,
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Generate Merit List
    |--------------------------------------------------------------------------
    */
    async generateMeritList(
        payload: IGeneratePdf
    ) {
        return this.generate({
            ...payload,
            type: PdfType.MERIT_LIST,
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Generate Question Paper
    |--------------------------------------------------------------------------
    */
    async generateQuestionPaper(
        payload: IGeneratePdf
    ) {
        return this.generate({
            ...payload,
            type: PdfType.QUESTION_PAPER,
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Generate Report
    |--------------------------------------------------------------------------
    */
    async generateReport(
        payload: IGeneratePdf
    ) {
        return this.generate({
            ...payload,
            type: PdfType.REPORT,
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Generate Custom PDF
    |--------------------------------------------------------------------------
    */
    async generateCustomPdf(
        payload: IGeneratePdf
    ) {
        return this.generate(payload);
    }

    /*
    |--------------------------------------------------------------------------
    | Download PDF
    |--------------------------------------------------------------------------
    */
    async download(
        payload: IGeneratePdf
    ) {
        const pdf = await this.generate(
            payload
        );

        return {
            fileName: pdf.fileName,
            filePath: pdf.filePath,
            downloadUrl: pdf.filePath,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Preview PDF
    |--------------------------------------------------------------------------
    */
    async preview(
        payload: IGeneratePdf
    ) {
        const pdf = await this.generate(
            payload
        );

        return {
            fileName: pdf.fileName,
            filePath: pdf.filePath,
            previewUrl: pdf.filePath,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Generate And Upload
    |--------------------------------------------------------------------------
    */
    async generateAndUpload(
        payload: IGeneratePdf
    ) {
        const pdf = await this.generate(
            payload
        );

        const uploadedFile =
            await this.saveToFileStorage(
                payload,
                pdf.filePath
            );

        return {
            pdf,
            uploadedFile,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Delete Local PDF
    |--------------------------------------------------------------------------
    */
    async deleteLocalPdf(
        filePath: string
    ) {
        try {
            await fs.unlink(
                filePath
            );
            return true;
        } catch {
            throw new ApiError(
                HTTP_STATUS.NOT_FOUND,
                "PDF file not found."
            );
        }
    }
}

export default new PdfService();
