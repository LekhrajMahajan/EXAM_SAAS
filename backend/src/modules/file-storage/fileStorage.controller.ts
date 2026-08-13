import { Request, Response } from "express";
import httpStatus from "http-status";
import path from "path";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";

import fileStorageService from "./fileStorage.service";
import fileStorageRepository from "./fileStorage.repository";
import { FileStorageDocument, FileType } from "./fileStorage.types";

/*
|--------------------------------------------------------------------------
| Upload File
|--------------------------------------------------------------------------
*/

export const uploadFile = asyncHandler(async (req: Request, res: Response) => {
  const {
    fileName,
    originalName,
    mimeType,
    fileType,
    size,
    url,
    storageProvider,
    isPublic,
    folder,
    bucket,
    checksum,
    companyId,
    branchId,
    candidateId,
    employeeId,
    examId,
    paperId,
    questionId,
    certificateId,
    reportId,
    metadata,
  } = req.body || {};

  const ext = originalName
    ? path.extname(originalName).replace(".", "").toLowerCase()
    : fileName
    ? path.extname(fileName).replace(".", "").toLowerCase()
    : "";

  const uploadedBy = req.user?.userId;

  const file = await fileStorageService.upload({
    fileName: fileName || originalName,
    originalName: originalName || fileName,
    extension: ext,
    mimeType,
    fileType,
    size,
    url,
    path: url || "",
    storageProvider: storageProvider || "LOCAL",
    isPublic: isPublic ?? false,
    folder,
    bucket,
    checksum,
    uploadedBy: uploadedBy as any,
    companyId,
    branchId,
    candidateId,
    employeeId,
    examId,
    paperId,
    questionId,
    certificateId,
    reportId,
    metadata,
  }) as FileStorageDocument;

  return sendResponse(res, httpStatus.CREATED, {
    success: true,
    message: "File uploaded successfully.",
    data: {
      fileId: (file as any)._id,
      fileName: file.fileName,
      originalName: file.originalName,
      fileUrl: file.url,
      extension: file.extension,
      mimeType: file.mimeType,
      size: file.size,
      fileType: file.fileType,
      storageProvider: file.storageProvider,
      isPublic: file.isPublic,
      status: file.status,
      createdAt: (file as any).createdAt,
    },
  });
});

/*
|--------------------------------------------------------------------------
| Bulk Upload
|--------------------------------------------------------------------------
*/

export const bulkUpload = asyncHandler(async (req: Request, res: Response) => {
  const files = await fileStorageService.bulkUpload(req.body?.files || []);

  sendResponse(res, httpStatus.CREATED, {
    success: true,
    message: "Files uploaded successfully.",
    data: files,
  });
});

/*
|--------------------------------------------------------------------------
| Get File By Id
|--------------------------------------------------------------------------
*/

export const getFileById = asyncHandler(async (req: Request, res: Response) => {
  const file = await fileStorageService.getById(req.params.id as string);

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "File fetched successfully.",
    data: file,
  });
});

/*
|--------------------------------------------------------------------------
| Download File
|--------------------------------------------------------------------------
*/

export const downloadFile = asyncHandler(
  async (req: Request, res: Response) => {
    const file = await fileStorageService.download(req.params.id as string);

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "File download information fetched successfully.",
      data: file,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Preview File
|--------------------------------------------------------------------------
*/

export const previewFile = asyncHandler(async (req: Request, res: Response) => {
  const file = await fileStorageService.preview(req.params.id as string);

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "File preview fetched successfully.",
    data: file,
  });
});

/*
|--------------------------------------------------------------------------
| Get All Files
|--------------------------------------------------------------------------
*/

export const getFiles = asyncHandler(async (req: Request, res: Response) => {
  const {
    page,
    limit,
    companyId,
    candidateId,
    employeeId,
    examId,
    paperId,
    questionId,
    certificateId,
    reportId,
    fileType,
    storageProvider,
    status,
    isPublic,
  } = req.query as Record<string, any>;

  const result = await fileStorageRepository.findAll({
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 20,
    companyId,
    candidateId,
    employeeId,
    examId,
    paperId,
    questionId,
    certificateId,
    reportId,
    fileType,
    storageProvider,
    status,
    isPublic: isPublic === "true" ? true : isPublic === "false" ? false : undefined,
  });

  return sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Files fetched successfully.",
    data: {
      files: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    },
  });
});

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export const dashboard = asyncHandler(async (req: Request, res: Response) => {
  const dashData = await fileStorageService.dashboard(
    req.query.companyId as string | undefined,
  );

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "File storage dashboard fetched successfully.",
    data: dashData,
  });
});

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

export const statistics = asyncHandler(async (req: Request, res: Response) => {
  const stats = await fileStorageService.statistics(
    req.query.companyId as string | undefined,
  );

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "File storage statistics fetched successfully.",
    data: stats,
  });
});

/*
|--------------------------------------------------------------------------
| Soft Delete
|--------------------------------------------------------------------------
*/

export const softDeleteFile = asyncHandler(
  async (req: Request, res: Response) => {
    const file = await fileStorageService.softDelete(req.params.id as string);

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "File deleted successfully.",
      data: file,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Restore
|--------------------------------------------------------------------------
*/

export const restoreFile = asyncHandler(async (req: Request, res: Response) => {
  const file = await fileStorageService.restore(req.params.id as string);

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "File restored successfully.",
    data: file,
  });
});

/*
|--------------------------------------------------------------------------
| Update File
|--------------------------------------------------------------------------
*/

export const updateFile = asyncHandler(async (req: Request, res: Response) => {
  const file = await fileStorageService.updateMetadata(req.params.id as string, req.body);

  return sendResponse(res, httpStatus.OK, {
    success: true,
    message: "File metadata updated successfully.",
    data: file,
  });
});

/*
|--------------------------------------------------------------------------
| Get Reports
|--------------------------------------------------------------------------
*/

export const getReports = asyncHandler(async (req: Request, res: Response) => {
  const companyId = req.query.companyId as string | undefined;

  const [total, images, pdfs, documents, videos] = await Promise.all([
    fileStorageRepository.count(companyId),
    fileStorageRepository.countByType(FileType.IMAGE, companyId),
    fileStorageRepository.countByType(FileType.PDF, companyId),
    fileStorageRepository.countByType(FileType.DOCUMENT, companyId),
    fileStorageRepository.countByType(FileType.VIDEO, companyId),
  ]);

  return sendResponse(res, httpStatus.OK, {
    success: true,
    message: "File storage report generated successfully.",
    data: {
      summary: {
        totalFiles: total,
        images,
        pdfs,
        documents,
        videos,
      },
    },
  });
});
