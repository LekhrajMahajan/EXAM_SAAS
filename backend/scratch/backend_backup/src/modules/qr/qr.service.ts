import fs from "fs/promises";
import path from "path";

import QRCode from "qrcode";

import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";

import fileStorageService from "../file-storage/fileStorage.service";

import {
    IGenerateQr,
    QrErrorCorrection,
    QrImageFormat,
} from "./qr.types";

class QrService {
    /*
    |--------------------------------------------------------------------------
    | Generate QR
    |--------------------------------------------------------------------------
    */
    async generate(
        payload: IGenerateQr
    ) {
        const uploadDirectory = path.join(
            process.cwd(),
            "uploads",
            "qr"
        );

        await fs.mkdir(
            uploadDirectory,
            {
                recursive: true,
            }
        );

        const extension =
            payload.imageFormat ??
            QrImageFormat.PNG;

        const fileName =
            `${payload.fileName}.${extension}`;

        const filePath = path.join(
            uploadDirectory,
            fileName
        );

        await QRCode.toFile(
            filePath,
            payload.text,
            {
                width:
                    payload.width ??
                    400,
                margin:
                    payload.margin ??
                    2,
                errorCorrectionLevel:
                    payload.errorCorrectionLevel ??
                    QrErrorCorrection.HIGH,
            }
        );

        return {
            fileName,
            filePath,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Save To File Storage
    |--------------------------------------------------------------------------
    */
    async saveToFileStorage(
        payload: IGenerateQr,
        filePath: string
    ) {
        return fileStorageService.upload({
            originalName:
                `${payload.fileName}.png`,
            fileName:
                `${payload.fileName}.png`,
            extension: "png",
            mimeType: "image/png",
            fileType: "IMAGE" as any,
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
    | Generate Certificate QR
    |--------------------------------------------------------------------------
    */
    async generateCertificate(
        payload: IGenerateQr
    ) {
        return this.generate(
            payload
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Generate Admit Card QR
    |--------------------------------------------------------------------------
    */
    async generateAdmitCard(
        payload: IGenerateQr
    ) {
        return this.generate(
            payload
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Generate Result QR
    |--------------------------------------------------------------------------
    */
    async generateResult(
        payload: IGenerateQr
    ) {
        return this.generate(
            payload
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Generate Employee QR
    |--------------------------------------------------------------------------
    */
    async generateEmployee(
        payload: IGenerateQr
    ) {
        return this.generate(
            payload
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Generate Candidate QR
    |--------------------------------------------------------------------------
    */
    async generateCandidate(
        payload: IGenerateQr
    ) {
        return this.generate(
            payload
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Generate Paper QR
    |--------------------------------------------------------------------------
    */
    async generatePaper(
        payload: IGenerateQr
    ) {
        return this.generate(
            payload
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Generate Exam QR
    |--------------------------------------------------------------------------
    */
    async generateExam(
        payload: IGenerateQr
    ) {
        return this.generate(
            payload
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Generate Custom QR
    |--------------------------------------------------------------------------
    */
    async generateCustom(
        payload: IGenerateQr
    ) {
        return this.generate(
            payload
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Verify QR
    |--------------------------------------------------------------------------
    */
    async verify(
        text: string
    ) {
        if (!text) {
            throw new ApiError(
                HTTP_STATUS.BAD_REQUEST,
                "QR content is required."
            );
        }

        return {
            valid: true,
            text,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Generate And Upload
    |--------------------------------------------------------------------------
    */
    async generateAndUpload(
        payload: IGenerateQr
    ) {
        const qr =
            await this.generate(
                payload
            );

        const uploadedFile =
            await this.saveToFileStorage(
                payload,
                qr.filePath
            );

        return {
            qr,
            uploadedFile,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Delete Local QR
    |--------------------------------------------------------------------------
    */
    async deleteLocalQr(
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
                "QR file not found."
            );
        }
    }
}

export default new QrService();
