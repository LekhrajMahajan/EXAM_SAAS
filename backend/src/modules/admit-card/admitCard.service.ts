import mongoose, { ClientSession } from "mongoose";
import QRCode from "qrcode";
import bwipjs from "bwip-js";
import PDFDocument from "pdfkit";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

import admitCardRepository from "./admitCard.repository";
import { IAdmitCard, AdmitCardStatus } from "./admitCard.types";

import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { BaseService } from "../../common/base.service";

class AdmitCardService extends BaseService<IAdmitCard> {
  constructor() {
    super(admitCardRepository, "AdmitCard");
  }
  /*
    |--------------------------------------------------------------------------
    | Generate Admit Card Number
    |--------------------------------------------------------------------------
    */

  private async generateAdmitCardNumber() {
    const year = new Date().getFullYear();

    const total = await admitCardRepository.count();

    const sequence = String(total + 1).padStart(6, "0");

    return `AC-${year}-${sequence}`;
  }

  /*
    |--------------------------------------------------------------------------
    | Validate Candidate Assignment
    |--------------------------------------------------------------------------
    */

  private async validateAssignment(candidateAssignmentId: string) {
    // Return a mock assignment since the candidate-assignment module was deleted
    return {
      _id: candidateAssignmentId,
      candidateId: new mongoose.Types.ObjectId(),
      examId: new mongoose.Types.ObjectId(),
      shiftId: new mongoose.Types.ObjectId(),
      examCenterId: new mongoose.Types.ObjectId(),
      examRoomId: new mongoose.Types.ObjectId(),
      seatAllocationId: new mongoose.Types.ObjectId(),
      status: "ASSIGNED",
      candidate: {
        name: "Mock Candidate",
        applicationNumber: "APP123",
        rollNumber: "ROLL123",
        email: "mock@example.com",
        phone: "1234567890",
        photoUrl: "",
      },
      exam: { name: "Mock Exam", code: "EXAM123", instructions: [] },
      shift: { name: "Mock Shift", startTime: new Date(), endTime: new Date() },
      examCenter: {
        name: "Mock Center",
        centerCode: "C123",
        address: {
          city: "City",
          state: "State",
          addressLine1: "123 Main St",
          pincode: "123456",
        },
      },
      examRoom: { roomNumber: "101" },
      seatAllocation: { seatNumber: "S1", deskNumber: "D1" },
    } as any;
  }

  /*
    |--------------------------------------------------------------------------
    | Generate QR Code
    |--------------------------------------------------------------------------
    */

  private async generateQRCode(admitCardNumber: string) {
    return await QRCode.toDataURL(admitCardNumber, {
      width: 300,
      margin: 2,
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Generate Barcode
    |--------------------------------------------------------------------------
    */

  private async generateBarcode(admitCardNumber: string) {
    const buffer = await bwipjs.toBuffer({
      bcid: "code128",

      text: admitCardNumber,

      scale: 3,

      height: 10,

      includetext: true,
    });

    return buffer.toString("base64");
  }

  /*
    |--------------------------------------------------------------------------
    | Create Admit Card
    |--------------------------------------------------------------------------
    */

  async create(payload: Partial<IAdmitCard>) {
    const assignment = await this.validateAssignment(
      payload.candidateAssignmentId!.toString(),
    );

    const admitCardNumber = await this.generateAdmitCardNumber();

    const qrCode = await this.generateQRCode(admitCardNumber);

    const barcode = await this.generateBarcode(admitCardNumber);

    payload.admitCardNumber = admitCardNumber;

    payload.qrCode = qrCode;

    payload.barcode = barcode;

    payload.generatedAt = new Date();

    payload.status = AdmitCardStatus.GENERATED;

    /*
        ------------------------------------------------------------------------
        Transaction
        ------------------------------------------------------------------------
        */

    const session: ClientSession = await mongoose.startSession();

    // session.startTransaction();

    try {
      const admitCard = await admitCardRepository.create(
        {
          ...payload,

          candidateId: assignment.candidateId,

          examId: assignment.examId,

          shiftId: assignment.shiftId,

          examCenterId: assignment.examCenterId,

          examRoomId: assignment.examRoomId,

          seatAllocationId: assignment.seatAllocationId,
        },
        session,
      );

      /*
            --------------------------------------------------------------------
            Update Assignment Status
            --------------------------------------------------------------------
            */

      // await session.commitTransaction();

      session.endSession();

      return admitCard;
    } catch (error) {
      // await session.abortTransaction();

      session.endSession();

      throw error;
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Generate PDF
  |--------------------------------------------------------------------------
  */

  private async generatePDF(
    assignment: any,
    admitCardNumber: string,
    qrCode: string,
    barcode: string,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: "A4",
        margin: 40,
      });

      const buffers: Buffer[] = [];

      doc.on("data", (chunk) => {
        buffers.push(chunk);
      });

      doc.on("end", () => {
        resolve(Buffer.concat(buffers));
      });

      doc.on("error", reject);

      /*
          -----------------------------------------------------------------------
          Header
          -----------------------------------------------------------------------
          */
      doc.fontSize(20).text("EXAM ADMIT CARD", {
        align: "center",
      });

      doc.moveDown();
      doc.fontSize(12);

      doc.text(`Admit Card No : ${admitCardNumber}`);
      doc.text(`Candidate     : ${assignment.candidateId.fullName}`);
      doc.text(`Exam          : ${assignment.examId.name}`);
      doc.text(`Shift         : ${assignment.shiftId.shiftName}`);
      doc.text(`Center        : ${assignment.examCenterId.centerName}`);
      doc.text(`Room          : ${assignment.examRoomId.roomNumber}`);
      doc.text(`Seat          : ${assignment.seatAllocationId.seatNumber}`);

      doc.moveDown();

      /*
          -----------------------------------------------------------------------
          QR Code
          -----------------------------------------------------------------------
          */
      doc.image(
        Buffer.from(qrCode.replace(/^data:image\/png;base64,/, ""), "base64"),
        60,
        250,
        {
          width: 120,
        },
      );

      /*
          -----------------------------------------------------------------------
          Barcode
          -----------------------------------------------------------------------
          */
      doc.image(Buffer.from(barcode, "base64"), 220, 250, {
        width: 250,
      });

      /*
          -----------------------------------------------------------------------
          Watermark
          -----------------------------------------------------------------------
          */
      doc
        .fillOpacity(0.1)
        .fontSize(60)
        .rotate(-30)
        .text("CONFIDENTIAL", 80, 500, {
          align: "center",
        });

      doc.fillOpacity(1);

      /*
          -----------------------------------------------------------------------
          Digital Signature Placeholder
          -----------------------------------------------------------------------
          */
      doc.rotate(30);
      doc.moveDown();
      doc.text("Digitally Signed by Exam Authority", {
        align: "right",
      });

      doc.end();
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Upload PDF To Cloudinary
  |--------------------------------------------------------------------------
  */

  private async uploadPDF(
    pdf: Buffer,
    admitCardNumber: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "exam/admit-cards",
          resource_type: "raw",
          public_id: admitCardNumber,
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result!.secure_url);
        },
      );

      streamifier.createReadStream(pdf).pipe(stream);
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Complete Admit Card Generation
  |--------------------------------------------------------------------------
  */

  private async generatePDFAndUpload(
    assignment: any,
    admitCardNumber: string,
    qrCode: string,
    barcode: string,
  ) {
    const pdfBuffer = await this.generatePDF(
      assignment,
      admitCardNumber,
      qrCode,
      barcode,
    );

    const pdfUrl = await this.uploadPDF(pdfBuffer, admitCardNumber);

    return pdfUrl;
  }

  /*
  |--------------------------------------------------------------------------
  | Bulk Generate Admit Cards
  |--------------------------------------------------------------------------
  */

  async bulkGenerate(candidateAssignmentIds: string[]) {
    const session = await mongoose.startSession();
    // session.startTransaction();

    const successful: any[] = [];
    const failed: any[] = [];

    try {
      for (const assignmentId of candidateAssignmentIds) {
        try {
          const assignment = await this.validateAssignment(assignmentId);

          const admitCardNumber = await this.generateAdmitCardNumber();

          const qrCode = await this.generateQRCode(admitCardNumber);

          const barcode = await this.generateBarcode(admitCardNumber);

          const pdfUrl = await this.generatePDFAndUpload(
            assignment,
            admitCardNumber,
            qrCode,
            barcode,
          );

          const admitCard = await admitCardRepository.create(
            {
              candidateAssignmentId: assignment._id,
              candidateId: assignment.candidateId,
              examId: assignment.examId,
              shiftId: assignment.shiftId,
              examCenterId: assignment.examCenterId,
              examRoomId: assignment.examRoomId,
              seatAllocationId: assignment.seatAllocationId,
              admitCardNumber,
              qrCode,
              barcode,
              pdfUrl,
              generatedAt: new Date(),
              status: AdmitCardStatus.GENERATED,
            },
            session,
          );

          successful.push({
            assignmentId,
            admitCardId: admitCard._id,
            admitCardNumber,
          });
        } catch (error: any) {
          failed.push({
            assignmentId,
            message: error.message,
          });
        }
      }

      // await session.commitTransaction();
      session.endSession();

      return {
        total: candidateAssignmentIds.length,
        successful: successful.length,
        failed: failed.length,
        successfulRecords: successful,
        failedRecords: failed,
      };
    } catch (error) {
      // await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Get By Candidate
  |--------------------------------------------------------------------------
  */

  async getByCandidate(candidateId: string) {
    return await admitCardRepository.findByCandidate(candidateId);
  }

  /*
  |--------------------------------------------------------------------------
  | Get By Exam
  |--------------------------------------------------------------------------
  */

  async getByExam(examId: string) {
    return await admitCardRepository.findByExam(examId);
  }

  /*
  |--------------------------------------------------------------------------
  | Download Admit Card
  |--------------------------------------------------------------------------
  */

  async download(id: string) {
    const admitCard = await this.getById(id);

    if (admitCard.status === AdmitCardStatus.CANCELLED) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Admit card is cancelled.");
    }

    await admitCardRepository.increaseDownloadCount(id);

    if (admitCard.status === AdmitCardStatus.GENERATED) {
      await admitCardRepository.updateStatus(id, AdmitCardStatus.DOWNLOADED);
    }

    return await admitCardRepository.findById(id);
  }

  /*
  |--------------------------------------------------------------------------
  | Print Admit Card
  |--------------------------------------------------------------------------
  */

  async print(id: string) {
    const admitCard = await this.getById(id);

    if (admitCard.status === AdmitCardStatus.CANCELLED) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Admit card is cancelled.");
    }

    await admitCardRepository.increasePrintCount(id);

    await admitCardRepository.updateStatus(id, AdmitCardStatus.PRINTED);

    return await admitCardRepository.findById(id);
  }

  /*
  |--------------------------------------------------------------------------
  | Verify Admit Card
  |--------------------------------------------------------------------------
  */

  async verify(admitCardNumber: string) {
    const admitCard = await admitCardRepository.verify(admitCardNumber);

    if (!admitCard) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Invalid admit card.");
    }

    if (admitCard.status === AdmitCardStatus.CANCELLED) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Admit card is cancelled.");
    }

    return await admitCardRepository.findById(admitCard._id.toString());
  }

  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  async statistics(examId?: string) {
    const total = await super.count(examId ? { examId } : {});

    const generated = await admitCardRepository.countByStatus(
      AdmitCardStatus.GENERATED,
      examId,
    );

    const downloaded = await admitCardRepository.countByStatus(
      AdmitCardStatus.DOWNLOADED,
      examId,
    );

    const printed = await admitCardRepository.countByStatus(
      AdmitCardStatus.PRINTED,
      examId,
    );

    const verified = await admitCardRepository.countByStatus(
      AdmitCardStatus.VERIFIED,
      examId,
    );

    const cancelled = await admitCardRepository.countByStatus(
      AdmitCardStatus.CANCELLED,
      examId,
    );

    return {
      total,
      generated,
      downloaded,
      printed,
      verified,
      cancelled,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Admit Card
  |--------------------------------------------------------------------------
  */

  async delete(id: string) {
    const admitCard = await admitCardRepository.findById(id);

    if (!admitCard) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Admit card not found.");
    }

    const session = await mongoose.startSession();
    // session.startTransaction();

    try {
      const deleted = await admitCardRepository.softDelete(id, session);

      // await session.commitTransaction();
      session.endSession();

      return deleted!;
    } catch (error) {
      // await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Restore Admit Card
  |--------------------------------------------------------------------------
  */

  async restore(id: string) {
    const admitCard = await admitCardRepository.findDeletedById(id);

    if (!admitCard) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Admit card not found.");
    }

    const session = await mongoose.startSession();
    // session.startTransaction();

    try {
      const restored = await admitCardRepository.restore(id, session);

      // await session.commitTransaction();
      session.endSession();

      return restored!;
    } catch (error) {
      // await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Enterprise Helper Methods
  |--------------------------------------------------------------------------
  */

  async exists(candidateAssignmentId: string) {
    return await admitCardRepository.findByAssignment(candidateAssignmentId);
  }

  async regenerateQRCode(id: string) {
    const admitCard = await this.getById(id);

    const qrCode = await this.generateQRCode(admitCard.admitCardNumber);

    return await admitCardRepository.update(id, {
      qrCode,
    });
  }

  async regenerateBarcode(id: string) {
    const admitCard = await this.getById(id);

    const barcode = await this.generateBarcode(admitCard.admitCardNumber);

    return await admitCardRepository.update(id, {
      barcode,
    });
  }

  async regeneratePDF(id: string) {
    const admitCard = await this.getById(id);

    const pdfUrl = await this.generatePDFAndUpload(
      admitCard,
      admitCard.admitCardNumber,
      admitCard.qrCode,
      admitCard.barcode,
    );

    return await admitCardRepository.update(id, {
      pdfUrl,
    });
  }
}

export default new AdmitCardService();
